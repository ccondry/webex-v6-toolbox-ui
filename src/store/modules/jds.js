import * as types from '../mutation-types'

const state = {
  identity: null
}

const mutations = {
  [types.SET_JDS_IDENTITY] (state, data) {
    state.identity = data
  }
}

const getters = {
  jdsIdentity: state => state.identity
}

const actions = {
  async getJdsIdentity ({dispatch, getters}) {
    return await dispatch('fetch', {
      group: 'jdsIdentity',
      type: 'get',
      url: getters.endpoints.jds.identity,
      message: 'Get JDS identity',
      showNotification: false,
      mutation: types.SET_JDS_IDENTITY
    })
  },
  async saveJdsIdentity ({dispatch, getters}, body) {
    return await dispatch('fetch', {
      group: 'jdsIdentity',
      type: 'save',
      url: getters.endpoints.jds.identity,
      options: {
        method: 'PUT',
        body
      },
      message: 'Save JDS identity',
      showNotification: true,
      mutation: types.SET_JDS_IDENTITY
    })
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}