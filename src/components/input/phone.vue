<template>
  <b-field>
    <template #label>
      Phone Number
      <b-tooltip
      type="is-dark"
      label="Your mobile phone number, including the country code prefix, but without leading 0 or +"
      >
        <b-icon size="is-small" icon="information-outline" />
      </b-tooltip>
    </template>
    <b-input
    v-model="phone"
    :controls="false"
    placeholder="Country Code + Phone"
    @keyup.enter.native="$emit('submit')"
    />
  </b-field>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },

  computed: {
    phone: {
      get () {
        return this.value
      },
      set (value) {
        // update parent
        this.$emit('input', value)
      }
    }
  }
}
</script>