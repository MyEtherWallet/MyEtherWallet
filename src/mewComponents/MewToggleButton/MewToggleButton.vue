<template>
  <v-btn-toggle
    :mandatory="buttonType.toLowerCase() === buttonTypes.default ? true : false"
    :borderless="true"
    class="mew-toggle-btn"
  >
    <v-btn
      :class="getClasses()"
      color="white"
      @click="onBtnClick(btn)"
      v-for="(btn, i) in buttonGroup"
      :key="btn + i"
    >
      {{ buttonType.toLowerCase() === buttonTypes.custom ? '' : btn }}
      <slot :name="'btn' + (i + 1)" />
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  data() {
    return {
      buttonTypes: {
        custom: 'custom',
        default: 'default',
        percentage: 'percentage'
      },
      onBtn: this.buttonGroup[0]
    }
  },
  props: {
    /**
     * Accepts an array of button names. 
     */
    buttonGroup: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /**
     * Applies the button type: 'custom', 'percentage', 'default'. Custom is used when you need to use the slots. 
     */
    buttonType: {
      type: String,
      default: 'default'
    }
  },
  methods: {
    onBtnClick(btn) {
      this.$emit('onBtnClick', btn);
    },
    getClasses() {
      const classes = [];

      if (this.buttonType.toLowerCase() === this.buttonTypes.default) {
        classes.push('mew-caption default-btn')
      }

      if (this.buttonType.toLowerCase() === this.buttonTypes.percentage) {
        classes.push('percentage-btn')
      }

      return classes;
    }
  }
}
</script>

<style lang="scss" scoped>
.mew-toggle-btn {
  border-radius: 6px;
  .v-btn {
    border-radius: 6px;
    opacity: 1;
    // default btn group
    &.default-btn {
      color: var(--v-textPrimary-base);
      font-weight: normal !important;
      height: 25px !important;
      min-width: 31px !important;
      &.v-btn--active {
        background-color: var(--v-secondary-base) !important;
        color: var(--v-white-base);
        font-weight: bold !important;
      }
    }

    // percentage btn group
    &.percentage-btn {
      color: var(--v-titlePrimary-base);
      height: 33px !important; 
      margin-right: 15px;
      width: 49px !important;
      text-transform: capitalize;
      &.v-btn--active {
        background-color: var(--v-white-base) !important;
        border: 1px solid var(--v-primary-base) !important;
        color: var(--v-primary-base) !important;

        &:before {
          opacity: 0;
        }
      }

      .v-ripple__container {
        color: var(--v-white-base) !important;
      }
    }
  }
}
</style>