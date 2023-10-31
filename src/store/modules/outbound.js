import {timezones} from './timezones.js'
import * as types from '../mutation-types.js'

const state = {
  timezones,
  outboundSendOneResponse: null,
  outboundUploadResponse: null,
}

const getters = {
  timezones: state => state.timezones,
  outboundSendOneResponse: state => state.outboundSendOneResponse,
  outboundUploadResponse: state => state.outboundUploadResponse,
}

const mutations = {
  [types.SET_OUTBOUND_SEND_ONE_RESPONSE] (state, data) {
    state.outboundSendOneResponse = data[0]
  },
  [types.SET_OUTBOUND_UPLOAD_RESPONSE] (state, data) {
    state.outboundUploadResponse = data
  },
}

const actions = {
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
}

export default {
  actions,
  getters,
  mutations,
  state,
}