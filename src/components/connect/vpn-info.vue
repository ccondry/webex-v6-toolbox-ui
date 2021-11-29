<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <!-- title -->
      <p class="title">
        AnyConnect VPN
      </p>
      <p>
        Connect your laptop to the demo session using AnyConnect. You can
        download the AnyConnect using these links:
      </p>
      <ul>
        <li>
          <a :href="links.windows" download>AnyConnect 4.10 for Windows</a>
          <copy :value="links.windows" name="AnyConnect 4.10 for Windows download link" />
          (Only the <strong>Core &amp; VPN</strong> component is necessary)
        </li>
        <li>
          <a :href="links.mac" download>AnyConnect 4.10 for Mac</a>
          <copy :value="links.mac" name="AnyConnect 4.10 for Mac download link" />
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