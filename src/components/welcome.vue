<template>
  <panel :title="`Welcome ${jwtUser.firstName}!`" aria-id="welcome">
    <div style="display: flex; justify-content: space-around;">
      <p>
        Welcome to the dCloud <strong>Webex Contact Center Version 8</strong> Instant Demo Toolbox!
      </p>
    </div>
    <br>
    <div style="display: flex; justify-content: space-around;">
      <p>
        Click <strong>Join Webex Support Room</strong> to get help, ask questions, and suggest new features.
      </p>
    </div>
    <br>
    <div class="buttons" style="justify-content: space-around;">
      <b-button
      type="is-primary"
      rounded
      :disabled="isWorking"
      @click="clickJoinSupportRoom"
      >
        {{ isWorking ? 'Working...' : 'Join Webex Support Room' }}
      </b-button>
    </div>

    <b-message type="is-success" has-icon icon="information">
      Please read the 
      <a :href="demoGuideUrl" target="_blank">
        <strong>Demo Guide</strong>
      </a>
      before to post any question on the support room.
    </b-message>
    <br><br>
    <b-message type="is-success" has-icon icon="information">
      Please watch the 
      <a :href="videoServicenow" target="_blank">
        <strong>WxCC v8 Videos before you start the demo</strong>
      </a>
      before to post any question on the support room. <br>
    </b-message>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      demoGuideUrl: 'https://publish-p104909-e1035859.adobeaemcloud.com/content/cisco-dcloud/us/en/heretto.html?for-path=webex-contact-center-v8',
      videoServicenow: 'https://app.vidcast.io/pages/1623560b-4ddf-4fb6-8673-ff8f328226a3',
      servicenowLayout: '',
      labGuideUrl: ''
    }
  },

  computed: {
    ...mapGetters([
      'jwtUser',
      'working'
    ]),
    isWorking () {
      return this.working.webex.joinSupportRoom
    }
  },

  methods: {
    ...mapActions([
      'joinSupportRoom'
    ]),
    clickJoinSupportRoom () {
      this.$buefy.dialog.prompt({
        title: 'Join Webex Support Space',
        message: `What email address do you use for Webex?`,
        rounded: true,
        confirmText: 'Submit',
        type: 'is-success',
        inputAttrs: {
          value: this.jwtUser.email,
          placeholder: 'Your Webex Email Address'
        },
        onConfirm: (email) => {
          this.joinSupportRoom(email)
        }
      })
    }
  }
}
</script>