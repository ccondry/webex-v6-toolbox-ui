<template>
  <b-field>
    <template #label>
      Country
      <b-tooltip
      type="is-dark"
      :label="tooltip"
      >
        <b-icon size="is-small" icon="information-outline" />
      </b-tooltip>
    </template>

    <!-- US -->
    <b-radio-button
    v-if="countries.includes('us')"
    v-model="country"
    native-value="US"
    type="is-success is-light is-outlined"
    >
      <span>US</span>
    </b-radio-button>

    <!-- UK -->
    <b-radio-button
    v-if="countries.includes('uk')"
    v-model="country"
    native-value="UK"
    type="is-success is-light is-outlined"
    >
      <span>UK</span>
    </b-radio-button>

    <!-- Singapore -->
    <b-radio-button
    v-if="countries.includes('sng')"
    v-model="country"
    native-value="SNG"
    type="is-success is-light is-outlined"
    >
      <span>SNG</span>
    </b-radio-button>
  </b-field>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      default: `Select US, UK or SNG, depending where you want SMS to be sent to`
    },
    countries: {
      type: Array,
      default: () => ['us', 'uk', 'sng']
    },
  },

  computed: {
    country: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>