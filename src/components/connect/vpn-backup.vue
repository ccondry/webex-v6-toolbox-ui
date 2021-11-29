<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <!-- title -->
      <p class="title">
        Backup VPN
      </p>
      
      <!-- content -->
      <p>
        If you have connection issues with the primary VPN, you can use
        the session VPN server as a backup/workaround. This server only supports
        16 concurrent users, so please use this only if you have issues with the
        primary VPN connection:
      </p>
      <b-loading :active="!instance" :is-full-page="false" />
      <ul v-if="instance.vpnUsername">
        <li style="white-space:nowrap">
          Address:
          <strong>{{ instance.vpnAddress }}</strong>
          <copy :value="instance.vpnAddress" name="VPN Address" />
        </li>
        <li style="white-space:nowrap">
          Username:
          <strong>{{ instance.vpnUsername }}</strong>
          <copy :value="instance.vpnUsername" name="VPN Username" />
        </li>
        <li style="white-space:nowrap">
          Password:
          <strong>{{ instance.vpnPassword }}</strong>
          <copy :value="instance.vpnPassword" name="VPN Password" />
        </li>
      </ul>
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
      'copyToClipboard',
      'provisionUser'
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
          this.provisionUser(password)
        }
      })
    },
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    }
  }
}
</script>