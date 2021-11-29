<template>
  <panel title="Desktop Layout" aria-id="desktop-layout">
    <div style="display: flex; flex-wrap: wrap;">
      <!-- Layout -->
      <layout />
      
      <!-- Logo Image -->
      <div>
        <logo />
        <layout-title />
      </div>
    </div>
  </panel>
</template>

<script>
import Layout from './layout'
import Logo from './logo'
import LayoutTitle from './title'

export default {
  components: {
    Layout,
    Logo,
    LayoutTitle
  }
}
</script>