<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <!-- title -->
      <p class="title">
        Layout
      </p>

      <p>
        Download your existing desktop layout JSON, modify it, then upload it
        to change your agent desktop layout.
      </p>
      <p>
        You can also download the Global Layout <a href="https://mm-static.cxdemo.net/wxcc/global_layout8.zip" download>Here</a>  
      </p>

      <!-- buttons -->
      <div style="position: relative;">
        <!-- loading -->
        <b-loading :is-full-page="false" :active="isLoading || isWorking" />

        <!-- download current layout -->
        <b-field v-if="globalDesktopLayout">
          <b-button
          tag="a"
          download="Global_Layout.json"
          rounded
          type="is-primary"
          expanded
          :href="globalDesktopLayoutFileData"
          icon-left="download"
          >
            <!-- Download Default Layout -->
            Download the Default Layout
            <!-- {{ globalDesktopLayout.attributes.jsonFileName__s }} -->
          </b-button>
        </b-field>

        <!-- download your layout -->
        <b-field v-if="desktopLayout">
          <b-button
          tag="a"
          :download="`User_${user.id}.json`"
          rounded
          type="is-primary"
          expanded
          :href="fileData"
          icon-left="download"
          >
            Download Your Layout
            <!-- {{ desktopLayout.attributes.jsonFileName__s }} -->
          </b-button>
        </b-field>

        <!-- upload desktop layout-->
        <upload
        :working="isWorking"
        accept="application/json;text/json"
        @upload="upload"
        >
          Upload Desktop Layout
        </upload>
      </div>
    </article>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Upload from '../upload'

export default {
  components: {
    Upload
  },

  data () {
    return {
      file: null
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'working',
      'desktopLayout',
      'globalDesktopLayout',
      'user'
    ]),
    isLoading () {
      return this.loading.webex.desktopLayout
    },
    isWorking () {
      return this.working.webex.desktopLayout
    },
    fileData () {
      return this.generateFileData(JSON.stringify(this.desktopLayout, null, 2))
    },
    globalDesktopLayoutFileData () {
      return this.generateFileData(JSON.stringify(this.globalDesktopLayout, null, 2))
    }
  },

  mounted () {
    this.getDesktopLayout()
    this.getGlobalDesktopLayout()
  },

  methods: {
    ...mapActions([
      'getDesktopLayout',
      'updateDesktopLayout',
      'getGlobalDesktopLayout'
    ]),
    generateFileData (content) {
      try {
        return `data:application/json;charset=utf-8,${encodeURIComponent(content)}`
      } catch (e) {
        return null
      }
    },
    upload ({
      data,
      encoding,
      lastModified,
      mime,
      name,
      size,
      type
    }) {
      // validate MIME type is JSON or text
      const validTypes = ['application/json', 'text/json', 'text/plain']
      if (validTypes.includes(mime)) {
        // valid MIME type
        if (encoding === 'base64') {
          // convert data from base64 to ascii, then send it
          const ascii = atob(data)
          const json = JSON.parse(ascii)
          this.$buefy.dialog.confirm({
            message: 'Are you sure you want to replace your desktop layout?',
            rounded: true,
            confirmText: 'Yes',
            type: 'is-success',
            onConfirm: () => {
              // send to REST
              this.updateDesktopLayout(json)
            }
          })
        } else {
          console.log('encoding type is', encoding)
        }
      } else {
        // invalid MIME type
        this.$buefy.toast.open({
          message: `The file you provided is type ${mime} but needs to be one of: ${validTypes.join(', ')}.`,
          type: 'is-danger',
          duration: 10 * 1000
        })
      }
    }
  }
}
</script>
