<template>
  <v-stepper v-model="stepNumber" light class="mew-stepper">
    <v-stepper-header class="justify-center full-height">
      <v-stepper-step
        v-for="(item, i) in items"
        :key="i"
        :class="[
          'pr-0',
          'font-weight-medium',
          'ml-n4',
          stepNumber === item.step ? 'active' : '',
          stepNumber > item.step ? 'complete' : ''
        ]"
        color="expandHeader"
        :step="item.name"
      />
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content :step="stepNumber">
        <slot :name="'stepperContent' + stepNumber" />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: function () {
        return [];
      }
    },
    onStep: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      stepNumber: this.onStep
    };
  },
  watch: {
    onStep(newVal) {
      this.stepNumber = newVal > this.items.length || newVal < 1 ? 1 : newVal;
      console.log(newVal);
    }
  }
};
</script>

<style lang="scss">
.mew-stepper {
  .v-stepper__step {
    min-width: 250px;
    .right-border-img {
      height: 100px;
      top: -12px;
      right: -7px;
      position: absolute;
      z-index: 1;
    }

    &:after {
      content: '';
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-left: 20px solid var(--v-superPrimary-base);
      position: absolute;
      right: -20px;
      top: 24px;
      z-index: 1;
    }

    &:before {
      top: 10px;
      border-color: transparent transparent transparent #fdd;
      border-width: 10px;
    }

    &:before {
      content: '';
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-left: 20px solid var(--v-white-base);
      position: absolute;
      left: 24px;
      top: 24px;
    }
  }

  .v-stepper__step:not(.active):not(.complete):not(.v-stepper__step--error)
    .v-stepper__step__step {
    background-color: var(--v-superPrimary-base) !important;
    color: var(--v-textSecondary-base);
  }

  .active {
    cursor: auto;
    .v-stepper__step__step {
      background: var(--v-expandHeader-base) !important;
    }
    &:after {
      border-left: 20px solid var(--v-expandHeader-base);
    }
  }

  .complete {
    cursor: auto;
    .v-stepper__step__step {
      background-color: var(--v-searchText-base) !important;
    }

    &:after {
      border-left: 20px solid var(--v-searchText-base) !important;
    }
  }

  .v-stepper__step--complete,
  .active {
    cursor: auto;
    &:after {
      border-left: 20px solid var(--v-expandHeader-base);
    }
  }

  .v-stepper__step__step {
    border-radius: 0 !important;
    margin-right: 0 !important;
    padding: 20px 40px;
    width: 100%;
  }

  .v-stepper__step:first-of-type:before,
  .v-stepper__step:last-child:after {
    display: none;
  }

  .v-stepper__step:last-child {
    min-width: 270px;
  }

  .v-stepper__step:first-of-type .v-stepper__step__step {
    border-top-left-radius: 10px !important;
    border-bottom-left-radius: 10px !important;
  }

  .v-stepper__step:last-child .v-stepper__step__step {
    border-top-right-radius: 10px !important;
    border-bottom-right-radius: 10px !important;
    padding-right: 40px;
  }
}
</style>
