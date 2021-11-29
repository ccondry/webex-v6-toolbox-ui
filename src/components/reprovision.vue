<template>
  <panel title="Reprovision" aria-id="reprovision">
    <p>
      Your account is already provisioned for this demo. Would you like to
      provision again anyway? 
    </p>
    <p>
      This will check that all your logins, extensions, queues, etc. are created
      properly.
    </p>
    <b-field>
      <b-button
      :disabled="working.user.provision"
      type="is-primary"
      rounded
      expanded
      @click.prevent="clickProvision"
      >
        {{ buttonText }}
      </b-button>
    </b-field>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      timerEnd: 0,
      timerNow: 0
    }
  },

  computed: {
    ...mapGetters([
      'jwtUser',
      'working',
      'loading',
      'sessionId',
      'provisionStatus'
    ]),
    buttonText () {
      if (this.working.user.provision) {
        return `Working...`       
      } else {
        return 'Yes, Fix My Account'
      }
    }
  },

  methods: {
    ...mapActions([
      'provisionUser'
    ]),
    startTimer () {
      // advance the timer every 1 second
      setInterval(() => {
        this.timerNow = new Date().getTime()
      }, 1000)
    },
    clickProvision () {
      console.log('user clicked Provision Me button')
      let message = `Please set a password for your VPN account. <br>Do `
      message += `not re-use your Cisco account password.`,
      this.$buefy.dialog.prompt({
        title: 'Provision',
        message,
        inputAttrs: {
          placeholder: 'Your new VPN password',
          type: 'password'
        },
        rounded: true,
        confirmText: 'Submit',
        type: 'is-success',
        onConfirm: password => {
          this.provisionUser(password)
        }
      })
    }
  }
}
</script>