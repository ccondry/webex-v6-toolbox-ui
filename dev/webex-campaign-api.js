const fs = require('fs')
const http = require('http')
const path = require('path')

function loadEnvFile () {
  const envPath = path.join(__dirname, '..', '.env')
  if (!fs.existsSync(envPath)) {
    return
  }
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/)
    if (match && (match[1] === 'WEBEX_CC_TOKEN' || !process.env[match[1]])) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
    }
  }
}

// https://developer.webex.com/webex-contact-center/docs/api/v1/contact-lists/create-contact-list
const baseUrl = 'https://api.wxcc-us1.cisco.com'
const campaignGroupName = 'WebexCampaign'
const campaignNames = {
  US: 'WebexCampaign_US1',
  UK: 'WebexCampaign_UK1',
}
const fieldNames = {
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phoneNumber',
  reason: 'reason',
}

function getAccessToken () {
  loadEnvFile()
  const token = process.env.WEBEX_CC_TOKEN
  if (!token) {
    throw Error('Webex Contact Center token is not available. Set WEBEX_CC_TOKEN in .env.')
  }
  return token
}

async function wxcc (token, url, options = {}) {
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch (e) {
    data = null
  }
  if (!response.ok) {
    const message = (data && (data.message || (data.error && JSON.stringify(data.error)))) || text || response.statusText
    throw Error('Webex API ' + response.status + ' ' + message)
  }
  return data || {}
}

async function findCampaign (token, region) {
  const campaignName = campaignNames[region]
  if (!campaignName) {
    throw Error('Select a campaign region: US or UK')
  }
  const url = `${baseUrl}/v3/campaign-management/campaign-groups/${encodeURIComponent(campaignGroupName)}/campaigns?page=1&pageSize=100`
  const data = await wxcc(token, url)
  const campaigns = data.campaigns || []
  const match = campaigns.find(campaign => {
    return String(campaign.campaignName).toLowerCase() === campaignName.toLowerCase()
  })
  if (!match) {
    const found = campaigns.map(campaign => campaign.campaignName).join(', ') || 'none'
    throw Error(`Campaign ${campaignName} was not found in group ${campaignGroupName}. Campaigns found: ${found}`)
  }
  return match
}

async function createContactList (token, campaignId) {
  const url = `${baseUrl}/v3/campaign-management/campaigns/${encodeURIComponent(campaignId)}/contact-list`
  return wxcc(token, url, {
    method: 'POST',
    body: {
      supportedChannels: ['Voice'],
      activationTimeLagMinutes: 0,
    },
  })
}

function contactValue (contact, key) {
  if (key === 'phone') {
    return contact.phoneNumber || contact.phone || ''
  }
  return contact[key] == null ? '' : String(contact[key])
}

function toApiContact (contact) {
  return {
    contactAttributes: Object.keys(fieldNames).map(key => ({
      fieldName: fieldNames[key],
      value: String(contactValue(contact, key)),
    })),
  }
}

async function addContacts (token, campaignId, contactListId, contacts) {
  const url = `${baseUrl}/v3/campaign-management/campaigns/${encodeURIComponent(campaignId)}/contact-list/${encodeURIComponent(contactListId)}/contacts`
  const response = await wxcc(token, url, {
    method: 'POST',
    body: {
      contacts: contacts.map(toApiContact),
    },
  })
  const accepted = response.outcome === 'Queued' || response.outcome === 'Success' || response.statusCode === 0
  return contacts.map(contact => ({
    Contact: contact,
    Result: accepted,
    ErrorDescription: accepted ? '' : (response.summary || response.message || 'Contact was not accepted'),
  }))
}

async function uploadContacts (region, contacts) {
  const token = getAccessToken()
  const campaign = await findCampaign(token, region)
  const contactList = await createContactList(token, campaign.campaignId)
  if (!contactList.contactListId) {
    throw Error(contactList.summary || contactList.message || 'Contact list was not created')
  }
  const results = await addContacts(token, campaign.campaignId, contactList.contactListId, contacts)
  return {
    campaignId: campaign.campaignId,
    campaignName: campaign.campaignName,
    contactListId: contactList.contactListId,
    contacts: results,
  }
}

// https://developer.webex.com/webex-contact-center/docs/api/v1/customer-identification/search-for-an-identity-via-aliases
const jdsBaseUrl = 'https://api-jds.wxdap-produs1.webex.com/admin/v1/api/person'
const jdsWorkspaceId = '6455acb3180bc312874a7855'

function userIdFromAuthorization (header) {
  if (!header) {
    throw Error('You are not authenticated.')
  }
  const token = header.replace(/^Bearer\s+/i, '')
  const payload = token.split('.')[1]
  if (!payload) {
    throw Error('You are not authenticated.')
  }
  const user = JSON.parse(Buffer.from(payload, 'base64url').toString())
  if (!user.id) {
    throw Error('You are not authenticated.')
  }
  return String(user.id)
}

async function findJdsIdentity (userId) {
  const token = getAccessToken()
  const url = `${jdsBaseUrl}/workspace-id/${jdsWorkspaceId}/aliases/${encodeURIComponent(userId)}`
  const response = await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    },
  })
  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch (e) {
    data = null
  }
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    const message = (data && data.message) || response.statusText
    throw Error('JDS API ' + response.status + ' ' + message)
  }
  return data && Array.isArray(data.data) ? data.data[0] || null : null
}

function send (res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5005',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  })
  res.end(body === undefined ? '' : JSON.stringify(body))
}

async function saveJdsIdentity (userId, body) {
  const existing = await findJdsIdentity(userId)
  if (!existing) {
    throw Error('No JDS customer was found for your account.')
  }
  const payload = { ...body }
  for (const key of ['id', 'aliases', 'organizationId', 'workspaceId', 'override', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']) {
    delete payload[key]
  }
  if (!Array.isArray(payload.customerId)) {
    payload.customerId = []
  }
  payload.customerId = payload.customerId.filter(value => {
    return String(value).length !== 4 || value === userId
  })
  if (!payload.customerId.includes(userId)) {
    payload.customerId.push(userId)
  }
  const token = getAccessToken()
  const url = `${jdsBaseUrl}/workspace-id/${jdsWorkspaceId}/person-id/${encodeURIComponent(existing.id)}`
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch (e) {
    data = null
  }
  if (!response.ok) {
    const message = (data && data.message) || response.statusText
    throw Error('JDS API ' + response.status + ' ' + message)
  }
  if (data && data.id) {
    return data
  }
  if (data && data.data && data.data.id) {
    return data.data
  }
  return { ...payload, id: existing.id }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 204, {})
  }
  const requestPath = (req.url || '').split('?')[0]
  if (requestPath === '/jds/identity') {
    try {
      const userId = userIdFromAuthorization(req.headers.authorization)
      if (req.method === 'GET') {
        return send(res, 200, await findJdsIdentity(userId))
      }
      if (req.method === 'PUT') {
        const chunks = []
        for await (const chunk of req) {
          chunks.push(chunk)
        }
        const body = JSON.parse(Buffer.concat(chunks).toString() || '{}')
        return send(res, 200, await saveJdsIdentity(userId, body))
      }
    } catch (e) {
      console.log('JDS identity request failed:', e.message)
      return send(res, 500, {message: e.message})
    }
    return send(res, 404, {message: 'Not found'})
  }
  if (req.method !== 'POST' || requestPath !== '/contacts') {
    return send(res, 404, {message: 'Not found'})
  }

  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  let body
  try {
    body = JSON.parse(Buffer.concat(chunks).toString() || '{}')
  } catch (e) {
    return send(res, 400, {message: 'Request body must be JSON'})
  }

  const contacts = body.contacts
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return send(res, 400, {message: 'Add at least one contact'})
  }
  if (contacts.length > 10) {
    return send(res, 400, {message: 'You cannot upload more than 10 contacts'})
  }

  try {
    const response = await uploadContacts(body.region, contacts)
    return send(res, 200, response)
  } catch (e) {
    console.log('Webex Campaign upload failed:', e.message)
    return send(res, 500, {message: e.message})
  }
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    return
  }
  console.log('Webex Campaign API failed to start:', error.message)
})

server.listen(5056, '127.0.0.1', () => {
  console.log('Webex Campaign API http://127.0.0.1:5056/contacts')
})
