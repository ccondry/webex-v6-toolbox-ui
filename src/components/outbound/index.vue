<template>
  <panel title="Outbound" aria-id="outbound">
    <b-loading :active="isLoading || isWorking" :is-full-page="false" />
    <div
    style="display: flex; justify-content: space-around; width: 100%;"
    v-if="!isLoading"
    >
      <!-- already provisioned -->
      <div v-if="isProvisioned" class="demo-panels">
        <one-contact />
        <multiple-contacts />
      </div>

      <!-- provision requested -->
      <div v-else-if="isProvisionRequested" class="demo-panels">
        Please allow 24-48 hours for your outbound campaign to be provisioned.
      </div>

      <!-- not provisioned or requested yet -->
      <div v-else class="demo-panels">
        <provision />
      </div>
    </div>
  </panel>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

import MultipleContacts from './multiple-contacts.vue'
import OneContact from './one-contact.vue'
import Provision from './provision.vue'

export default {
  components: {
    MultipleContacts,
    OneContact,
    Provision,
  },

  computed: {
    ...mapGetters([
      'loading',
      'working',
      'userDemoConfig',
      'outboundProvisionStatus'
    ]),
    isProvisioned () {
      return this.outboundProvisionStatus
    },
    isProvisionRequested () {
      return this.userDemoConfig.outboundProvision
    },
    isLoading () {
      return this.loading.outbound.provision
    },
    isWorking () {
      return this.working.outbound.provision
    }
  },

  mounted () {
    this.getOutboundProvisionStatus()
  },

  methods: {
    ...mapActions([
      'getOutboundProvisionStatus'
    ])
  }
}
</script>
