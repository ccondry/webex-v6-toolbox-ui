<template>
  <panel title="Desktop Layout" aria-id="desktop-layout">
    <div style="display: flex; flex-wrap: wrap;">
      <!-- Layout -->
      <layout />
      
      <!-- Logo Image -->
      <div>
        <logo />
        <layout-title />
        <layout-background />
      </div>
    </div>
  </panel>
</template>

<script>
import Layout from './layout'
import Logo from './logo'
import LayoutTitle from './title'
import LayoutBackground from './background'

export default {
  components: {
    Layout,
    Logo,
    LayoutTitle,
    LayoutBackground
  }
}
</script>