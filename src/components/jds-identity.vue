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
      <div v-if="model" style="min-width: 34rem;">
        <!-- name -->
        <b-field label="ID" horizontal>
          <b-input v-model="model.id" disabled />
        </b-field>
        <b-field label="Created" horizontal>
          <time-display :value="model.createdAt" />
        </b-field>
        <b-field label="Modified" horizontal>
          <time-display :value="model.modifiedAt" />
        </b-field>
        <b-field label="First Name" horizontal>
          <b-input v-model="model.firstName" />
        </b-field>
        <b-field label="Last Name" horizontal>
          <b-input v-model="model.lastName" />
        </b-field>
          
        <b-field
        v-if="hasPhone"
        label="Phone Numbers"
        horizontal
        >
          <b-taginput
          v-model="phones.values"
          :allow-new="true"
          :open-on-focus="true"
          icon="account-box"
          placeholder="add phone"
          />
        </b-field>
        <b-field
        v-if="hasEmail"
        label="Email Addresses"
        horizontal
        >
          <b-taginput
          v-model="emails.values"
          :allow-new="true"
          :open-on-focus="true"
          icon="account-box"
          placeholder="add email"
          />
        </b-field>
        <b-field
        v-if="hasCustomerId"
        label="Customer IDs"
        horizontal
        >
          <b-taginput
          v-model="customerIds.values"
          :allow-new="true"
          :open-on-focus="true"
          icon="account-box"
          placeholder="add customer ID"
          />
        </b-field>
        <div class="buttons">
          <b-button v-if="!hasPhone" @click="clickAddPhone">
            Add Phone
          </b-button>
          <b-button v-if="!hasEmail" @click="clickAddEmail">
            Add Email
          </b-button>
          <b-button v-if="!hasCustomerId" @click="clickAddCustomerId">
            Add Customer ID
          </b-button>
        </div>
  
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
    hasPhone () {
      return this.getIdentity('phone') ? true : false
    },
    hasEmail () {
      return this.getIdentity('email') ? true : false
    },
    hasCustomerId () {
      return this.getIdentity('customerId') ? true : false
    },
    phones () {
      return this.getIdentity('phone')
    },
    emails () {
      return this.getIdentity('email')
    },
    customerIds () {
      return this.getIdentity('customerId')
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
    clickAddPhone () {
      this.addIdentity('phone')
    },
    clickAddEmail () {
      this.addIdentity('email')
    },
    clickAddCustomerId () {
      this.addIdentity('customerId')
    },
    addIdentity (type) {
      this.model.customerId.push({type, identities: []})
    },
    getIdentity (type) {
      return this.model.customerId.find(v => v.type === type)
    },
    updateCache () {
      this.model = JSON.parse(JSON.stringify(this.value))
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
