<template>
  <panel title="AI Agent Type" aria-id="ai-agent">
    <div style="display: flex; justify-content: space-around;">
      <p>
        Choose the AI agent type you want to use:
      </p>
    </div>
    <br>
    <div style="display: flex; justify-content: space-around;">
      <b-field style="position: relative;">
        <b-loading :active="isLoading || isWorking" :is-full-page="false" />
        <b-select
        v-model="value"
        :disabled="isWorking"
        >
          <option value="scripted">Scripted</option>
          <option value="autonomous">Autonomous</option>
        </b-select>
      </b-field>
    </div>
  </panel>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'working',
      'userDemoConfig',
      'loading',
    ]),
    isWorking () {
      return this.working.user.demoConfig
    },
    isLoading () {
      return this.loading.user.details
    },
    value: {
      get () {
        try {
          return this.userDemoConfig.aiagent || 'scripted'
        } catch (e) {
          return 'scripted'
        }
      },
      set (aiagent) {
        this.saveUserDemoConfig({aiagent})
      }
    }
  },

  methods: {
    ...mapActions([
      'saveUserDemoConfig'
    ]),
  }
}
</script>
