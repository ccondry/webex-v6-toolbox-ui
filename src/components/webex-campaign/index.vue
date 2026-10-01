<template>
  <panel title="Webex Campaign" aria-id="webex-campaign" style="width: auto;">
    <div style="display: flex; justify-content: space-around; width: 100%;">
      <div class="demo-panels">
        <one-contact />
        <multiple-contacts />
      </div>
    </div>
  </panel>
</template>

<script>
import MultipleContacts from './multiple-contacts.vue'
import OneContact from './one-contact.vue'

export default {
  components: {
    MultipleContacts,
    OneContact,
  },
}
</script>
