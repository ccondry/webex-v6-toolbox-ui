<template>
  <panel title="Upload Outbound Contacts CSV File">
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
          <p>Upload your outbound contacts CSV file here</p>
        </div>
      </b-upload>
    </b-field>

    <!-- upload contacts table -->
    <div v-show="csvAsJson.length > 0">
      <h4 style="margin-bottom: 0;">
        Upload Contacts:
      </h4>
      <b-table
      id="outbound-upload"
      :data="csvAsJson"
      :paginated="csvAsJson.length > 5"
      :per-page="6"
      :pagination-simple="true"
      >
        <!-- # -->
        <b-table-column
        v-slot="props"
        label="#"
        field="index"
        >
          {{ props.index + 1 }}
        </b-table-column>

        <!-- first name -->
        <b-table-column
        v-slot="props"
        label="First Name"
        field="firstName"
        >
          {{ props.row.firstName }}
        </b-table-column>

        <!-- last name -->
        <b-table-column
        v-slot="props"
        label="Last Name"
        field="lastName"
        >
          {{ props.row.lastName }}
        </b-table-column>

        <!-- phone -->
        <b-table-column
        v-slot="props"
        label="Phone"
        field="phone"
        >
          {{ props.row.phone }}
        </b-table-column>

        <!-- reason -->
        <b-table-column
        v-slot="props"
        label="Reason"
        field="reason"
        >
          {{ props.row.reason }}
        </b-table-column>

        <template v-show="warningMessage" #footer>
          <div class="has-text-right has-text-danger">
            {{ warningMessage }}
          </div>
        </template>
      </b-table>
    </div>
    
    <!-- response table -->
    <div v-show="csvAsJson.length === 0 && outboundUploadResponse.length > 0">
      <h4 style="margin-bottom: 0;">
        Response:
      </h4>
      <b-table id="outbound-response" :data="outboundUploadResponse">
        <!-- Contact -->
        <b-table-column
        v-slot="props"
        label="Contact"
        field="Contact"
        >
          {{ props.row.Contact }}
        </b-table-column>
        
        <!-- Result -->
        <b-table-column
        v-slot="props"
        label="Result"
        field="Result"
        >
          {{ props.row.Result }}
        </b-table-column>

        <!-- Error Description -->
        <b-table-column
        v-slot="props"
        label="Error Description"
        field="ErrorDescription"
        >
          {{ props.row.ErrorDescription }}
        </b-table-column>
      </b-table>
    </div>

    <div class="buttons" style="display: flex; justify-content: flex-end;">
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
      :disabled="!fileData && outboundUploadResponse.length === 0"
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
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      // the file handle
      file: null,
      // the raw file data
      fileData: null,
      // this is true while the download to CSV file is working
      isDownloading: false,
    }
  },

  computed: {
    ...mapGetters([
      'working',
      'outboundUploadResponse'
    ]),
    isWorking () {
      return this.working.outbound.upload
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
        // get all rows from CSV
        const rows = (this.csvData.trim().split('\n') || []).map(v => v.trim())
        // header is the first row
        const header = rows[0]
        // split header into columns array
        const columns = header.split(',').map(v => v.trim())
        // body is all rows after header
        const body = rows.slice(1)
        // map body rows to an array of key: value objects using columns
        return body.map(v => {
          const row = v.split(',').map(v => v.trim())
          return columns.reduce((p, c, i) => ({...p, [c]: row[i]}), {})
        })
      } catch (e) {
        return []
      }
    },
    sendIsEnabled () {
      // return true if data to upload is valid
      return this.isValid.valid
    },
    warningMessage () {
      if (!this.isValid.valid) {
        return this.isValid.message
      }
      // if (this.outboundUploadResponse) {
      //   return JSON.stringify(this.outboundUploadResponse, null, 2)
      // }
      return null
    },
    isValid () {
      if (!Array.isArray(this.csvAsJson)) {
        return {
          valid: false,
          message: 'Request body should be an array of contacts'
        }
      }

      if (this.csvAsJson.length === 0) {
        return {
          valid: false
        }
      }

      if (this.csvAsJson.length > 5) {
        return {
          valid: false,
          message: 'You cannot upload more than 5 contacts'
        }
      }

      // check each row
      for (let i = 0; i < this.csvAsJson.length; i++) {
        const row = this.csvAsJson[i]
        if (
          !row.firstName || row.firstName.length === 0 ||
          !row.lastName || row.lastName.length === 0 ||
          !row.phone || row.phone.length < 5
        ) {
          return {
            valid: false,
            message: `Contact in row ${i + 1} is not valid. Each contact must have a "firstName", "lastName", and "phone" value.`
          }
        }
      }

      return {
        valid: true
      }
    }
  },

  watch: {
    file (val) {
      if (!val) {
        return
      }

      // set up file reader
      const reader = new window.FileReader()
      reader.onload = (e) => {
        // store file data locally
        this.fileData = e.currentTarget.result
        // reset file upload button
        this.file = null
      }
      // read the file now
      reader.readAsDataURL(this.file)
    }
  },

  methods: {
    ...mapActions([
      'clearOutboundUploadResponse',
      'uploadOutboundContacts'
    ]),
    clickClearForm () {
      // clear local uploaded file data
      this.fileData = null
      // clear response
      this.clearOutboundUploadResponse()
    },
    async clickSend () {
      // upload CSV contacts as JSON
      await this.uploadOutboundContacts(this.csvAsJson)
      // clear input form data
      this.fileData = null
    },
    clickDownload () {
      // build CSV file data
      this.isDownloading = true
      const columns = ['firstName', 'lastName', 'phone', 'reason',]
      const headers = columns.join(',') + '\r\n'
      const rows = [
        ['Keanu', 'Reeves', '1234567890', 'support'],
        ['Viggo', 'Mortensen', '0987654321', 'sales'],
        ['Daniel', 'Radcliffe', '5678901234', 'software'],
      ].map(v => v.join(',') + '\r\n')
      try {
        // build binary object of the data
        const blob = new Blob([headers, ...rows], { type: 'text/csv' })
        const src = window.webkitURL.createObjectURL(blob)

        // Insert a link that allows the user to download file
        const link = document.createElement('a')
        link.innerHTML = ''
        link.download = 'contacts-example.csv'
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
