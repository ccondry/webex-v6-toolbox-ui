<template>
  <panel title="Provision Webex Contact Center v8" aria-id="provision">
    <p v-if="isLocked">
      <!-- provisioning is not enabled for this instance -->
      Provisioning is temporary disabled for this demo. In case of
      an urgent demo, please type a message into the support space.
    </p>
    <!-- was there a provision error? -->
    <b-message v-if="!isLocked && userDemoConfig.provision === 'error'"
    title="Error"
    type="is-danger"
    aria-close-label="Close message"
    >
      {{ userDemoConfig.error }}
    </b-message>
    <!-- normal provision message -->
    <p v-if="!isLocked">
      Would you like to provision your account?
    </p>
    <!-- the provision button -->
    <b-field v-if="!isLocked">
      <b-button
      :disabled="working.user.provision"
      type="is-success"
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
import ProvisionModal from './provision-modal'

export default {
  computed: {
    ...mapGetters([
      'working',
      'isLocked',
      'userDemoConfig',
      'jwtUser'
    ]),
    buttonText () {
      if (this.working.user.provision) {
        return `Working...`       
      } else {
        return 'Provision Me'
      }
    }
  },
  methods: {
    ...mapActions([
      'provisionUser'
    ]),
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