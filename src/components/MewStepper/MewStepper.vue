<template>
  <!--
  =====================================================================================
    Mew Stepper 
  =====================================================================================
  -->
  <div class="full-width">
    <v-stepper
      alt-labels
      color="primary"
      class="mew-stepper"
      v-model="stepNumber"
    >
      <v-stepper-header>
        <template v-for="(item, i) in items">
          <v-stepper-step
            color="expandHeader"
            :step="i + 1"
            :key="i + item"
            complete-icon="mdi-check"
            :complete="stepNumber > i + 1"
          >
            {{ item.name }}
          </v-stepper-step>
          <v-divider
            :key="i"
            v-if="i < items.length - 1"
          />
        </template>
      </v-stepper-header>
    </v-stepper>
    <div
      v-for="(step, i) in items"
      :key="step + i"
    >
      <!--
  =====================================================================================
    Slot: 'stepperContent' + number of stepper content (used to place custom ui into
    the stepper)
  =====================================================================================
  -->
      <slot :name="'stepperContent' + (i + 1)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MewStepper',
  data() {
    return {
      stepNumber: this.onStep,
    };
  },
  props: {
    /**
     * Takes an array of stepper item objects i.e, [{step: 0, name: ''}].
     */
    items: {
      type: Array,
      default: () => [],
    },
    /**
     * Controls which step is active.
     */
    onStep: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    onStep(newVal) {
      this.stepNumber = newVal > this.items.length || newVal < 1 ? 1 : newVal;
    },
  },
};
</script>

<style lang="scss">
.mew-stepper {
  background-color: transparent !important;
  &.v-stepper {
    box-shadow: none !important;
    .v-stepper__label {
      text-align: center;
    }
    .v-divider {
      border-color: var(--v-expandHeader-base) !important;
    }
    .v-stepper__step--complete {
      .v-stepper__step__step {
        background-color: var(--v-white-base) !important;
        color: var(--v-expandHeader-base);
        border: 1px solid;
        .v-icon {
          color: var(--v-expandHeader-base);
        }
      }
    }
    .v-stepper__step__step {
      padding: 15px;
    }

    .v-stepper__step--complete,
    .v-stepper__step--active {
      .v-stepper__label {
        color: var(--v-titlePrimary-base);
      }
    }
  }
}
</style>
