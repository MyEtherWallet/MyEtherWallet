<template>
  <div
    class="core-components--app-table"
    :class="containerClass"
    :style="containerStyle"
  >
    <div v-if="title" class="font-weight-bold mt-6 ml-5 mb-10">
      {{ title }}
    </div>
    <slot />
    <div v-if="loading" class="skeleton-loader-container">
      <div v-for="n in Number(loaderCount)" :key="n">
        <v-skeleton-loader width="100%" type="heading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

// props
const props = defineProps({
  fullWidth: {
    type: Boolean,
    default: false
  },
  hoverEffect: {
    type: Boolean,
    default: false
  },
  background: {
    type: Boolean,
    default: false
  },
  mobileBackground: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loaderCount: {
    type: [String, Number],
    default: 1
  },
  borderAround: {
    type: Boolean,
    default: false
  },
  borderTopBottom: {
    type: Boolean,
    default: false
  },
  borderTop: {
    type: Boolean,
    default: false
  },
  borderBottom: {
    type: Boolean,
    default: false
  },
  divider: {
    type: Boolean,
    default: false
  },
  flat: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  paddingAround: {
    type: Boolean,
    default: false
  },
  paddingSide: {
    type: Boolean,
    default: false
  },
  roundCorner: {
    type: Boolean,
    default: false
  },
  noTablePadding: {
    type: Boolean,
    default: false
  }
});

// computed
const containerStyle = computed(() => {
  return {
    display: props.fullWidth ? 'block' : 'inline-block'
  };
});
const containerClass = computed(() => {
  return [
    props.hoverEffect ? 'hover-effect' : '',
    props.background ? 'alteranting-background' : '',
    props.borderAround ? 'border-around' : '',
    props.borderTopBottom ? 'border-top-bottom' : '',
    props.borderTop ? 'border-top' : '',
    props.borderBottom ? 'border-bottom' : '',
    props.roundCorner ? 'round-corner' : '',
    props.loading ? 'loading' : '',
    props.flat ? '' : 'box-shadow',
    props.divider ? 'divider' : '',
    props.paddingAround ? 'padding-around' : '',
    props.paddingSide ? 'padding-side' : '',
    props.mobileBackground ? 'mobile-background' : '',
    props.noTablePadding ? 'no-table-padding' : ''
  ];
});
</script>

<style lang="scss">
.core-components--app-table {
  // Force style Vuetify skeleton loader
  .v-skeleton-loader__heading {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.skeleton-loader-container {
  & > div {
    display: flex;
    align-items: center;
    height: 58px;
    padding: 0px 20px;
  }
}

// Default styles
.core-components--app-table {
  --bg-color: #f4f7fe;
  --hover-color: #eaeffb;
  --border-color: #e0e5f2;
  --shadow-color: rgba(0, 0, 0, 0.15);
  table {
    border-collapse: collapse;
    width: 100%;
    thead {
      border-bottom: 1px solid var(--border-color);
      font-size: 12px;
      color: #76848b;
      font-weight: 500;
    }
    td {
      height: 58px;
      padding: 0px 20px;
    }
  }
}

// Options by props
.box-shadow {
  box-shadow: 0 2px 6px var(--shadow-color);
}
.border-around {
  border: 1px solid var(--border-color);
}
.border-top-bottom {
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}
.border-top {
  border-top: 1px solid var(--border-color);
}
.border-bottom {
  border-bottom: 1px solid var(--border-color);
}
.hover-effect {
  tbody {
    tr:hover {
      background-color: var(--hover-color) !important;
    }
  }
}
.alteranting-background {
  tbody {
    tr:nth-child(odd) {
      background-color: var(--bg-color);
    }
  }
}
.loading {
  tbody {
    display: none;
  }
}
.divider {
  tbody {
    tr:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
    }
  }
}
.padding-around {
  padding: 15px 15px 15px 15px;
}

.padding-side {
  padding: 0px 10px;
}
.round-corner {
  border-radius: 8px;
  overflow: hidden;
}
.mobile-background {
  background-color: var(--v-blueLight-base);
}
.no-table-padding {
  table {
    td {
      padding: 0 !important;
    }
    td:first-child {
      padding-left: 15px !important;
    }
    td:last-child {
      padding-right: 15px !important;
    }
  }
}
</style>
