<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Install/Trust the dCloud CA Certificate
      </p>
      <button
      type="button"
      class="delete"
      style="margin-left: 0.5rem;"
      @click="$emit('close')"
      />
    </header>

    <section class="modal-card-body">
      <b-tabs v-model="activeTab">
        <b-tab-item label="Windows">
          <ol>
            <li>
              Download the
              <a :href="caCertUrl"><strong>dCloud Root CA</strong></a>
              certificate to your laptop
            </li>
            <li>
              Open the certificate file. You will be prompted to install the
              certificate into Windows. Click
              "<strong>Install Certificate...</strong>"
            </li>
            <li>
              Choose <strong>Current User</strong> and click
              <strong>Next</strong>
            </li>
            <li>
              Choose
              <strong>Place all certificates in the following store</strong>
              and click <strong>Browse</strong>
            </li>
            <li>
              Choose
              <strong>Trusted Root Certification Authorities</strong>
              and click <strong>OK</strong>
            </li>
            <li>
              Click <strong>Next</strong> and then click
              <strong>Finish</strong>. 
            </li>
            <li>
              If you are prompted to accept and install/trust the new
              certificate, press 
              <strong>Yes</strong> or <strong>OK</strong>
            </li>
          </ol>
        </b-tab-item>

        <b-tab-item label="Mac">
          <ol>
            <li>
              Download the
              <a :href="caCertUrl"><strong>dCloud Root CA</strong></a>
              certificate to your laptop
            </li>
            <li>
              Open the certificate file. This will copy it into your Keychain
            </li>
            <li>
              If you are prompted for "login" vs. "system", choose
              "<strong>login</strong>"
              (though both options will work).
            </li>
            <li>
              Open the <strong>Keychain Access</strong> app on your Mac,
              select the <strong>Certificates</strong> category, and search for
              "<strong>dcloud</strong>".
            </li>
            <li>
              Double-click the <strong>dCloud Root CA</strong> certificate,
              expand <strong>Trust</strong>,
              and set "When using this certificate" to
              <strong>Always Trust</strong>.
            </li>
          </ol>
        </b-tab-item>
      </b-tabs>
    </section>

    <footer class="modal-card-foot" style="justify-content: flex-end;">
      <b-button
      type="is-primary"
      rounded
      @click="$emit('close')"
      >
        Ok
      </b-button>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeTab: 0
    }
  },

  computed: {
    ...mapGetters([
      'caCertUrl'
    ]),
    os () {
      if (
        this.appVersion.indexOf('Macintosh') > 0 ||
        this.userAgent.indexOf('Macintosh') > 0
      ) {
        return 'Mac'
      } else if (
        this.appVersion.indexOf('Windows') > 0 ||
        this.userAgent.indexOf('Windows') > 0
      ) {
        return 'Windows'
      } else {
        return 'Unknown'
      }
    },
    appVersion () {
      return navigator.appVersion
    },
    userAgent () {
      return navigator.userAgent 
    }
  },
  
  mounted () {
    // set tab to Mac instructions if user is browsing on a Mac
    if (this.os === 'Mac') {
      this.activeTab = 1
    }
  }
}
</script>
