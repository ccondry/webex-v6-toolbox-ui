<template>
  <panel title="Mobile" aria-id="mobile">
    <div class="panel-row">
      <!-- mobile app -->
      <mobile-app />
      
      <!-- sms -->
      <sms />

      <!-- <whatsapp /> -->
      <whatsapp />

      <!-- <facebook /> -->
      <facebook />
    </div>
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