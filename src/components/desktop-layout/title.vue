<template>
  <div class="tile is-parent" style="max-width: 32rem;">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <!-- title -->
      <p class="title">
        Title
      </p>

      <p>
        Set the app title in your desktop layout.
      </p>
      <!-- buttons -->
      <div style="position: relative;">
        <!-- loading -->
        <b-loading :is-full-page="false" :active="isLoading || isWorking" />

        <b-field>
          <b-input v-model="title" />
        </b-field>

        <b-button
        rounded
        type="is-success"
        expanded
        :disabled="isWorking"
        @click="clickSetTitle"
        >
          Update Title
        </b-button>
      </div>
    </article>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  data () {
    return {
      title: ''
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
    currentLayout () {
      return this.desktopLayout || this.globalDesktopLayout
    }
  },

  watch: {
    currentLayout () {
      try {
        this.title = this.currentLayout.appTitle
      } catch (e) {
        // continue
      }
    }
  },

  mounted () {
    try {
      this.title = this.currentLayout.agent.appTitle
    } catch (e) {
      // continue
    }
  },

  methods: {
    ...mapActions([
      'updateDesktopLayout'
    ]),
    clickSetTitle () {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to set the title in your desktop layout to "${this.title}"?`,
        rounded: true,
        confirmText: 'Yes',
        type: 'is-success',
        onConfirm: () => {
          // get the current layout, whether user or global
          // create a copy of the layout
          const layoutCopy = JSON.parse(JSON.stringify(this.currentLayout))
          // set the app title
          layoutCopy.agent.appTitle = this.title
          layoutCopy.supervisor.appTitle = this.title
          layoutCopy.supervisorAgent.appTitle = this.title
          // update user layout
          this.updateDesktopLayout(layoutCopy)
        }
      })
    }
  }
}
</script>
