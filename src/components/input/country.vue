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
    v-model="country"
    native-value="US"
    type="is-success is-light is-outlined"
    >
      <span>US</span>
    </b-radio-button>

    <!-- UK -->
    <b-radio-button
    v-model="country"
    native-value="UK"
    type="is-success is-light is-outlined"
    >
      <span>UK</span>
    </b-radio-button>

    <!-- Singapore -->
    <b-radio-button
    v-model="country"
    native-value="Singapore"
    type="is-success is-light is-outlined"
    >
      <span>Singapore</span>
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
      default: `Select the US, UK, or Singapore SMS gateway`
    }
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