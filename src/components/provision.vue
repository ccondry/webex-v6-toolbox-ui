<template>
  <panel title="Provision Webex Contact Center v5" aria-id="provision">
    <p v-if="isLocked">
      <!-- provisioning is not enabled for this instance -->
      Provisioning is disabled for this demo instance. Please try using
      another dCloud datacenter or a newer version of this demo (if one is
      available).
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

export default {
  computed: {
    ...mapGetters([
      'working',
      'isLocked',
      'userDemoConfig'
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