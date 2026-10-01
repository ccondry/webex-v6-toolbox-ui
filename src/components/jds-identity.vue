<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204); position: relative;"
    >
      <b-loading :active="isLoading || isWorking" :is-full-page="false" />
      <p class="title" style="white-space:nowrap">
        {{ title }}
      </p>
      <!-- description -->
      <p class="subtitle">
        Customer
      </p>
      <div v-if="!model && !isLoading">
        <p>
          No JDS customer information was found for your account.
        </p>
        <b-button
        rounded
        type="is-info"
        style="margin-top: 1rem;"
        @click="clickRefresh"
        >
          Refresh
        </b-button>
      </div>
      <div v-if="model" style="min-width: 34rem;">
        <!-- name -->
        <b-field label="ID" horizontal>
          <b-input v-model="model.id" disabled />
        </b-field>
        <b-field v-if="model.createdAt" label="Created" horizontal>
          <time-display :value="model.createdAt" />
        </b-field>
        <b-field v-if="model.modifiedAt" label="Modified" horizontal>
          <time-display :value="model.modifiedAt" />
        </b-field>
        <b-field label="First Name" horizontal>
          <b-input v-model="model.firstName" />
        </b-field>
        <b-field label="Last Name" horizontal>
          <b-input v-model="model.lastName" />
        </b-field>
        <b-field label="Phone Numbers" horizontal>
          <b-taginput
          v-model="model.phone"
          :allow-new="true"
          :open-on-focus="true"
          icon="account-box"
          placeholder="add phone"
          />
        </b-field>
        <b-field label="Email Addresses" horizontal>
          <b-taginput
          v-model="model.email"
          :allow-new="true"
          :open-on-focus="true"
          icon="account-box"
          placeholder="add email"
          />
        </b-field>
        <b-field label="Customer IDs" horizontal>
          <b-taginput
          v-model="model.customerId"
          :allow-new="true"
          :open-on-focus="true"
          icon="account-box"
          placeholder="add customer ID"
          />
        </b-field>
  
        <!-- save and reset buttons -->
        <div class="buttons" style="margin-top: 1rem;">
          <b-button
          rounded
          type="is-info"
          @click="clickRefresh"
          >
            Refresh
          </b-button>
  
          <b-button
          rounded
          type="is-primary"
          @click="clickReset"
          >
            Reset Changes
          </b-button>
  
          <b-button
          rounded
          type="is-success"
          @click="clickSave"
          >
            Save
          </b-button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TimeDisplay from './time-display.vue'

export default {
  components: {
    TimeDisplay
  },

  data () {
    return {
      model: null,
      validModelJson: true
    }
  },

  computed: {
    ...mapGetters([
      'jdsIdentity',
      'loading',
      'working'
    ]),
    title () {
      try {
        return `${this.model.firstName} ${this.model.lastName}`
      } catch (e) {
        return 'JDS Customer'
      }
    },
    value () {
      return this.jdsIdentity
    },
    isLoading () {
      return this.loading.jdsIdentity.get
    },
    isWorking () {
      return this.working.jdsIdentity.save
    },
    modelJson: {
      get () {
        return JSON.stringify(this.model, null, 2)
      },
      set (value) {
        try {
          this.model = JSON.parse(value)
          this.validModelJson = true
        } catch (e) {
          // invalid JSON
          this.validModelJson = false
        }
      }
    }
  },

  watch: {
    value () {
      this.updateCache()
    }
  },

  mounted () {
    this.updateCache()
  },

  methods: {
    ...mapActions([
      'getJdsIdentity',
      'saveJdsIdentity'
    ]),
    updateCache () {
      this.model = this.value ? JSON.parse(JSON.stringify(this.value)) : null
      if (!this.model) {
        return
      }
      if (!Array.isArray(this.model.phone)) this.model.phone = []
      if (!Array.isArray(this.model.email)) this.model.email = []
      if (!Array.isArray(this.model.customerId)) this.model.customerId = []
    },
    clickSave () {
      this.saveJdsIdentity(this.model)
    },
    clickReset () {
      this.updateCache()
    },
    clickRefresh () {
      this.getJdsIdentity()
    }
  }
}
</script>
