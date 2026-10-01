import * as types from '../mutation-types.js'

export const campaignRegions = [
  {region: 'US', campaignName: 'WebexCampaign_US1', label: 'US'},
  {region: 'UK', campaignName: 'WebexCampaign_UK1', label: 'UK'},
]

const state = {
  webexCampaignSendOneResponse: null,
  webexCampaignUploadResponse: null,
}

const getters = {
  campaignRegions: () => campaignRegions,
  webexCampaignSendOneResponse: state => state.webexCampaignSendOneResponse,
  webexCampaignUploadResponse: state => state.webexCampaignUploadResponse,
}

const mutations = {
  [types.SET_WEBEX_CAMPAIGN_SEND_ONE_RESPONSE] (state, data) {
    state.webexCampaignSendOneResponse = data
  },
  [types.SET_WEBEX_CAMPAIGN_UPLOAD_RESPONSE] (state, data) {
    state.webexCampaignUploadResponse = data
  },
}

const actions = {
  async clearWebexCampaignUploadResponse ({commit}) {
    commit(types.SET_WEBEX_CAMPAIGN_UPLOAD_RESPONSE, null)
  },
  async sendOneWebexCampaignContact ({dispatch, getters}, body) {
    return dispatch('fetch', {
      group: 'webexCampaign',
      type: 'upload',
      url: getters.endpoints.webexCampaignContacts,
      options: {
        method: 'POST',
        body: {
          region: body.region,
          contacts: [{
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            reason: body.reason,
          }],
        },
      },
      showNotification: true,
      mutation: types.SET_WEBEX_CAMPAIGN_SEND_ONE_RESPONSE,
      message: 'send one contact to Webex Campaign'
    })
  },
  async uploadWebexCampaignContacts ({dispatch, getters}, body) {
    return dispatch('fetch', {
      group: 'webexCampaign',
      type: 'upload',
      url: getters.endpoints.webexCampaignContacts,
      options: {
        method: 'POST',
        body,
      },
      showNotification: true,
      mutation: types.SET_WEBEX_CAMPAIGN_UPLOAD_RESPONSE,
      message: 'upload contacts to Webex Campaign'
    })
  },
}

export default {
  actions,
  getters,
  mutations,
  state,
}
