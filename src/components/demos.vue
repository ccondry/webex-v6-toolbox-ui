<template>
  <panel title="Demos" aria-id="demos">
    <div style="display: flex; justify-content: space-around; width: 100%;">
      <div class="demo-panels">
        <appointment-demo />
        <call-deflection-demo />
        <ai-agent-demo />
      </div>
    </div>
  </panel>
</template>

<script>
import AppointmentDemo from './appointment-demo.vue'
import CallDeflectionDemo from './call-deflection-demo.vue'
import AiAgentDemo from './ai-agent-demo.vue'

export default {
  components: {
    AppointmentDemo,
    CallDeflectionDemo,
    AiAgentDemo,

  },
}
</script>
