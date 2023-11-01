import * as types from '../mutation-types.js'

const state = {
  outboundSendOneResponse: null,
  outboundUploadResponse: [],
  outboundProvisionStatus: null,
}

const getters = {
  outboundSendOneResponse: state => state.outboundSendOneResponse,
  outboundUploadResponse: state => state.outboundUploadResponse,
  outboundProvisionStatus: state => state.outboundProvisionStatus,
}

const mutations = {
  [types.SET_OUTBOUND_SEND_ONE_RESPONSE] (state, data) {
    state.outboundSendOneResponse = data[0]
  },
  [types.SET_OUTBOUND_UPLOAD_RESPONSE] (state, data) {
    state.outboundUploadResponse = data
  },
  [types.SET_OUTBOUND_PROVISION_STATUS] (state, data) {
    state.outboundProvisionStatus = data.provisioned
  },
}

const actions = {
  async clearOutboundUploadResponse ({commit}) {
    commit(types.SET_OUTBOUND_UPLOAD_RESPONSE, [])
  },
  async sendOneOutboundContact ({dispatch, getters}, body) {
    return dispatch('fetch', {
      group: 'outbound',
      type: 'upload',
      url: getters.endpoints.outboundContacts,
      options: {
        method: 'POST',
        body: [body],
      },
      mutation: types.SET_OUTBOUND_SEND_ONE_RESPONSE,
      message: 'send one contact to the outbound dialer'
    })
  },
  async uploadOutboundContacts ({dispatch, getters}, body) {
    return dispatch('fetch', {
      group: 'outbound',
      type: 'upload',
      url: getters.endpoints.outboundContacts,
      options: {
        method: 'POST',
        body,
      },
      mutation: types.SET_OUTBOUND_UPLOAD_RESPONSE,
      message: 'upload contacts to the outbound dialer'
    })
  },
  async getOutboundProvisionStatus ({dispatch, getters}) {
    await dispatch('fetch', {
      group: 'outbound',
      type: 'provision',
      url: getters.endpoints.outboundProvision,
      mutation: types.SET_OUTBOUND_PROVISION_STATUS,
      message: 'get outbound campaign provision status'
    })
  },
  async requestOutboundProvision ({dispatch, getters}) {
    await dispatch('fetch', {
      group: 'outbound',
      type: 'provision',
      url: getters.endpoints.outboundProvision,
      options: {
        method: 'POST'
      },
      message: 'request outbound campaign provision'
    })
    // get updated user data
    await dispatch('getUser')
  },
}

export default {
  actions,
  getters,
  mutations,
  state,
}