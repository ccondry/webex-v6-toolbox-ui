<template>
  <panel title="Upload Webex Campaign Contacts CSV File">
    <b-loading :active="isWorking" :is-full-page="false" />

    <b-field>
      <b-upload v-model="file"
      drag-drop
      expanded
      accept=".csv"
      >
        <div class="content has-text-centered" style="padding: 1rem;">
          <p>
            <b-icon icon="upload" size="is-large" />
          </p>
          <p>Upload your Webex Campaign contacts CSV file here</p>
        </div>
      </b-upload>
    </b-field>

    <b-field label="Campaign">
      <b-select v-model="region" expanded>
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
      This file will be added to {{ selectedCampaignName }}.
    </p>

    <div v-show="csvAsJson.length > 0">
      <h4 style="margin-bottom: 0;">
        Upload Contacts:
      </h4>
      <b-table
      id="webex-campaign-upload"
      :data="csvAsJson"
      :paginated="csvAsJson.length > 5"
      :per-page="6"
      :pagination-simple="true"
      >
        <b-table-column
        v-slot="props"
        label="#"
        field="index"
        >
          {{ props.index + 1 }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="First Name"
        field="firstName"
        >
          {{ props.row.firstName }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="Last Name"
        field="lastName"
        >
          {{ props.row.lastName }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="Phone Number"
        field="phoneNumber"
        >
          {{ props.row.phoneNumber }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="Reason"
        field="reason"
        >
          {{ props.row.reason }}
        </b-table-column>

        <template v-if="warningMessage" #footer>
          <div class="has-text-right has-text-danger">
            {{ warningMessage }}
          </div>
        </template>
      </b-table>
    </div>

    <div v-show="csvAsJson.length === 0 && uploadResults.length > 0">
      <h4 style="margin-bottom: 0;">
        Response:
      </h4>
      <b-table
      id="webex-campaign-response"
      :data="uploadResults"
      :row-class="onResponseRowClass"
      >
        <b-table-column
        v-slot="props"
        label="#"
        field="index"
        >
          {{ props.index + 1 }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="First Name"
        field="Contact.firstName"
        >
          {{ props.row.Contact.firstName }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="Last Name"
        field="Contact.lastName"
        >
          {{ props.row.Contact.lastName }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="Phone Number"
        field="Contact.phoneNumber"
        >
          {{ props.row.Contact.phoneNumber || props.row.Contact.phone }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="Reason"
        field="Contact.reason"
        >
          {{ props.row.Contact.reason }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        label="Result"
        field="Result"
        >
          {{ props.row.Result ? 'Queued' : 'Failed' }}
        </b-table-column>

        <b-table-column
        v-slot="props"
        :visible="responseHasAnyErrors"
        label="Error"
        field="ErrorDescription"
        >
          {{ props.row.ErrorDescription }}
        </b-table-column>
      </b-table>
    </div>

    <div
    class="buttons"
    style="padding-top: 1rem; display: flex; justify-content: flex-end;"
    >
      <b-button
      rounded
      type="is-info"
      icon-left="download"
      :disabled="isDownloading"
      @click="clickDownload"
      >
        Get Example
      </b-button>

      <b-button
      rounded
      type="is-primary"
      :disabled="!fileData && uploadResults.length === 0"
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
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      file: null,
      fileData: null,
      isDownloading: false,
      region: 'US',
      columns: ['firstName', 'lastName', 'phoneNumber', 'reason'],
    }
  },

  computed: {
    ...mapGetters([
      'campaignRegions',
      'webexCampaignUploadResponse',
      'working',
    ]),
    selectedCampaignName () {
      const match = this.campaignRegions.find(campaign => campaign.region === this.region)
      return match ? match.campaignName : ''
    },
    uploadResults () {
      const response = this.webexCampaignUploadResponse
      return response && Array.isArray(response.contacts) ? response.contacts : []
    },
    responseHasAnyErrors () {
      return !!this.uploadResults.find(v => !v.Result)
    },
    isWorking () {
      return this.working.webexCampaign.upload
    },
    csvData () {
      try {
        const base64data = this.fileData.split('data:text/csv;base64,')[1]
        return window.atob(base64data)
      } catch (e) {
        return ''
      }
    },
    csvAsJson () {
      try {
        const rows = (this.csvData.trim().split('\n') || []).map(v => v.trim())
        const header = rows[0]
        const aliases = {
          firstname: 'firstName',
          lastname: 'lastName',
          phone: 'phoneNumber',
          phonenumber: 'phoneNumber',
          reason: 'reason',
        }
        const columns = header.split(',').map(v => v.trim()).map(v => {
          const alias = aliases[v.toLowerCase().replace(/\s+/g, '')]
          if (alias) {
            return alias
          }
          const match = this.columns.find(x => x.toLowerCase() === v.toLowerCase())
          if (match) {
            return match
          }
          return v
        })
        const body = rows.slice(1)
        return body.map(v => {
          const row = v.split(',').map(cell => cell.trim())
          return columns.reduce((previous, column, index) => ({...previous, [column]: row[index]}), {})
        })
      } catch (e) {
        return []
      }
    },
    sendIsEnabled () {
      return this.isValid.valid
    },
    warningMessage () {
      if (!this.isValid.valid) {
        return this.isValid.message
      }
      return null
    },
    isValid () {
      if (!Array.isArray(this.csvAsJson) || this.csvAsJson.length === 0) {
        return {valid: false}
      }

      if (this.csvAsJson.length > 10) {
        return {
          valid: false,
          message: 'You cannot upload more than 10 contacts'
        }
      }

      for (let i = 0; i < this.csvAsJson.length; i++) {
        const row = this.csvAsJson[i]
        if (
          !row.firstName || row.firstName.length === 0 ||
          !row.lastName || row.lastName.length === 0 ||
          !row.phoneNumber || row.phoneNumber.length < 5
        ) {
          return {
            valid: false,
            message: `Contact in row ${i + 1} is not valid. Each contact must have a "firstName", "lastName", and "phoneNumber" value.`
          }
        }
      }

      if (!this.region) {
        return {
          valid: false,
          message: 'Select a campaign'
        }
      }

      return {valid: true}
    }
  },

  watch: {
    file (val) {
      if (!val) {
        return
      }

      const reader = new window.FileReader()
      reader.onload = (e) => {
        this.fileData = e.currentTarget.result
        this.file = null
      }
      reader.readAsDataURL(this.file)
    },
  },

  methods: {
    ...mapActions([
      'clearWebexCampaignUploadResponse',
      'uploadWebexCampaignContacts'
    ]),
    onResponseRowClass (row) {
      if (row.Result) {
        return 'is-success'
      } else {
        return 'is-danger'
      }
    },
    clickClearForm () {
      this.fileData = null
      this.region = 'US'
      this.clearWebexCampaignUploadResponse()
    },
    async clickSend () {
      await this.uploadWebexCampaignContacts({
        region: this.region,
        contacts: this.csvAsJson,
      })
      this.fileData = null
    },
    clickDownload () {
      this.isDownloading = true
      const headers = this.columns.join(',') + '\r\n'
      const rows = [
        ['Keanu', 'Reeves', '1234567890', 'support'],
        ['Viggo', 'Mortensen', '0987654321', 'sales'],
        ['Daniel', 'Radcliffe', '5678901234', 'software'],
      ].map(v => v.join(',') + '\r\n')
      try {
        const blob = new Blob([headers, ...rows], { type: 'text/csv' })
        const src = window.webkitURL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'webex-campaign-contacts-example.csv'
        link.href = src
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (e) {
        console.log('failed to convert to CSV:', e)
      } finally {
        this.isDownloading = false
      }
    },
  }
}
</script>
