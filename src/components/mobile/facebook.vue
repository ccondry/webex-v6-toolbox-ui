<template>
  <panel title="Facebook" aria-id="facebook">
    <p>
      Use
      <strong><a :href="url" target="_blank">this URL</a></strong>
      <copy :value="url" name="Facebook Demo URL" />
      or scan the following QR code to start the Facebook demo.
    </p>
    <center><vue-qr :text="url" :logo-src="logo" /></center>
  </panel>
</template>

<script>
import VueQr from 'vue-qr'
import logo from '../../assets/images/facebook.png'

export default {
  components: {
    VueQr
  },

  data () {
    return {
      logo,
      url: 'https://www.facebook.com/profile.php?id=100088722490738'
    }
  }
}
</script>