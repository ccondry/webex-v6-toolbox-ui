<template>
  <panel title="User Accounts" aria-id="agents">
    <div style="display: flex; flex-wrap: wrap;">
      <agent :agent="sandra" />
      <agent :agent="rick" />
      <agent :agent="admin" />
    </div>
  </panel>
</template>


<script>
import {mapGetters} from 'vuex'
import Agent from './agent'

export default {
  components: {
    Agent
  },

  data () {
    return {
      imageFolder: 'https://mm.cxdemo.net/static/images/cumulus/common',
      loginDomain: 'cc.dc-01.com'
    }
  },

  computed: {
    ...mapGetters([
      'jwtUser'
    ]),
    sandra () {
      return {
        picture: this.imageFolder + '/sandra.png',
        rdpUsername: 'dcloud\\sjeffers' + this.jwtUser.id,
        username: 'sjeffers' + this.jwtUser.id + '@' + this.loginDomain,
        password: 'C1sco12345',
        extension: '80' + this.jwtUser.id,
        name: 'Sandra Jefferson',
        role: 'Agent',
        description: 'Agent'
      }
    },
    rick () {
      return {
        picture: this.imageFolder + '/rick.png',
        rdpUsername: 'dcloud\\rbarrows' + this.jwtUser.id,
        username: 'rbarrows' + this.jwtUser.id + '@' + this.loginDomain,
        password: 'C1sco12345',
        extension: '82' + this.jwtUser.id,
        name: 'Rick Barrows',
        role: 'Supervisor',
        description: 'Supervisor'
      }
    },
    admin () {
      return {
        picture: this.imageFolder + '/helen.png',
        username: [
          'dcloudwxcc@gmail.com',
          'dcloudwxcc+2@gmail.com',
          'dcloudwxcc+3@gmail.com'
        ],
        password: 'C1sco12345!',
        name: 'Administrator',
        role: 'Administrator',
        description: 'Administrator'
      }
    }
  }
}
</script>
