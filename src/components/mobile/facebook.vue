<template>
  <panel title="Facebook" aria-id="facebook">
    <p>
      Start the Facebook demo by scanning this QR code or going to
      <a :href="url">
        <strong>
          {{ url }}
        </strong>
      </a>
      to 
    </p>
    <center><vue-qr :text="url" /></center>
  </panel>
</template>

<script>
import VueQr from 'vue-qr'

export default {
  components: {
    VueQr
  },

  data () {
    return {
      url: 'https://www.facebook.com/Cumulus-Webex-Contact-Center-103328532318243/'
    }
  }
}
</script>