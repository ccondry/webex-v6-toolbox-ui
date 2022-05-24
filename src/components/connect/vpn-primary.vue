<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <!-- title -->
      <p class="title">
        Primary VPN
      </p>
      
      <!-- content -->
      <ul>
        <li style="white-space:nowrap">
          Address:
          <strong>{{ vpnAddress }}</strong>
          <copy :value="vpnAddress" name="VPN Address" />
        </li>
        <li>
          Username:
          <strong>{{ vpnUsername }}</strong>
          <copy :value="vpnUsername" name="VPN Username" />
        </li>
        <li style="white-space:nowrap">
          Password:
          <strong>Your chosen demo VPN password</strong>
        </li>
      </ul>
      <b-field>
        <b-button
        style="margin-left: 1rem;"
        type="is-primary"
        rounded
        @click="clickResetPassword"
        >
          Reset VPN Password
        </b-button>
      </b-field>
    </article>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      links: {
        windows: 'https://mm-static.cxdemo.net/anyconnect-win-4.10.00093-predeploy-k9.zip',
        mac: 'https://mm-static.cxdemo.net/anyconnect-macos-4.10.00093-predeploy-k9.dmg'
      }
    }
  },

  computed: {
    ...mapGetters([
      'vpnAddress',
      'userDemoConfig',
      'instance'
    ]),
    vpnUsername () {
      try {
        return this.userDemoConfig.vpnUsername || ''
      } catch (e) {
        return ''
      }
    }
  },

  methods: {
    ...mapActions([
      'resetPassword'
    ]),
    clickResetPassword () {
      this.$buefy.dialog.prompt({
        title: 'Reset Demo VPN Password',
        message: `Enter your new demo VPN password:`,
        type: 'is-success',
        confirmText: 'Submit',
        rounded: true,
        inputAttrs: {
          type: 'password'
        },
        onConfirm: (password) => {
          console.log('changing password...')
          this.resetPassword(password)
        }
      })
    }
  }
}
</script>