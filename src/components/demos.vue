<template>
  <panel title="Demos" aria-id="demos">
    <div style="display: flex; justify-content: space-around; width: 100%;">
      <div id="demo-panels">
        <appointment-demo />
        <call-deflection-demo />
      </div>
    </div>
  </panel>
</template>

<script>
import AppointmentDemo from './appointment-demo.vue'
import CallDeflectionDemo from './call-deflection-demo.vue'

export default {
  components: {
    AppointmentDemo,
    CallDeflectionDemo,
  },
}
</script>

<style>
#demo-panels {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-around; */
  justify-content: flex-start;
}

#demo-panels>div {
  width: 28.7rem;
  /* max-width: 32rem; */
  margin: 0.3rem;
}
</style>