<template>
  <panel title="Outbound" aria-id="outbound">
    <div style="display: flex; justify-content: space-around; width: 100%;">
      <div id="demo-panels">
        <one-contact />
        <multiple-contacts />
      </div>
    </div>
  </panel>
</template>

<script>
import OneContact from './one-contact.vue'
import MultipleContacts from './multiple-contacts.vue'

export default {
  components: {
    OneContact,
    MultipleContacts,
  },
}
</script>
