<template>
  <div class="glass-card">
    <div class="glass-card-glow" />
    <!-- <div class="glass-card-glow-hover" /> -->
    <!-- <div class="glass-card-shimmer">
      <div class="glass-card-shimmer-sweep" />
    </div> -->
    <b-collapse
    :aria-id="ariaId"
    class="panel glass-card-surface"
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
        <h3>{{ title }}</h3>
      </div>
      <div class="panel-block">
        <div class="content">
          <slot />
        </div>
      </div>
    </b-collapse>
  </div>
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

<style lang="scss">
// Figma catalog card: 2px gradient border, blue glow, dark frosted surface
.glass-card {
  position: relative;
  padding: 2px;
  border-radius: 14px;
  background: var(--card-border);

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  &:hover {
    // > .glass-card-glow-hover,
    // > .glass-card-shimmer {
    //   opacity: 1;
    // }

    > .glass-card-surface {
      box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.6);
    }
  }
}

.glass-card-glow,
// .glass-card-glow-hover,
// .glass-card-shimmer {
//   position: absolute;
//   pointer-events: none;
// }

.glass-card-glow {
  inset: -4px;
  border-radius: 18px;
  background: var(--glow);
  filter: blur(8px);
  z-index: 0;
}

// .glass-card-glow-hover {
//   inset: -16px;
//   border-radius: 28px;
//   background: var(--glow-strong);
//   filter: blur(32px);
//   opacity: 0;
//   transition: opacity 0.3s;
//   z-index: 0;
// }

// .glass-card-shimmer {
//   inset: 0;
//   overflow: hidden;
//   border-radius: 14px;
//   opacity: 0;
//   transition: opacity 0.3s;
//   z-index: 1;
// }

// .glass-card-shimmer-sweep {
//   position: absolute;
//   inset: -100%;
//   background: var(--shimmer);
//   transform: rotate(113deg);
// }

.panel.glass-card-surface {
  position: relative;
  z-index: 2;
  margin: 0;
  overflow: hidden;
  border: none;
  border-radius: 13px;
  background-color: var(--card-surface);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.45);
  transition: box-shadow 0.2s ease-out;
  height: 100%;

  .panel-heading {
    padding: 18px 20px 0;
    border-radius: 0;
    background: transparent;
    cursor: pointer;

    h3 {
      margin: 0;
      font-family: var(--font-heading);
      font-size: 17px;
      font-weight: 700;
      line-height: 22px;
      color: var(--fg-strong);
    }
  }

  .panel-block {
    display: block;
    padding: 14px 20px 20px;
    border: none;
    background: transparent;
    color: var(--fg);

    &:first-child {
      padding-top: 20px;
    }
  }
}

// cards inside cards: no stacked glows
.glass-card .glass-card {
  margin-bottom: 1rem;

  // > .glass-card-glow-hover,
  // > .glass-card-shimmer, 
  > .glass-card-glow {
    display: none;
  }
}
</style>
