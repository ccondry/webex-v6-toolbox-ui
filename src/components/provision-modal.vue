<template>
  <div class="modal-card" style="width: auto;">
    <header class="modal-card-head">
      <!-- title -->
      <p class="modal-card-title">
        Provision Webex CC v6 Demo
      </p>
      <!-- close button on top-right -->
      <button
      type="button"
      class="delete"
      style="margin-left: 0.5rem;"
      @click="$emit('close')"
      />
    </header>

    <section 
    class="modal-card-body"
    >
      <p>
        Please enter the VPN password and IMI Connect email address you wish
        to use. Do not re-use your Cisco account password.
      </p>
      <b-field label="VPN Password">
        <b-input
        v-model="password"
        type="password"
        />
      </b-field>
      <b-field label="IMI Account Email">
        <b-input
        v-model="imiEmail"
        />
      </b-field>
    </section>

    <footer class="modal-card-foot" style="justify-content: flex-end;">
      <!-- cancel -->
      <b-button
      rounded
      @click="$emit('close')"
      >
        Cancel
      </b-button>

      <!-- delete -->
      <b-button
      type="is-success"
      rounded
      @click="clickConfirm"
      >
        Start Provision
      </b-button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    imiEmail: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      input: {
        imiEmail: '',
        password: ''
      }
    }
  },

  watch: {
    imiEmail (val) {
      this.input.imiEmail = val
    }
  },

  methods: {
    clickConfirm () {
      this.$emit('submit', this.input)
      this.$emit('close')
    }
  }
}
</script>
