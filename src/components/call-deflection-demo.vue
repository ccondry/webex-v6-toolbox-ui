<template>
  <panel title="Call Deflection" aria-id="call-deflection">

    <!-- channel selector -->
    <channel v-model="form.channel" :channels="['sms', 'whatsapp']" style="padding: 1rem;"/>

    <!-- SMS -->
    <div v-show="form.channel === 'sms'" style="padding: 1rem;">
      <country
      v-model="country"
      tooltip="Select US or UK, depending where you want SMS to be sent to"
      :countries="['us', 'uk']"
      />
      
      <p>
        Call this number to start the Call Deflection Demo:
      </p>
      <p>
        <strong>
          {{ phone }}
        </strong>
      </p>

      <p>
        To reach the call deflection through SMS, please use these IVR options:
        <br />
        <br />
        Press 1 to reach {{ requestBrandBuilding }}.<br />
        Press 1 to request {{ requestCallReason }}.<br />
        Press 1 to receive a text message through SMS.
      </p>
    </div>

    <!-- WhatsApp -->
    <div v-show="form.channel === 'whatsapp'" style="padding: 1rem;">
      <country
      v-model="country"
      tooltip="Select US or UK, depending where you want to call to"
      :countries="['us', 'uk']"
      />
      
      <p>
        Call this number to start the Call Deflection Demo:
      </p>
      <p>
        <strong>
          {{ phone }}
        </strong>
      </p>

      <p>
        To reach the call deflection through WhatsApp, please use these IVR options:
        <br />
        <br />
        Press 1 to reach {{ requestBrandBuilding }}.<br />
        Press 1 to request {{ requestCallReason }}.<br />
        Press 2 to receive a text message through WhatsApp.
      </p>
      <b-message type="is-success" has-icon icon="information">
        IMPORTANT: For each new day you want to demo via WhatsApp, you must first
        send an initial message in the WhatsApp chat (i.e., Hi). Follow the instructions
        below to send the message before to make the call.
      </b-message>
      <p>
        Option 1: Scan the QR code and send the message. The first time you ever do this demo, you will need to use this method.
      </p>
      <center>
        <vue-qr :text="whatsappUrl" />
      </center>
      <p>
        Option 2: Open WhatsApp, then open the dCloud Webex Connect demo number, type "Hi" and send the message.
      </p>
    </div>
  </panel>
</template>

<script>
import Country from './input/country.vue'
import Channel from './input/channel.vue'
import VueQr from 'vue-qr'
import {mapGetters} from 'vuex'

export default {
  components: {
    VueQr,
    Country,
    Channel,
  },

  data () {
    return {
      country: 'US',
      form: {
        channel: 'sms'
      },
      whatsappUrl: 'https://wa.me/12078135106?text=Hi'
    }
  },

  computed: {
    ...mapGetters([
      'userDemoConfig',
      'vertical'
    ]),
    requestBrandBuilding () {
      const defaultMessage = 'Cumulus Healthcare store'

      try {
        const verticalMessage = this.vertical.webexconnect.callDeflection.brandBuilding
        return verticalMessage || defaultMessage
      } catch (e) {
        return defaultMessage
      }
    },
    requestCallReason () {
      const defaultMessage = 'cleaning services'

      try {
        const verticalMessage = this.vertical.webexconnect.callDeflection.callReason
        return verticalMessage || defaultMessage
      } catch (e) {
        return defaultMessage
      }
    },
    phone () {
      if (this.country === 'US') {
        return '+1-210-630-6366'
      }
      if (this.country === 'UK') {
        return '+1-210-630-6367'
      }
      if (this.country === 'SNG') {
        return 'Not Available Yet'
      }
      return ''
    }
  }
}
</script>