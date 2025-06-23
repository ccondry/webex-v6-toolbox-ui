import {ToastProgrammatic as Toast} from 'buefy'

const state = {
}

const getters = {
}

const actions = {
  async joinSupportRoom ({dispatch, getters}, email) {
    const response = await dispatch('fetch', {
      group: 'webex',
      type: 'joinSupportRoom',
      url: getters.endpoints.webex,
      options: {
        method: 'POST',
        body: {personEmail: email}
      },
      showNotification: false,
      message: 'join Webex support room'
    })
    if (response instanceof Error) {
      if (response.status === 409) {
        Toast.open({
          type: 'is-success',
          message: `You are already in the support space.`
        })
      } else {
        Toast.open({
          message: `Failed to add you to the support space: ${response.message}`,
          type: 'is-danger',
          duration: 6 * 1000,
          queue: false
        })
      }
    } else {
      Toast.open({
        type: 'is-success',
        message: `You have been added to the support space.`
      })
    }
  }
}

export default {
  actions,
  getters,
  state
}
