import {
  DialogProgrammatic as Dialog,
  ToastProgrammatic as Toast
} from 'buefy/src'

import * as types from '../mutation-types'

// parse a JWT payload into a JSON object
function parseJwt (token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

const state = {
  jwt: null,
  user: null
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  },
  [types.SET_USER] (state, data) {
    state.user = data
  }
}

const getters = {
  user: state => state.user,
  userDemoConfig: state => {
    try {
      return state.user.demo['webex-v6'] || {}
    } catch (e) {
      return {}
    }
  },
  isQa: state => {
    try {
      return state.user.groups.includes('QA')
    } catch (e) {
      return false
    }
  },
  isAdminSu: (state, getters) => {
    try {
      return getters.jwtUser.suJwt
    } catch (e) {
      return false
    }
  },
  isAdmin: (state, getters) => {
    try {
      return getters.jwtUser.admin
    } catch (e) {
      return false
    }
  },
  jwt: state => state.jwt,
  isLoggedIn: (state, getters) => {
    try {
      return getters.jwtUser.email.length > 0
    } catch (e) {
      return false
    }
  },
  jwtUser: state => {
    try {
      return parseJwt(state.jwt)
    } catch (e) {
      return {}
    }
  },
  isProvisioned: (state, getters) => {
    // user provision is complete
    try {
      return getters.userDemoConfig.provision === 'complete'
    } catch (e) {
      return false
    }
  },
  isProvisionStarted: (state, getters) => {
    // provision started
    try {
      return getters.userDemoConfig.provision === 'started'
    } catch (e) {
      return false
    }
  }
}

const actions = {
  async logout ({dispatch, commit, getters}) {
    try {
      const response = await dispatch('fetch', {
        group: 'user',
        type: 'logout',
        url: getters.endpoints.logout,
        options: {
          method: 'POST'
        },
        message: 'logout'
      })
      // did we get a new JWT (from logging out of switch-user)?
      if (response.jwt) {
        // save new JWT
        dispatch('setJwt', response.jwt)
      } else {
        // remove JWT
        dispatch('unsetJwt')
      }
    } catch (e) {
      console.log(e)
    }
  },
  async deprovisionUser ({dispatch, getters}, password) {
    try {
      await dispatch('saveUserDemoConfig', {provision: 'delete'})
      dispatch('getUser')
    } catch (e) {
      console.log(e)
    }
  },
  async provisionUser ({dispatch, getters}, {password, imiEmail}) {
    try {
      // start user provision
      await dispatch('fetch', {
        group: 'user',
        type: 'provision',
        message: 'provision user',
        url: getters.endpoints.provision,
        options: {
          method: 'POST',
          body: {
            demo: 'webex',
            version: 'v6',
            password,
            imiEmail
          }
        }
      })
      // update user data
      dispatch('getUser')
    } catch (e) {
      console.log(e)
    }
  },
  async resetPassword ({dispatch, getters}, password) {
    // request reset user VPN password
    await dispatch('fetch', {
      group: 'user',
      type: 'resetPassword',
      message: 'reset VPN password',
      showNotification: true,
      url: getters.endpoints.resetPassword,
      options: {
        method: 'POST',
        body: {
          demo: 'webex',
          version: 'v6',
          password
        }
      }
    })
    // get updated user data
    await dispatch('getUser')
  },
  async changeWebexConnectEmail ({dispatch, getters}, email) {
    // change the user's Webex Connect email
    const response = await dispatch('fetch', {
      group: 'user',
      type: 'changeImiEmail',
      message: 'Change Webex Connect email',
      showNotification: true,
      url: getters.endpoints.imiChangeEmail,
      options: {
        method: 'POST',
        body: {email}
      }
    })
    // if success
    if (!(response instanceof Error)) {
      try {
        // update user data now
        await dispatch('getUser')
        // update user data until imiEmailStatus is no longer 'working'
        // avoid infinite loops with maxRetries
        let retryCount = 0
        const maxRetries = 50
        while (getters.userDemoConfig.imiEmailStatus === 'working' && retryCount < maxRetries) {
          // wait a moment
          await sleep(5000)
          // update user data again
          await dispatch('getUser')
          // increment counter
          retryCount++
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  resendWebexConnectEmail ({dispatch, getters}) {
    // re-send the Webex Connect invitation email
    return dispatch('fetch', {
      group: 'user',
      type: 'imiResend',
      message: 'Re-send Webex Connect invitation email',
      showNotification: true,
      url: getters.endpoints.imiResend,
      options: {
        method: 'POST'
      }
    })
  },
  getUser ({dispatch, getters}) {
    dispatch('fetch', {
      group: 'user',
      type: 'details',
      url: getters.endpoints.user,
      message: 'get user details',
      mutation: types.SET_USER
    })
  },
  async saveUserDemoConfig ({dispatch, getters}, body) {
    const response = await dispatch('fetch', {
      group: 'user',
      type: 'demoConfig',
      url: getters.endpoints.userDemoConfig,
      options: {
        method: 'POST',
        body,
        query: {
          id: 'webex-v6'
        }
      },
      message: 'Save demo configuration',
      showNotification: true
    })
    if (response instanceof Error) {
      // error
    } else {
      // success
      Toast.open({
        message: 'Saved your demo configuration.',
        type: 'is-success'
      })
      // refresh state data
      dispatch('getUser')
    }
  },
  setJwt ({commit, dispatch}, jwt) {
    try {
      // test parse JWT to user JSON
      parseJwt(jwt)
      // put JWT in state
      commit(types.SET_JWT, jwt)
      // put JWT in localStorage
      window.localStorage.setItem('jwt', jwt)
      // get provision info for this user
      dispatch('getUser')
    } catch (e) {
      // parseJwt failed - delete this invalid JWT
      dispatch('unsetJwt')
    }
  },
  unsetJwt ({commit}) {
    // remove JWT from state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
  },
  login ({dispatch, getters}) {
    if (getters.isProduction) {
      // production - forward to auth page for SSO
      window.location = '/auth'
    } else {
      // development - prompt for JWT
      Dialog.prompt({
        title: 'Log In',
        message: `Enter your JWT:`,
        onConfirm: (jwt) => {
          dispatch('setJwt', jwt)
        },
        canCancel: false,
        confirmText: 'Log In',
        type: 'is-success',
        rounded: true
      })
    }
  },
  async checkJwt ({dispatch, getters}) {
    dispatch('setWorking', {group: 'user', type: 'login', value: true})
    // check jwt in browser local storage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token, check the web service to see if it's still valid
    if (jwt !== null && jwt.length > 40) {
      console.log('found existing JWT in localStorage')
      // store JWT in state
      dispatch('setJwt', jwt)
    } else {
      // no JWT found - make the user log in
      dispatch('login')
    }
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}