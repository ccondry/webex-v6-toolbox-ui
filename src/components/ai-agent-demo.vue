<template>
  <panel title="AI Agent" aria-id="AI Agent" style="max-width: 32rem;">
    <!-- channel selector -->
    <channel
    v-model="form.channel"
    style="padding: 1rem;"
    :channels="['sms', 'whatsapp']"
    />

    <div v-show="form.channel === 'whatsapp'" style="padding: 1rem;">
      <p>
        Option 1: Scan the QR code and send the message to start the demo. The
        first time you ever do this demo, you will need to use this method.
      </p>
      <center>
        <vue-qr :text="whatsappUrl" />
      </center>
      <p>
        Option 2: Open WhatsApp, then open the dCloud Webex Connect demo number
        and type "hello" directly to start the demo.
      </p>
      <p>
        <!-- Option 3: Enter your name and phone number and push Send to start the
        demo. For each new day you want to demo via this method, you must first
        send an initial message in the WhatsApp chat (i.e., Hi). The message
        must be sent before you use the Send button. -->
      </p>
    </div>
    
    <!-- QR codes for SMS channel -->
    <div v-show="form.channel === 'sms'" style="padding: 1rem;">
      <!-- phone number and country -->
      <b-field grouped>
        <!-- country, only for SMS -->
        <country v-model="form.country" />
      </b-field>
      <!-- customer number -->
      <p>
        Option 1: Scan the QR code and send the message to start the demo. The first time you ever do this demo, you will need to use this method.
      </p>
      <center>
        <vue-qr :text="smsQr" />
      </center>
      <p>
        Option 2: Open your phone's SMS app, then text "hello" to
        <strong>
          {{ smsPhone }}
        </strong>
        to start the demo.
      </p>
    </div>
  </panel>
</template>

<script>
import Channel from './input/channel.vue'
import Country from './input/country.vue'
import VueQr from 'vue-qr'

export default {
  components: {
    VueQr,
    Channel,
    Country,
  },

  data () {
    return {
      form: {
        country: 'US',
        channel: 'sms'
      },
      whatsappUrl: 'https://wa.me/12078135106?text=aiagent',
    }
  },

  computed: {
    smsPhone () {
      const phones = {
        US: '+1-201-971-2111',
        UK: '+44-7984-421429',
        SNG: '+65-82400537'
      }
      return phones[this.form.country] || '' 
    },
    smsQr () {
      return `SMSTO:${this.smsPhone}:start aiagent`
    }
  },
}
</script>