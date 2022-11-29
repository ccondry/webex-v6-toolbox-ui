<template>
  <panel title="Mobile" aria-id="mobile">
    <b-field label="Channel">
      <!-- Mobile Web App -->
      <b-radio-button
      v-model="app"
      native-value="app"
      type="is-success is-light is-outlined"
      >
        <span>Web</span>
      </b-radio-button>

      <!-- SMS -->
      <b-radio-button
      v-model="app"
      native-value="sms"
      type="is-success is-light is-outlined"
      >
        <span>SMS</span>
      </b-radio-button>

      <!-- Whatsapp -->
      <b-radio-button
      v-model="app"
      native-value="whatsapp"
      type="is-success is-light is-outlined"
      >
        <span>Whatsapp</span>
      </b-radio-button>

      <!-- Facebook -->
      <b-radio-button
      v-model="app"
      native-value="facebook"
      type="is-success is-light is-outlined"
      >
        <span>Facebook</span>
      </b-radio-button>
    </b-field>

    <!-- mobile app -->
    <mobile-app v-show="app === 'app'" />
    
    <!-- sms -->
    <sms v-show="app === 'sms'" />

    <!-- <whatsapp /> -->
    <whatsapp v-show="app === 'whatsapp'" />

    <!-- <facebook /> -->
    <facebook v-show="app === 'facebook'" />
  </panel>
</template>

<script>
import MobileApp from './app'
import Sms from './sms'
import Whatsapp from './whatsapp'
import Facebook from './facebook'

export default {
  components: {
    MobileApp,
    Sms,
    Whatsapp,
    Facebook
  },

  data () {
    return {
      app: 'app'
    }
  }
}
</script>

<style scoped>
.panel-row {
  display: flex;
  justify-content: space-between;
}
.panel-row > div {
  max-width: 32rem;
}
.panel-row > div:not(:last-child) {
  margin-right: 2rem;
}
</style>