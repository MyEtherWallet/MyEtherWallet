<template>
  <!--
  =====================================================================================
    Mew Checkbox
  =====================================================================================
  -->
  <div class="d-flex align-center mew-checkbox"> 
    <v-checkbox
      hide-details
      :dense="dense"
      off-icon="mdi-circle-outline"
      on-icon="mdi-check-circle"
      class="titlePrimary--text"
      v-model="isChecked"
    />
    <span
      :class="['mr-2 cursor-pointer', className]"
      @click="toggleCheckbox"
    >{{ label }}
      <a
        target="_blank"
        v-if="link.url && link.title"
        :href="link.url"
      >{{ link.title }}</a>
      <slot name="contentSlot" />
    </span>
  </div>
</template>

<script>

export default {
  name: 'MewCheckbox',
  props: {
    /**
     * Pass a class to change the icon color (i.e error--text).
     */
    className: {
        type: String,
        default: 'titlePrimary--text'
    },
    /**
     * Checkbox label text
     */
    label: {
      type: String,
      default: ''
    },
    /**
     * Adds a link at the end of the label.
     */
    link: {
      type: Object,
      default: () => {
        return { title: '', url: ''};
      }
    },
    /**
     * The checkbox id. Mainly used to distinguish each checkbox when mew-checkbox is used in a loop.
     */
    id: {
      type: Number,
      default: null,
    },
    /**
     * Controls the value of the checkbox (checked or not).
     */
    value: {
      type: Boolean,
      default: false
    },
    /**
     * Reduces the input height.
     */
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isChecked: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val, this.id)
      }
    }
  },
  methods: {
    toggleCheckbox() {
      this.$emit('input', !this.value, this.id);
    }
  }
}
</script>
<style lang="scss" scoped>
.mew-checkbox {
  .v-input--checkbox {
    margin-top: 0;
    padding-top: 0;
  }
}
</style>