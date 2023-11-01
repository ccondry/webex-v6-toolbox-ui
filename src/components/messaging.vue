<template>
  <panel title="Messaging" aria-id="appointments">
    <!-- <p>
      Fill in this form and click Send to start the Appointments Demo.
    </p> -->
    <!-- channel -->
    <channel v-model="form.channel" />

    <div
    v-show="form.channel === 'amb'"
    style="padding-left: 1rem; padding-right: 1rem;"
    >
      Scan this QR code to start the demo. You can also type "apptdemo" message directly in the Messages chat.
      <center>
        <vue-qr :text="ambUrl" />
      </center>
      If you use the Send button to start the demo, you must have used at least once the QR code above.<br> Then you need to specify the phone number in the same format as you did when used the QR code for the first time.
    </div>

    <div
    v-show="form.channel === 'whatsapp'"
    style="padding-left: 1rem; padding-right: 1rem;"
    >
      Scan this QR code to start the demo. You can also type "apptdemo" message directly in the WhatsApp chat.
      <center>
        <vue-qr :text="whatsappUrl" />
      </center>
      If you use the Send button below to start the demo, you must have sent an initial message in the WhatsApp chat (i.e., Hi) on the day you are using the demo. The message must be sent before you use the Send button.
    </div>

    <div
    v-show="form.channel === 'rcs'"
    style="padding-left: 1rem; padding-right: 1rem;"
    >
      Before starting the Google RCS demo, check
      <a :href="rcsSupportedCountriesListUrl" target="_blank">
        here
      </a>
      that your country/provider is supported for Google RCS.<br>
      Then use
      <a :href="enableRcsUrl" target="_blank">
        this link
      </a>
      to enable Google RCS for your phone.
    </div>
    
    <!-- customer name -->
    <b-field label="Name" expanded>
      <b-input v-model="form.name" />
    </b-field>

    <!-- phone number and country -->
    <b-field grouped>
      <!-- country -->
      <country
      v-show="form.channel === 'sms'"
      v-model="form.country"
      />

      <!-- customer number -->
      <phone v-model="form.number" />
    </b-field>

    <!-- send button -->
    <div class="buttons" style="justify-content: space-around;">
      <!-- start demo -->
      <b-button
      type="is-success"
      rounded
      :disabled="!formComplete || isWorking"
      @click="clickStartDemo"
      >
        {{ isWorking ? 'Sending...' : 'Send' }}
      </b-button>
    </div>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Channel from './input/channel'
import Country from './input/country'
import Phone from './input/phone'
import VueQr from 'vue-qr'

export default {
  components: {
    VueQr,
    Channel,
    Country,
    Phone
  },

  data () {
    return {
      form: {
        name: '',
        number: '',
        country: 'US',
        channel: 'sms'
      },
      ambUrl: 'https://bcrw.apple.com/sms:open?service=iMessage&recipient=urn:biz:f202d506-43c2-4ba8-b48c-27237b525ebf&biz-intent-id=intent_placeholder&bizgroup-id=test&body=apptdemo',
      whatsappUrl: 'https://wa.me/447736239521?text=apptdemo',
      enableRcsUrl: 'https://support.google.com/messages/answer/7189714?hl=en-GB&ref_topic=9459217',
      rcsSupportedCountriesListUrl: 'https://mm-static.cxdemo.net/webexconnect/googlercs.htm?nocache=' + new Date().getTime()
    }
  },

  computed: {
    ...mapGetters([
      'jwtUser',
      'working'
    ]),
    formComplete () {
      return this.form.number.length
    },
    isWorking () {
      return this.working.demo.appointment
    }
  },

  watch: {
    jwtUser (val) {
      this.copyUserData()
    }
  },

  activated () {
    this.copyUserData()
  },  

  methods: {
    ...mapActions([
      'startAppointmentDemo'
    ]),
    copyUserData () {
      if (this.jwtUser && this.jwtUser.email) {
        this.form.name = this.jwtUser.firstName
      }
    },
    clickStartDemo () {
      if (this.formComplete) {
        this.startAppointmentDemo(this.form)
      }
    }
  }
}
</script>