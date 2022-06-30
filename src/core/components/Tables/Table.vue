<template>
  <div class="table-component" :class="containerClass" :style="containerStyle">
    <div v-if="title" class="font-weight-bold mt-6 ml-5 mb-10">{{ title }}</div>
    <slot />
    <div v-if="loading" class="skeleton-loader-container">
      <div v-for="n in 4" :key="n">
        <v-skeleton-loader width="100%" type="heading"></v-skeleton-loader>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableComponent',
  components: {},
  props: {
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
    loading: {
      type: Boolean,
      default: false
    },
    borderAround: {
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
    }
  },
  data() {
    return {};
  },
  computed: {
    containerStyle() {
      return {
        display: this.fullWidth ? 'block' : 'inline-block'
      };
    },
    containerClass() {
      return [
        this.hoverEffect ? 'hover-effect' : '',
        this.background ? 'alteranting-background' : '',
        this.borderAround ? 'border-around' : '',
        this.loading ? 'loading' : '',
        this.flat ? '' : 'box-shadow',
        this.divider ? 'divider' : ''
      ];
    }
  }
};
</script>

<style lang="scss">
.table-component {
  // Vuetify skeleton loader
  .v-skeleton-loader__heading {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.skeleton-loader-container {
  & > div {
    padding: 15px 20px;
  }
}

.table-component {
  --bg-color: #f4f7fe;
  --border-color: #e0e5f2;
  --shadow-color: rgba(0, 0, 0, 0.15);

  border-radius: 8px;
  overflow: hidden;

  &.border-around {
    border: 1px solid var(--border-color);
  }

  &.box-shadow {
    box-shadow: 0 2px 6px var(--shadow-color);
  }
}

table {
  border-collapse: collapse;
  width: 100%;

  thead {
    border-bottom: 1px solid var(--border-color);
    font-size: 12px;
  }

  tbody {
  }

  td {
    padding: 15px 20px;
  }
}

.hover-effect {
  tbody {
    tr:hover {
      background-color: var(--bg-color);
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
</style>
