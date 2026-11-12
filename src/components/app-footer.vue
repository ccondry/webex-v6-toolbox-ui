<template>
  <panel aria-id="version-copyright">
    <div class="app-footer">
      <cisco-mark class="app-footer-logo" />
      <small> 
        UI Version {{ uiVersion }}
      </small>
      <small>
        Auth API Version {{ authApiVersion }}
      </small>
      <small>
        © 2021 Cisco and/or its affiliates. All rights reserved.
      </small>
    </div>
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'
import CiscoMark from '../components/cisco-mark'

export default {
  components: {
    CiscoMark
  },

  computed: {
    ...mapGetters([
      'uiVersion',
      'authApiVersion'
    ])
  }
}
</script>

<style lang="scss">
.app-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--fg-faint);
  font-size: 12px;

  small {
    font-size: 12px;
  }
}

.app-footer-logo {
  display: block;
  height: 2rem;
  width: auto;
  margin-bottom: 8px;
  color: var(--fg-strong);
}
</style>
