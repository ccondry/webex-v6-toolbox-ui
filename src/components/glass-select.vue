<template>
  <b-dropdown
  class="glass-select"
  :value="current"
  :disabled="disabled"
  append-to-body
  scrollable
  :max-height="248"
  aria-role="list"
  @change="onChange"
  >
    <template #trigger="{ active }">
      <button
      type="button"
      class="input glass-select-trigger"
      :class="{ 'is-placeholder': !selectedOption(), 'is-active': active }"
      :disabled="disabled"
      >
        <span class="glass-select-label">
          {{ selectedOption() ? selectedOption().label : placeholder }}
        </span>
        <b-icon :icon="active ? 'chevron-up' : 'chevron-down'" size="is-small" />
      </button>
    </template>

    <template v-for="(option, index) of options()">
      <hr v-if="option.divider" :key="'divider-' + index" class="dropdown-divider">
      <b-dropdown-item
      v-else
      :key="index"
      :value="option.value"
      :disabled="option.disabled"
      aria-role="listitem"
      class="glass-select-item"
      >
        <span>{{ option.label }}</span>
        <svg
        v-if="option.value === current"
        class="glass-select-check"
        viewBox="0 0 32 32"
        aria-hidden="true"
        >
          <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M28.0607 7.93934C28.6464 8.52513 28.6464 9.47487 28.0607 10.0607L14.0607 24.0607C13.4749 24.6464 12.5251 24.6464 11.9393 24.0607L4.93934 17.0607C4.35355 16.4749 4.35355 15.5251 4.93934 14.9393C5.52513 14.3536 6.47487 14.3536 7.06066 14.9393L13 20.8787L25.9393 7.93934C26.5251 7.35355 27.4749 7.35355 28.0607 7.93934Z"
          />
        </svg>
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>

<script>
// text content of a vnode tree
function vnodeText (vnode) {
  if (vnode.text) {
    return vnode.text
  }
  return (vnode.children || []).map(vnodeText).join('')
}

// a drop-in replacement for b-select that takes the same <option> children,
// but opens a styled menu instead of the browser's native select menu
export default {
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: Boolean
  },

  data () {
    return {
      // also tracked locally, for selects used without v-model
      current: this.value
    }
  },

  watch: {
    value (value) {
      this.current = value
    }
  },

  methods: {
    // read the <option> children on every render, since slots are not reactive
    options () {
      return (this.$slots.default || [])
      .filter(vnode => vnode.tag === 'option')
      .map(vnode => {
        const data = vnode.data || {}
        const attrs = data.attrs || {}
        const domProps = data.domProps || {}
        const label = vnodeText(vnode).trim()
        let value = label
        if ('value' in domProps) {
          value = domProps.value
        } else if ('value' in attrs) {
          value = attrs.value
        }
        const disabled = 'disabled' in attrs && attrs.disabled !== false
        return {
          value,
          label,
          disabled,
          divider: disabled && /^-+$/.test(label)
        }
      })
    },
    selectedOption () {
      return this.options().find(option => !option.divider && option.value === this.current)
    },
    onChange (value) {
      this.current = value
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss">
.glass-select {
  .dropdown-trigger {
    max-width: 100%;
  }
}

.glass-select-trigger.input {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: auto;
  max-width: 100%;
  min-width: 10rem;
  cursor: pointer;
  text-align: left;

  &.is-placeholder .glass-select-label {
    color: var(--fg-faint);
  }

  &.is-active {
    border-color: var(--accent);
  }

  &[disabled] {
    cursor: not-allowed;
  }

  .icon {
    flex-shrink: 0;
    color: var(--accent-cyan);
  }
}

.glass-select-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// the menu is appended to <body> with the dropdown's classes copied onto it
.dropdown.glass-select {
  .dropdown-menu {
    z-index: 980;
    min-width: 180px;
    padding-top: 4px;
  }

  .dropdown-content {
    padding: 4px 0;
    border: 0;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    -webkit-backdrop-filter: blur(40px);
    backdrop-filter: blur(40px);
    box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.55);
    font-size: 14px;
    line-height: 20px;
  }

  .dropdown-divider {
    margin: 4px 0;
    background-color: rgba(255, 255, 255, 0.08);
  }

  .dropdown-item.glass-select-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 5px 8px;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    white-space: nowrap;
    transition: background-color 0.15s;

    &:hover,
    &:focus {
      background-color: rgba(255, 255, 255, 0.05);
      color: #fff;
    }

    &.is-active {
      background-color: #192739;
      color: #fff;
    }

    &.is-disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}

.glass-select-check {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  fill: #7e868f;
}
</style>
