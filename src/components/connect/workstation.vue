<template>
  <div class="tile is-parent">
    <article
    class="tile is-child box"
    style="border: 1px solid rgb(204, 204, 204);"
    >
      <!-- title -->
      <p class="title">
        Workstation
      </p>
      
      <!-- content -->
      <p>
        After you have connected to the demo session VPN,
        connect to the Workstation using Microsoft Remote Desktop
        Client.
      </p>

      <p>
        Add the
        <a :href="caCertUrl" download>
          <strong>dCloud Root CA certificate</strong>
        </a>
        <copy :value="caCertUrl" name="dCloud Root CA certificate URL" />
        as a
        <b-tooltip label="Click here for step-by-step instructions">
          <a @click="clickInstructions">
            <strong>trusted root CA on your laptop</strong>
          </a>
          <!-- <b-icon icon="help-circle" type="is-primary" size="is-small" /> -->
        </b-tooltip>
        to remove the certificate warning when
        you attempt to connect to the RDP workstation.
      </p>

      <p style="white-space:nowrap">
        Remote Desktop Workstation:
        <strong>{{ rdpAddress }}</strong>
        <copy :value="rdpFqdn" name="Workstation RDP Address" />
      </p>

      <p>
        <!-- credentials -->
        Connect to the Workstation using one of your agent's credentials
        (below).
      </p>

      <p>
        <!-- you can have more than 1 -->
        Create a separate connection profile in Microsoft Remote Desktop
        application to have both agent and supervisor desktops open at the
        same time.
      </p>

      <p>
        <!-- issues -->
        If you have any issues connecting to
        the Workstation using the FQDN, then try using the
        IP address instead.
      </p>
      <p>
        If you are on Windows, you may need to try rebooting to
        resolve any AnyConnect-related DNS issue.
      </p>
    </article>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CaInstallationModal from '../ca-installation-modal'

export default {
  computed: {
    ...mapGetters([
      'rdpAddress',
      'rdpFqdn',
      'caCertUrl'
    ])
  },
  
  methods: {
    clickInstructions () {
      this.$buefy.modal.open({
        parent: this,
        component: CaInstallationModal,
        hasModalCard: true,
        trapFocus: true
      })
    }
  }
}
</script>