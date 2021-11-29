<template>
  <b-collapse
  :aria-id="ariaId"
  class="panel"
  animation="slide"
  :open="open"
  >
    <div
    v-if="title.length"
    slot="trigger"
    class="panel-heading"
    role="button"
    :aria-controls="ariaId"
    >
      <strong>{{ title }}</strong>
    </div>
    <div
    class="panel-block"
    style="background-color: white;"
    :style="!title.length ? 'border-radius: 6px;' : ''"
    >
      <div class="content">
        <slot />
      </div>
    </div>
  </b-collapse>
</template>

<script>
export default {
  props: {
    title: {
      default: '',
      type: String
    },
    ariaId: {
      default: '',
      type: String
    },
    open: {
      default: true,
      type: Boolean
    }
  }
}
</script>