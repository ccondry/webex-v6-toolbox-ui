<template>
  <div style="position: relative;">
    <!-- loading -->
    <b-loading :is-full-page="false" :active="working" />
    <!-- visible upload button-->
    <b-field>
      <b-button
      rounded
      type="is-success"
      expanded
      icon-left="upload"
      @click="clickUpload"
      >
        <slot />
      </b-button>
    </b-field>

    <!-- hidden file upload element -->
    <input
    ref="file"
    type="file"
    style="display:none"
    :accept="accept"
    @change="onFilePicked"
    >
  </div>
</template>

<script>
export default {
  props: {
    working: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '*'
    }
  },

  data () {
    return {
      file: null
    }
  },

  methods: {
    clickUpload () {
      this.$refs.file.click()
    },
    onFilePicked (event) {
      const files = event.target.files
      // let filename = files[0].name
      const fileReader = new FileReader()
      // load the file and set up the callback function
      fileReader.addEventListener('load', async () => {
        try {
          const parts = fileReader.result.split(';')
          // extract MIME type
          const mime = parts[0].split(':').pop()
          // extract ecoding and data
          const dataParts = parts[1].split(',')
          const encoding = dataParts[0]
          const data = dataParts[1]
          // send data to parent
          this.$emit('upload', {
            mime,
            encoding,
            data,
            name: this.file.name,
            type: this.file.type,
            lastModified: this.file.lastModified,
            size: this.file.size
          })
        } catch (e) {
          console.log('error reading or uploading file:', e)
        } finally {
          // reset selected file so user could select the same file again
          this.$refs.file.value = null
        }
      })
      // read the file now (callback will be called)
      fileReader.readAsDataURL(files[0])
      // set the selected file
      this.file = files[0]
    }
  }
}
</script>
