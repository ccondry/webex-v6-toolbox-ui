<template>
  <div class="tile is-parent" style="max-width: 32rem;">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <!-- title -->
      <p class="title">
        Logo
      </p>

      <p>
        Upload a logo image to automatically replace the logo in your current
        desktop layout.
      </p>

      <upload
      :working="isWorking || isLoading"
      @upload="upload"
      >
        Upload Logo Image
      </upload>
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
      'globalDesktopLayout'
    ]),
    isLoading () {
      return this.loading.webex.desktopLayout
    },
    isWorking () {
      return this.working.webex.desktopLayout
    },
    fileData () {
      return this.generateFileData(this.desktopLayout)
    },
    globalDesktopLayoutFileData () {
      return this.generateFileData(this.globalDesktopLayout)
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
      'getGlobalDesktopLayout',
      'uploadLogoImage'
    ]),
    upload ({
      data,
      encoding,
      lastModified,
      mime,
      name,
      size,
      type
    }) {
      console.log('upload', name)
      // validate MIME type
      const validTypes = ['image/png', 'image/jpeg', 'image/bmp']
      if (validTypes.includes(mime)) {
        this.$buefy.dialog.confirm({
          message: 'Are you sure you want to replace the logo image in your desktop layout?',
          rounded: true,
          confirmText: 'Yes',
          type: 'is-success',
          onConfirm: () => {
            // remove the extension from the file name
            const n = name.split('.')
            n.pop()
            const nameNoExtension = n.join('.')

            // upload the logo image, which will also update the desktop layout
            this.uploadLogoImage({
              name: `${nameNoExtension}_${new Date().getTime()}`,
              data: `data:${mime};${encoding},${data}`
            })
          }
        })
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
