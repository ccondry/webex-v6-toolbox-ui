<template>
  <panel title="Mobile Web App" aria-id="mobile-web-app">
    <p>
      Use
      <strong><a :href="mobileWebAppUrl" target="_blank">this URL</a></strong>
      <copy :value="mobileWebAppUrl" name="Mobile Web App URL" />
      or the following QR code to go to the dCloud CC Mobile Web App:
      <center><vue-qr :text="mobileWebAppUrl" :logo-src="favicon" /></center>
    </p>
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'
import VueQr from 'vue-qr'
import favicon from '../assets/images/favicon.png'

export default {
  components: {
    VueQr
  },

  data () {
    return {
      favicon
    }
  },

  computed: {
    ...mapGetters([
      'sessionId',
      'mobileWebAppUrl',
      'datacenterDisplayName',
      'jwtUser'
    ])
  }
}
</script>