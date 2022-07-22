import * as types from '../mutation-types'

const state = {
  desktopLayout: null,
  globalDesktopLayout: null
}

const mutations = {
  [types.SET_DESKTOP_LAYOUT] (state, data) {
    state.desktopLayout = data
  },
  [types.SET_GLOBAL_DESKTOP_LAYOUT] (state, data) {
    state.globalDesktopLayout = data
  }
}

const getters = {
  desktopLayout: state => state.desktopLayout,
  globalDesktopLayout: state => state.globalDesktopLayout
}

const actions = {
  async getDesktopLayout ({dispatch, getters}) {
    const group = 'webex'
    const type = 'desktopLayout'
    if (!getters.loading[group][type])
    return dispatch('fetch', {
      group,
      type,
      url: getters.endpoints.layout,
      showNotification: false,
      message: 'get agent desktop layout',
      mutation: types.SET_DESKTOP_LAYOUT
    })
  },
  async getGlobalDesktopLayout ({dispatch, getters}) {
    return dispatch('fetch', {
      group: 'webex',
      type: 'globalDesktopLayout',
      url: getters.endpoints.globalLayout,
      showNotification: false,
      message: 'get global desktop layout',
      mutation: types.SET_GLOBAL_DESKTOP_LAYOUT
    })
  },
  async updateDesktopLayout ({dispatch, getters}, body) {
    // update the user desktop layout JSON
    console.log('updateDesktopLayout', body)
    const response = await dispatch('fetch', {
      group: 'webex',
      type: 'desktopLayout',
      url: getters.endpoints.layout,
      showNotification: true,
      message: 'Update agent desktop layout',
      options: {
        method: 'PUT',
        body
      }
    })
    if (response instanceof Error) {
      // 
    } else {
      // get updated user desktop layout from server
      await dispatch('getDesktopLayout')
    }
  },
  async uploadLogoImage ({dispatch, getters}, {name, data}) {
    // console.log('upload desktop layout image')
    const response = await dispatch('fetch', {
      group: 'webex',
      type: 'desktopLayout',
      url: getters.endpoints.image,
      showNotification: true,
      message: 'Upload logo image',
      options: {
        method: 'POST',
        body: {
          name,
          node: "logo",
          vertical: "webex-v6",
          data
        }
      }
    })
    if (response instanceof Error) {
      // 
      console.log('uploadLogoImage error:', response)
    } else {
      console.log('response', response)
      // get the current layout, whether user or global
      const currentLayout = getters.desktopLayout || getters.globalDesktopLayout
      // create a copy of the layout
      const layoutCopy = JSON.parse(JSON.stringify(currentLayout))
      // set the logo image URL
      layoutCopy.logo = response.url.url
      // update user layout
      await dispatch('updateDesktopLayout', layoutCopy)
      // dispatch('getDesktopLayout')
    }
  },
  async uploadBackgroundImage ({dispatch, getters}, {name, data}) {
    // console.log('upload desktop layout image')
    const response = await dispatch('fetch', {
      group: 'webex',
      type: 'desktopLayout',
      url: getters.endpoints.image,
      showNotification: true,
      message: 'Upload background image',
      options: {
        method: 'POST',
        body: {
          name,
          node: "background",
          vertical: "webex-v6",
          data
        }
      }
    })
    if (response instanceof Error) {
      // 
      console.log('uploadBakgroundImage error:', response)
    } else {
      console.log('response', response)
      // get the current layout, whether user or global
      const currentLayout = getters.desktopLayout || getters.globalDesktopLayout
      // create a copy of the layout
      const layoutCopy = JSON.parse(JSON.stringify(currentLayout))
      // set the logo image URL
      layoutCopy.landingPageIllustration = response.url.url
      // update user layout
      await dispatch('updateDesktopLayout', layoutCopy)
      // dispatch('getDesktopLayout')
    }
  }  
}

module.exports = {
  actions,
  getters,
  state,
  mutations
}