<template>
  <panel title="SMS" aria-id="sms">
    <!-- country -->
    <country
    v-model="country"
    info="Select your region to show the demo number"
    :countries="Object.keys(phoneNumbers)"
    />
    <p>
      Scan the following QR code to send an SMS to
      <strong>{{ phone }}</strong>.
    </p>
    <center><vue-qr :text="qrUrl" :logo-src="logo" /></center>
  </panel>
</template>

<script>
import Country from '../input/country'
import VueQr from 'vue-qr'
import logo from '../../assets/images/sms.png'

export default {
  components: {
    Country,
    VueQr
  },

  data () {
    return {
      logo,
      country: 'US',
      phoneNumbers: {
        UK: '+44-798-4421-429',
        Singapore: '+65-8240-0537',
        US: '+1-201-645-7759'
      }
    }
  },

  computed: {
    phone () {
      try {
        return this.phoneNumbers[this.country]
      } catch (e) {
        return null
      }
    },
    qrUrl () {
      return `SMSTO:${this.phone}:hello`
    }
  }
}
</script>