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
import ProvisionModal from './provision-modal'

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
      'provisionStatus',
      'userDemoConfig'
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
      'resendWebexConnectEmail'
    ]),
    startTimer () {
      // advance the timer every 1 second
      setInterval(() => {
        this.timerNow = new Date().getTime()
      }, 1000)
    },
    clickProvision () {
      const emailParts = this.jwtUser.email.split('@')
      this.$buefy.modal.open({
        parent: this,
        // component: PromptModal,
        component: ProvisionModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape'],
        props: {
          imiEmail: this.userDemoConfig.imiEmail || `${emailParts[0]}+dcloudwxcc@${emailParts[1]}`
        },
        events: {
          submit: ({password, imiEmail}) => {
            this.provisionUser({password, imiEmail})
          }
        }
      })
    }
  }
}
</script>