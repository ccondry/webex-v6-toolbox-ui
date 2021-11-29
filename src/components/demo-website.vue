<template>
  <panel title="Demo Website" aria-id="demo-website">
    <p>
      Choose the vertical you want to use, then click Go to Demo Website to
      show the customer side of the demo.
    </p>
    <div style="display: flex; justify-content: space-around;">
      <b-field style="position: relative;">
        <b-loading :active="isLoading || isWorking" :is-full-page="false" />
        <b-select
        v-model="vertical" 
        :disabled="working.app.user"
        @change.native="verticalChanged" 
        >
          <option :value="null" disabled selected>
            Choose Your Demo Vertical
          </option>
          <option
          v-for="(brand, index) in systemBrands" 
          :key="'system' + index"
          :value="brand.id"
          >
            {{ `${brand.name} (${brand.id})` }}
          </option>
          <option disabled>
            -----------------------------------------
          </option>
          <option
          v-for="(brand, index) in otherBrands"
          :key="'other' + index"
          :value="brand.id"
          >
            {{ `${brand.name} (${brand.id})` }}
          </option>
        </b-select>
      </b-field>
    </div>

    <br>

    <p>
      Note: You can create and configure your own vertical on the
      <a href="/branding" target="_blank">
        <strong>Demo Branding Toolbox</strong>
      </a>.
    </p>

    <b-field v-if="!isLocked">
      <b-button
      :disabled="working.app.user"
      type="is-success"
      rounded
      expanded
      tag="a"
      :href="brandDemoLink"
      target="_blank"
      >
        Go to Demo Website
      </b-button>
    </b-field>
  </panel>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      ownerFilter: '',
      brandFilter: 'mine',
      vertical: '',
      multichannel: 'ece',
      showMore: false
    }
  },

  computed: {
    ...mapGetters([
      'verticals',
      'working',
      'brandDemoLink',
      'userDemoConfig',
      'loading',
      'jwtUser',
      'isLocked'
    ]),
    isWorking () {
      return this.working.user.demoConfig
    },
    isLoading () {
      return this.loading.dcloud.verticals
    },
    sortedBrands () {
      // make a mutable copy of the store data
      try {
        const copy = JSON.parse(JSON.stringify(this.verticals))
        // case-insensitive sort by name
        copy.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })
        return copy
      } catch (e) {
        console.log(`couldn't get sorted brands`, e)
        return []
      }
    },
    systemBrands () {
      return this.sortedBrands.filter(v => !v.owner || v.owner === 'system' || v.owner === null)
    },
    otherBrands () {
      return this.myBrands
    },
    myBrands () {
      return this.sortedBrands.filter(v => v.owner === this.jwtUser.username)
    }
  },

  watch: {
    verticals (val, oldVal) {
      this.updateSelection()
    },
    vertical (val, oldVal) {
      // console.log('vertical watcher: vertical changed:', val)
      // console.log('this.sortedbrands.length = ', this.sortedBrands.length)
      this.updateSelection()
    },
    userDemoConfig (val) {
      console.log('demo user config changed:', val)
      this.updateCache()
    },
    ownerFilter () {
      this.brandFilter = 'other'
    }
  },

  mounted () {
    this.updateCache()
  },

  methods: {
    ...mapActions([
      'saveUserDemoConfig'
    ]),
    updateCache () {
      try {
        // copy vertical selection to the one in demo config
        this.vertical = this.userDemoConfig.vertical
      } catch (e) {
        // continue - this.userDemoConfig is probably not ready yet
      }
    },
    updateSelection () {
      const selectedVertical = this.verticals.find(v => v.id === this.vertical)
      console.log('selectedVertical = ', selectedVertical)
    },
    verticalChanged (e) {
      console.log('vertical selected:', e.target.value)
      // construct data body to send to API
      const data = {
        vertical: e.target.value
      }
      // save vertical
      this.saveUserDemoConfig(data)
    }
  }
}
</script>
