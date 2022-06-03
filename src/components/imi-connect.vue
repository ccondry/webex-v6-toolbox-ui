<template>
  <panel title="Webex Connect" aria-id="webex-connect">
    <b-loading :active="isWorking" :is-full-page="false" />
    <p>
      Your Webex Connect account invitation email should have been sent to you
      at
      <strong>
        {{ userDemoConfig.imiEmail }}.
      </strong>
    </p>
    <p>
      You can change your Webex Connect email or have the invitation email
      re-sent to you.
    </p>
    <div class="buttons" style="justify-content: space-evenly;">
      <b-button
      :disabled="isWorking"
      type="is-primary"
      rounded
      @click.prevent="clickChangeEmail"
      >
        Change My Webex Connect Email
      </b-button>
      <b-button
      :disabled="isWorking"
      type="is-primary"
      rounded
      @click.prevent="clickResendEmail"
      >
        Resend Webex Connect Invitation Email
      </b-button>
    </div>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'working',
      'userDemoConfig'
    ]),
    isWorking () {
      return this.working.user.provision ||
      this.working.user.imiResend ||
      this.working.user.changeImiEmail ||
      this.userDemoConfig.imiEmailStatus === 'working'
    }
  },

  methods: {
    ...mapActions([
      'resendWebexConnectEmail',
      'changeWebexConnectEmail'
    ]),
    clickResendEmail () {
      this.$buefy.dialog.confirm({
        title: 'Resend Webex Connect Email',
        message: `Do you want the Webex Connect invitation email to be re-sent to your <strong>${this.userDemoConfig.imiEmail}</strong>?`,
        rounded: true,
        confirmText: 'Yes',
        type: 'is-success',
        onConfirm: () => {
          this.resendWebexConnectEmail()
        }
      })
    },
    clickChangeEmail () {
      this.$buefy.dialog.prompt({
        title: 'Change Webex Connect Email',
        message: `What would you like to change your Webex Connect email address to?`,
        rounded: true,
        confirmText: 'Confirm',
        type: 'is-success',
        inputAttrs: {
          value: this.userDemoConfig.imiEmail,
          placeholder: this.userDemoConfig.imiEmail,
        },
        onConfirm: (email) => {
          this.changeWebexConnectEmail(email)
        }
      })
    }
  }
}
</script>