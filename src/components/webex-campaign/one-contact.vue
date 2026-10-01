<template>
  <panel
  title="Send One Webex Campaign Contact"
  aria-id="webex-campaign-one-contact"
  style="max-width: 32rem;"
  >
    <b-loading :active="isWorking" :is-full-page="false" />
    <div style="padding: 1rem;">
      <p>
        Fill out this form and click Send to add this contact to the selected
        Webex Campaign.
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

        <b-field label="Reason">
          <b-input v-model="form.reason" />
        </b-field>

        <b-field label="Campaign">
          <b-select v-model="form.region" expanded>
            <option
            v-for="campaign in campaignRegions"
            :key="campaign.region"
            :value="campaign.region"
            >
              {{ campaign.label }}
            </option>
          </b-select>
        </b-field>
        <p>
          Contacts for {{ form.region }} are added to {{ selectedCampaignName }}.
        </p>

        <b-field label="Status">
          <div style="padding-left: 1rem;">
            <p v-if="isWorking">
              Working...
            </p>
            <p v-else-if="!webexCampaignSendOneResponse">
              Ready
            </p>
            <p v-else-if="webexCampaignSendOneResponse.message && !webexCampaignSendOneResponse.contacts">
              Error - {{ webexCampaignSendOneResponse.message }}
            </p>
            <p v-else>
              {{ statusContact }} - {{ statusResult }}
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
            {{ isWorking ? 'Working...' : 'Send' }}
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
        reason: 'support',
        region: 'US',
      },
    }
  },

  computed: {
    ...mapGetters([
      'campaignRegions',
      'jdsIdentity',
      'webexCampaignSendOneResponse',
      'working',
    ]),
    isWorking () {
      return this.working.webexCampaign.upload
    },
    selectedCampaignName () {
      const match = this.campaignRegions.find(campaign => campaign.region === this.form.region)
      return match ? match.campaignName : ''
    },
    firstResult () {
      const response = this.webexCampaignSendOneResponse
      return response && response.contacts && response.contacts[0]
    },
    statusContact () {
      if (!this.firstResult || !this.firstResult.Contact) {
        return this.selectedCampaignName
      }
      return this.firstResult.Contact.phone || this.selectedCampaignName
    },
    statusResult () {
      if (!this.firstResult) {
        return 'Queued'
      }
      return this.firstResult.Result
        ? 'Queued for ' + (this.webexCampaignSendOneResponse.campaignName || this.selectedCampaignName)
        : 'Error - ' + this.firstResult.ErrorDescription
    },
    sendIsEnabled () {
      return this.form.firstName &&
        this.form.lastName &&
        this.form.phone &&
        this.form.reason &&
        this.form.region &&
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
      'sendOneWebexCampaignContact',
    ]),
    clickClearForm () {
      this.form.firstName = ''
      this.form.lastName = ''
      this.form.phone = ''
      this.form.reason = ''
      this.form.region = 'US'
    },
    updateForm () {
      if (this.jdsIdentity) {
        this.form.firstName = this.jdsIdentity.firstName
        this.form.lastName = this.jdsIdentity.lastName
        const phone = this.jdsIdentity.phone
        this.form.phone = Array.isArray(phone) && phone.length ? phone[0] : ''
      }
    },
    clickSend () {
      this.sendOneWebexCampaignContact(this.form)
    },
  },
}
</script>
