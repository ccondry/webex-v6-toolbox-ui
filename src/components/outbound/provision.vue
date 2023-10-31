<template>
  <b-button type="is-success" @click="clickProvision">
    Provision My Outbound Campaign
  </b-button>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  methods: {
    ...mapActions([
      'requestOutboundProvision',
    ]),
    clickProvision () {
      this.requestOutboundProvision()
    }
  }
}
</script>
