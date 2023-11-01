<template>
  <div>
    <!-- channel -->
    <b-field :label="channelName">
      <!-- SMS -->
      <b-radio-button
      v-if="channels.includes('sms')"
      v-model="channel"
      native-value="sms"
      type="is-success is-light is-outlined"
      >
        <span>SMS</span>
      </b-radio-button>
      
      <!-- Whatsapp -->
      <b-radio-button
      v-if="channels.includes('whatsapp')"
      v-model="channel"
      native-value="whatsapp"
      type="is-success is-light is-outlined"
      >
        <span>Whatsapp</span>
      </b-radio-button>
      
      <!-- AMB -->
      <b-radio-button
      v-if="channels.includes('amb')"
      v-model="channel"
      native-value="amb"
      type="is-success is-light is-outlined"
      >
        <span>AMB</span>
      </b-radio-button>
      
      <!-- RCS -->
      <b-radio-button
      v-if="channels.includes('rcs')"
      v-model="channel"
      native-value="rcs"
      type="is-success is-light is-outlined"
      >
        <span>RCS</span>
      </b-radio-button>
      
      <!-- GMB -->
      <b-radio-button
      v-if="channels.includes('gmb')"
      v-model="channel"
      native-value="gmb"
      type="is-success is-light is-outlined"
      >
        <span>GBM</span>
      </b-radio-button>

      <!-- Instagram -->
      <b-radio-button
      v-if="channels.includes('instagram')"
      v-model="channel"
      native-value="instagram"
      type="is-success is-light is-outlined"
      >
        <span>IG</span>
      </b-radio-button>
      
      <!-- Facebook -->
      <b-radio-button
      v-if="channels.includes('facebook')"
      v-model="channel"
      native-value="facebook"
      type="is-success is-light is-outlined"
      >
        <span>FB</span>
      </b-radio-button>
    </b-field>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    channels: {
      type: Array,
      default () {
        return [
          'sms',
          'whatsapp',
          'amb',
          'rcs'
        ]
      }
    }
  },

  computed: {
    channel: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    channelName () {
      const channelNames = {
        sms: "Channel (SMS)",
        whatsapp: "Channel (WhatsApp)",
        amb: "Channel (Apple Business Messages)",
        gmb: "Channel (Google Business Messages)",
        instagram: "Channel (Instagram)",
        facebook: "Channel (Facebook)",
        rcs: "Channel (Google Rich Communication Services)"
      }
      return channelNames[this.channel] || "Channel"
    }
  }
}
</script>