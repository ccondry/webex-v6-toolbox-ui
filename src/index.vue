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

        <!-- Mobile App and Mobile Web App-->
        <mobile-app v-if="isProvisioned" />

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
import DemoWebsite from './components/demo-website'
// import Reprovision from './components/reprovision'
import AppFooter from './components/app-footer'
// import Debug from './components/debug'
import Admin from './components/admin'
import MobileApp from './components/mobile-app'
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
    DemoWebsite,
    // Reprovision,
    AppFooter,
    // Debug,
    Admin,
    MobileApp,
    LaptopDemo,
    Connect,
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
      'jwtUser',
      'loading',
      'working',
      'isProvisioned',
      'isProvisionStarted',
      'isProduction'
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
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        // user just logged in
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
    // get demo verticals list
    this.getVerticals()
    // get the dCloud session ID and datacenter
    this.getInstance()
  },

  methods: {
    ...mapActions([
      'checkJwt',
      'getAuthApiVersion',
      'login',
      'getDemoInfo',
      'getVerticals',
      'getUser',
      'getInstance'
    ])
  }
}
</script>
