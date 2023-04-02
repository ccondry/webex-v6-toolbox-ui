import * as types from '../mutation-types'
import {addUrlQueryParams} from '../../utils'

const state = {
  // list of demo verticals
  verticals: [],
  // the base configuration for this demo
  demoInfo: {},
  // dcloud session ID and datacenter information
  instance: {},
  datacenterNames: {
    'RTP': 'US East',
    'SJC': 'US West',
    'LON': 'EMEAR',
    'SNG': 'APJ'
  },
  vpnMap: {
    'RTP': 'vpn.cc.dc-01.com',
    'SNG': 'vpn.cc.dc-02.com',
    'LON': 'vpn.cc.dc-03.com',
    'SJC': 'vpn.cc.dc-05.com'
  }
}

const mutations = {
  [types.SET_VERTICALS] (state, data) {
    state.verticals = data
  },
  [types.SET_DEMO_INFO] (state, data) {
    state.demoInfo = data[0]
  },
  [types.SET_INSTANCE] (state, data) {
    console.log('SET_INSTANCE', data)
    state.instance = data[0]
  }
}

const getters = {
  mobileWebAppUrl: (state, getters) => {
    const url = 'https://mc.cxdemo.net/'
    const query = {
      datacenter: 'webex',
      sessionId: 'v6',
      userId: getters.jwtUser.id,
      username: getters.jwtUser.firstName + ' ' + getters.jwtUser.lastName
    }
    return addUrlQueryParams(url, query)
  },
  caCertUrl: () => 'https://mm-static.cxdemo.net/dcloud-root-ca.crt',
  datacenter: state => {
    // return the datacenter according to the browser URL
    if (getters.isProduction) {
      // get current hostname of the browser location
      const hostname = window.location.hostname
      // get the subdomain
      const subdomain = hostname.split('.').shift()
      // get the datacenter part
      const datacenter = subdomain.split('-').pop().toUpperCase()
      return datacenter
    } else {
      // use RTP when in development
      return 'RTP'
    }
  },
  sessionId: state => state.instance.session,
  datacenterDisplayName: (state, getters) => {
    return state.datacenterNames[getters.datacenter]
  },
  // is this demo locked to disable provisioning?
  isLocked: () => {
    return true
    // return getters.demoInfo.locked === true
  },
  // which vertical the demo website is set to 
  verticals: state => state.verticals,
  // the customer-side demo website link
  brandDemoLink (state, getters) {
    try {
      return addUrlQueryParams('https://mm-brand.cxdemo.net', {
        session: getters.sessionId,
        datacenter: getters.datacenter,
        userId: getters.jwtUser.id
      })
    } catch (e) {
      return null
    }
  },
  // the base demo configuration for this instant demo
  demoInfo: state => state.demoInfo,
  // the instant demo instance information, like session ID and datacenter
  instance: state => state.instance,
  // the RDP workstation info
  rdpAddress: (state, getters) => {
    return `${getters.rdpFqdn} (${getters.rdpIp})`
  },
  rdpIp: () => {
    return '198.18.134.210'
  },
  rdpFqdn: () => {
    return 'rdp.dcloud.cisco.com'
  },
  // the VPN address
  vpnAddress: (state, getters) => {
    try {
      return state.vpnMap[getters.datacenter] || ''
    } catch (e) {
      return ''
    }
  }
}

const actions = {
  getDemoInfo ({dispatch, getters}) {
    return dispatch('fetch', {
      group: 'dcloud',
      type: 'demo',
      url: getters.endpoints.demoInfo,
      options: {
        query: {
          demo: 'webex',
          version: 'v6',
          instant: true
        }
      },
      mutation: types.SET_DEMO_INFO,
      message: 'get demo base config'
    })
  },
  getVerticals ({dispatch, getters}) {
    return dispatch('fetch', {
      group: 'dcloud',
      type: 'verticals',
      url: getters.endpoints.vertical,
      options: {
        query: {
          // all: true,
          owner: getters.jwtUser.username,
          summary: true
        }
      },
      mutation: types.SET_VERTICALS,
      message: 'get verticals list'
    })
  },
  async getInstance ({dispatch, getters}) {
    // get instant demo instance information, for the session ID and datacenter
    dispatch('fetch', {
      group: 'dcloud',
      type: 'instance',
      url: getters.endpoints.instance,
      options: {
        query: {
          datacenter: getters.datacenter,
          demo: 'webex',
          version: 'v6'
        }
      },
      mutation: types.SET_INSTANCE,
      message: 'get dCloud session/instance information'
    })
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
