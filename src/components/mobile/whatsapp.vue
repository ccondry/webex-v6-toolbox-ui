<template>
  <panel title="Whatsapp" aria-id="whatsapp">
    <p>
      Scan the following QR code to send a Whatsapp message to
      <strong>{{ phone }}</strong>.
    </p>
    <center><vue-qr :text="qrUrl" :logo-src="logo" /></center>
  </panel>
</template>

<script>
import VueQr from 'vue-qr'
import logo from '../../assets/images/whatsapp.png'

export default {
  components: {
    VueQr
  },

  data () {
    return {
      logo,
      phone: '+1-201-971-2111'
    }
  },

  computed: {
    cleanPhone () {
      return this.phone.replace(/[^0-9.]/g, '')
    },
    qrUrl () {
      return `https://wa.me/${this.cleanPhone}?text=hello`
    }
  }
}
</script>