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
    <div class="buttons">
      <b-button
      :disabled="working.user.provision || working.user.imiResend"
      type="is-primary"
      rounded
      expanded
      @click.prevent="clickResendImi"
      >
        Re-send IMI Connect Invitation Email
      </b-button>
      <b-button
      :disabled="working.user.provision"
      type="is-primary"
      rounded
      expanded
      @click.prevent="clickProvision"
      >
        {{ buttonText }}
      </b-button>
    </div>
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
      'provisionUser',
      'resendImiEmail'
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
    },
    clickResendImi () {
      this.$buefy.dialog.prompt({
        title: 'Resend IMI Connect Email',
        message: `Do you want the IMI Connect invitation email to be re-sent to your email address?`,
        rounded: true,
        confirmText: 'Yes',
        type: 'is-success',
        onConfirm: () => {
          this.resendImiEmail()
        }
      })
    }
  }
}
</script>