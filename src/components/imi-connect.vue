<template>
  <panel title="IMI Connect" aria-id="imi-connect">
    <p>
      Your IMI Connect account invitation email should have been sent to you.
    </p>
    <p>
      Would you like to have the IMI Connect invitation email re-sent to you? 
    </p>
    <div class="buttons">
      <b-button
      :disabled="working.user.provision || working.user.imiResend"
      type="is-primary"
      rounded
      expanded
      @click.prevent="clickResendImi"
      >
        Resend IMI Connect Invitation Email
      </b-button>
    </div>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'working'
    ])
  },

  methods: {
    ...mapActions([
      'resendImiEmail'
    ]),
    clickResendImi () {
      this.$buefy.dialog.confirm({
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