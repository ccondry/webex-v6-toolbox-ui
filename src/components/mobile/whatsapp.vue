<template>
  <panel title="Whatsapp" aria-id="whatsapp">
    <p>
      Scan this QR code to send a Whatsapp message to
      <strong>
        {{ phone }}
      </strong>
    </p>
    <center><vue-qr :text="qrUrl" /></center>
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
      phone: '+1-201-971-2111'
    }
  },

  computed: {
    qrUrl () {
      return `whatsappUrl: 'https://wa.me/${this.phone}?text=hello`
    }
  }
}
</script>