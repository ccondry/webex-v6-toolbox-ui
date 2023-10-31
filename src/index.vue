<template>
  <div>
    <!-- top navbar -->
    <navbar />
    <!-- main -->
    <div
    id="main-container"
    class="container is-fluid is-marginless app-content"
    >
      <section class="main">
        <!-- loading -->
        <b-loading :active="isProduction && (isLoading || isWorking)" />

        <!-- welcome -->
        <welcome />

        <!-- Provision -->
        <provision v-if="!isProvisionStarted && !isProvisioned" />

        <!-- Provision In Progress -->
        <provision-progress v-if="isProvisionStarted && !isProvisioned" />

        <!-- Demo Website -->
        <demo-website v-if="isProvisioned" />

        <!-- VPN and Workstation connection -->
        <connect v-if="isProvisioned" />

        <!-- Agents and Supervisors -->
        <agents v-if="isProvisioned" />

        <!-- Mobile Web App, SMS, Whatsapp, Facebook -->
        <mobile v-if="isProvisioned" />

        <!-- Demos -->
        <demos v-if="isProvisioned && (isAdmin || isAdminSu)" />

        <!-- Outbound -->
        <outbound v-if="isProvisioned && (isAdmin || isAdminSu)" />

        <!-- Agent Desktop Layout -->
        <desktop-layout v-if="isProvisioned" />

        <!-- Laptop Demo -->
        <laptop-demo v-if="isProvisioned" />

        <!-- Webex Connect -->
        <webex-connect v-if="isProvisioned" />
        
        <!-- Reprovision -->
        <!-- <reprovision v-if="isProvisioned" /> -->

        <!-- Admin -->
        <admin v-if="isAdmin || isAdminSu" />

        <!-- debug info -->
        <!-- <debug v-if="!isProduction" /> -->

        <!-- Copyright and version footer -->
        <app-footer />
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Navbar from './components/navbar'
import Welcome from './components/welcome'
import Provision from './components/provision'
import ProvisionProgress from './components/provision-progress'
import Agents from './components/agents'
import Demos from './components/demos'
import Outbound from './components/outbound'
import DemoWebsite from './components/demo-website'
// import Reprovision from './components/reprovision'
import AppFooter from './components/app-footer'
// import Debug from './components/debug'
import Admin from './components/admin'
import Mobile from './components/mobile/index.vue'
import LaptopDemo from './components/laptop-demo'
import Connect from './components/connect'
import DesktopLayout from './components/desktop-layout'
import WebexConnect from './components/webex-connect'

export default {
  components: {
    Navbar,
    Welcome,
    Provision,
    ProvisionProgress,
    Agents,
    Demos,
    DemoWebsite,
    // Reprovision,
    AppFooter,
    // Debug,
    Admin,
    Mobile,
    LaptopDemo,
    Connect,
    Outbound,
    DesktopLayout,
    WebexConnect
  },

  data () {
    return {
      interval: null
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'isAdmin',
      'isAdminSu',
      'isQa',
      'jwtUser',
      'loading',
      'working',
      'isProvisioned',
      'isProvisionStarted',
      'isProduction',
      'user'
    ]),
    isLoading () {
      return this.loading.app.environment ||
      this.loading.user.provision ||
      this.loading.user.details
    },
    isWorking () {
      return this.working.user.provision ||
      this.working.user.logout
    }
  },

  watch: {
    user () {
      // user data loaded
      if (this.isAdmin || this.isQa) {
        // get the JDS identity info for this user
        this.getJdsIdentity()
      }
    },
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        // user just logged in
        // get demo verticals list
        this.getVerticals()
        if (this.isAdmin || this.isQa) {
          // get the JDS identity info for this user
          this.getJdsIdentity()
        }
      } else if (!val && oldVal) {
        // user just logged out. make them log in again.
        this.login()
      }
    },
    isProvisionStarted (val, oldVal) {
      if (val && !oldVal) {
        // provision was started
        // clear any previous exisitng interval, just in case
        if (this.interval) {
          clearInterval(this.interval)
        }
        // start interval to refresh provision status until its done
        this.interval = setInterval(() => {
          this.getUser()
        }, 15 * 1000)
      } 
    },
    isProvisioned (val, oldVal) {
      if (val && !oldVal) {
        // provision completed. stop interval.
        clearInterval(this.interval)
      }
    }
  },

  mounted () {
    // try to find and validate user's JWT from localStorage,
    // or start the SSO login process to get one
    this.checkJwt()
    // get the Authentication REST API version
    this.getAuthApiVersion()
    // get the demo base configuration for webex-v6
    this.getDemoInfo()
    // get the dCloud session ID and datacenter
    this.getInstance()
    if (this.isLoggedIn) {
      if (this.isAdmin || this.isQa) {
        // get the JDS identity info for this user
        this.getJdsIdentity()
      }
    }
  },

  methods: {
    ...mapActions([
      'checkJwt',
      'getAuthApiVersion',
      'login',
      'getDemoInfo',
      'getJdsIdentity',
      'getVerticals',
      'getUser',
      'getInstance'
    ])
  }
}
</script>
