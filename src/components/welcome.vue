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
        <strong>Service Now Video</strong>
      </a>
      before to post any question on the support room. <br>Also make sure you download Service Now Desktop Layout <a href="https://mm-static.cxdemo.net/wxcc/ServiceNow.zip"><strong>here</strong></a>, and upload it before you do the demo.
    </b-message>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      demoGuideUrl: 'https://publish-p104909-e1035859.adobeaemcloud.com/content/cisco-dcloud/us/en/heretto.html?for-path=webex-contact-center-v8',
      videoServicenow: 'https://app.vidcast.io/share/39cf4d84-82d6-4cd6-960f-ea4936ecb9a3',
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