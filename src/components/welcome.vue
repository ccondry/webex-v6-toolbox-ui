<template>
  <panel :title="`Welcome ${jwtUser.firstName}!`" aria-id="welcome">
    <p>
      Welcome to the dCloud
      <strong>Webex Contact Center v6</strong>
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