<template>
  <panel :title="`Welcome ${jwtUser.firstName}!`" aria-id="welcome">
    <p>
      Welcome to the dCloud
      <strong>Webex Contact Center Version 8</strong>
      Instant Demo Toolbox!
      <br>
      Join our Webex support space to get help, ask questions, and
      suggest new features:
    </p>
    <b-field>
      <b-button
      type="is-primary"
      rounded
      expanded
      :disabled="isWorking"
      @click="clickJoinSupportRoom"
      >
        {{ isWorking ? 'Working...' : 'Join Support Space' }}
      </b-button>
    </b-field>
    <p>IMPORTANT: Please read the demo guide:
      <a href="https://dcloud-docs.cisco.com/c/r/dcloud-docs/sites/en_us/collaboration/out_wxcc_v8/b_webex_contact_center_v8.html?dc=rtp" target="_blank">here</a>  
      before to post any question on the support room.

    </p>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
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