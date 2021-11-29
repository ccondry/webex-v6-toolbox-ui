<template>
  <panel title="Laptop Demo" aria-id="laptop-demo">
    <div>
      <p>
        If you don't want to use the RDP workstation, you can connect your
        agent's phone using the Webex app on your laptop.
        <br>
        Your agents will need a Webex or Webex Calling app to receive
        voice calls on their extensions.
        <br>
        Download one of them here:
      </p>
      <ul>
        <li>
          <a :href="links.webex" download>Webex</a>
        </li>
        <li>
          <a :href="links.windows" download>Webex Calling (Windows)</a>
        </li>
        <li>
          <a :href="links.mac" download>Webex Calling (Mac)</a>
        </li>
      </ul>
    </div>
  </panel>
</template>


<script>
import {mapGetters} from 'vuex'

export default {
  components: {
  },

  data () {
    return {
      links: {
        webex: 'https://www.webex.com/downloads.html/',
        // windows: 'https://rialto.broadcloudpbx.com/btbc/mac/Webex_Calling.msi',
        // mac: 'https://rialto.broadcloudpbx.com/btbc/mac/Webex_Calling.dmg'
        windows: 'https://mm-static.cxdemo.net/Webex_Calling.msi',
        mac: 'https://mm-static.cxdemo.net/Webex_Calling.dmg'
      }
    }
  },
  computed: {
    ...mapGetters([
    ])
  }
}
</script>
