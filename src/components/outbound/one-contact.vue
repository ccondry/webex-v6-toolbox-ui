<template>
  <panel
  title="Send One Outbound Contact"
  aria-id="one-contact"
  style="max-width: 32rem;"
  >
    <b-loading :active="isWorking" :is-full-page="false" />
    <div style="padding: 1rem;">
      <p>
        Fill out this form and click Send to send this one contact to the
        outbound dialer list.
      </p>
      <form>
        <b-field label="First Name">
          <b-input v-model="form.firstName" />
        </b-field>

        <b-field label="Last Name">
          <b-input v-model="form.lastName" />
        </b-field>

        <b-field label="Phone Number">
          <b-input v-model="form.phone" />
        </b-field>

        <!-- status -->
        <b-field label="Status">
          <div style="padding-left: 1rem;">
            <p v-if="isWorking">
              Working...
            </p>
            <p v-else-if="!outboundSendOneResponse">
              Ready
            </p>
            <p v-else>
              {{ outboundSendOneResponse.Contact }} - {{ outboundSendOneResponse.Result ? 'Success' : 'Error - ' + outboundSendOneResponse.ErrorDescription }}
            </p>
          </div>
        </b-field>
        
        <div class="buttons" style="display: flex; justify-content: flex-end;">
          <b-button
          rounded
          type="is-primary"
          @click="clickClearForm"
          >
            Clear Form
          </b-button>

          <b-button
          rounded
          type="is-success"
          :disabled="!sendIsEnabled"
          @click="clickSend"
          >
            {{ working.outbound.upload ? 'Working...' : 'Send' }}
          </b-button>
        </div>
      </form>
    </div>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      form: {
        firstName: '',
        lastName: '',
        phone: '',
      },
    }
  },

  computed: {
    ...mapGetters([
      'jdsIdentity',
      'outboundSendOneResponse',
      'working',
    ]),
    isWorking () {
      return this.working.outbound.upload
    },
    lastResult () {
      return outboundSendOneResponse.Result
    },
    smsPhone () {
      const phones = {
        US: '+1-201-971-2111',
        UK: '+44-7984-421429',
        SNG: '+65-82400537'
      }
      return phones[this.form.country] || '' 
    },
    smsQr () {
      return `SMSTO:${this.smsPhone}:apptdemo`
    },
    sendIsEnabled () {
      return this.form.firstName &&
        this.form.lastName &&
        this.form.phone &&
        !this.isWorking
    },
  },

  watch: {
    jdsIdentity () {
      this.updateForm()
    }
  },

  mounted () {
    this.updateForm()
  },

  methods: {
    ...mapActions([
      'sendOneOutboundContact',
    ]),
    clickClearForm () {
      this.form.firstName = ''
      this.form.lastName = ''
      this.form.phone = ''
    },
    updateForm () {
      if (this.jdsIdentity) {
        // set first name and last name to user's JDS customer name
        this.form.firstName = this.jdsIdentity.firstName
        this.form.lastName = this.jdsIdentity.lastName
        try {
          this.form.phone = this.getIdentity('phone').values[0]
        } catch (e) {
          // continue without phone
        }
      }
    },
    clickSend () {
      console.log('send one contact to outbound campaign:', this.form)
      this.sendOneOutboundContact(this.form)
    },
    getIdentity (type) {
      return this.jdsIdentity.identities.find(v => v.type === type)
    },
  },
}
</script>