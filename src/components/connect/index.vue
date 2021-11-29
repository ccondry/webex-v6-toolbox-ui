<template>
  <panel title="Agent Connection" aria-id="agent-connection">
    <div style="display: flex; flex-wrap: wrap;">
      <!-- VPN -->
      <div style="flex: 1 1;">
        <vpn-info />
        <vpn-primary />
        <vpn-backup />
      </div>
      <!-- Workstation -->
      <workstation />
    </div>
  </panel>
</template>

<script>
import VpnBackup from './vpn-backup'
import VpnInfo from './vpn-info'
import VpnPrimary from './vpn-primary'
import Workstation from './workstation'

export default {
  components: {
    VpnBackup,
    VpnInfo,
    VpnPrimary,
    Workstation
  }
}
</script>