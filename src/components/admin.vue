<template>
  <!-- full config details for user when using admin using switch-user -->
  <panel title="Admin" aria-id="admin" :open="false">
    <b-loading :active="isLoading || isWorking" :is-full-page="false" />
    <p>
      Manually enter this user's demo configuration, then click Save.
    </p>

    <!-- vertical -->
    <b-field label="Vertical ID">
      <b-input v-model="model.vertical" />
    </b-field>

    <!-- Action -->
    <b-field label="Action">
      <b-input
      v-model="model.action"
      />
    </b-field>

    <!-- status -->
    <b-field label="Provision Status">
      <b-select v-model="model.provision">
        <option
        v-for="status of provisionStatuses"
        :key="status"
        :value="status"
        >
          {{ status }}
        </option>
      </b-select>
    </b-field>

    <!-- VPN Username -->
    <b-field label="VPN Username">
      <b-input
      v-model="model.vpnUsername"
      />
    </b-field>

    <!-- Webex Connect Email -->
    <b-field label="Webex Connect Email">
      <b-input
      v-model="model.imiEmail"
      />
    </b-field>

    <!-- Webex Connect Email -->
    <b-field label="Outbound Provision">
      <b-input
      v-model="model.outboundProvision"
      />
    </b-field>

    <!-- Save Button -->
    <b-field>
      <b-button
      type="is-success"
      :disabled="disableSave"
      rounded
      expanded
      @click="clickSave"
      >
        Save
      </b-button>
    </b-field>

    <!-- Delete Button -->
    <b-field>
      <b-button
      :disabled="working.user.provision"
      type="is-danger"
      rounded
      expanded
      @click.prevent="clickDeprovision"
      >
        Delete Account
      </b-button>
    </b-field>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      model: {},
      provisionStatuses: [
        'complete',
        'started',
        'error',
        'action',
        ''
      ]
    }
  },

  computed: {
    ...mapGetters([
      'defaults',
      'isAdmin',
      'isAdminSu',
      'userDemoConfig',
      'working',
      'loading',
      'jwtUser'
    ]),
    disableSave () {
      return false
    },
    isWorking () {
      return this.working.user.demoConfig
    },
    isLoading () {
      return this.loading.user.details
    }
  },

  watch: {
    userDemoConfig () {
      this.updateCache()
    }
  },

  mounted () {
    this.updateCache()
  },

  methods: {
    ...mapActions([
      'saveUserDemoConfig',
      'deprovisionUser'
    ]),
    clickDeprovision () {
      console.log('clickDeprovision')
      this.$buefy.dialog.confirm({
        title: 'Deprovision',
        message: `Are you sure you want to deprovision this Webex v8 user <strong>${this.jwtUser.username} (${this.jwtUser.id})</strong>?`,
        rounded: true,
        confirmText: 'Confirm',
        type: 'is-danger',
        onConfirm: () => {
          this.deprovisionUser()
        }
      })
    },
    clickSave () {
      const copy = JSON.parse(JSON.stringify(this.model))
      this.saveUserDemoConfig(copy)
    },
    updateCache () {
      this.model = JSON.parse(JSON.stringify(this.userDemoConfig))
    }
  }
}
</script>
