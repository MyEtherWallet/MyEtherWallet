<template>
  <!-- ===================================================================================== -->
  <!-- Mew Stepper -->
  <!-- ===================================================================================== -->
  <div class="full-width">
    <div v-if="compact" class="d-flex justify-center">
      <div class="d-inline-block">
        <div
          v-for="(item, i) in items"
          :key="i"
          :class="stepNumber == i + 1 ? 'stepper-item-active' : ''"
          class="stepper-item d-flex align-center"
        >
          <div class="stepper-number mr-2">
            {{ i + 1 }}
          </div>
          <div class="stepper-title">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <v-stepper
      v-if="!compact"
      v-model="stepNumber"
      alt-labels
      color="primary"
      class="mew-stepper"
    >
      <v-stepper-header>
        <template>
          <div v-for="(item, i) in items" :key="i + item">
            <v-stepper-step
              color="expandHeader"
              :step="i + 1"
              complete-icon="mdi-check"
              :complete="stepNumber > i + 1"
            >
              {{ item.name }}
            </v-stepper-step>
            <v-divider v-if="i < items.length - 1" :key="i" />
          </div>
        </template>
      </v-stepper-header>
    </v-stepper>
    <div v-for="(step, i) in items" :key="step + i">
      <!-- ===================================================================================== -->
      <!-- Slot: 'stepperContent' + number of stepper content -->
      <!-- (used to place custom ui into the stepper) -->
      <!-- ===================================================================================== -->
      <slot :name="'stepperContent' + (i + 1)" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  onStep: {
    type: Number,
    default: 1
  },
  compact: {
    type: Boolean,
    default: false
  }
});

// data
const stepNumber = ref(props.onStep);

// watch
watch(
  () => props.onStep,
  newVal => {
    stepNumber.value = newVal > props.items.length || newVal < 1 ? 1 : newVal;
  }
);
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

<style lang="scss" scoped>
.stepper-item {
  position: relative;
  padding: 10px 0;

  .stepper-number {
    background-color: rgba(0, 0, 0, 0.38);
    line-height: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 30px;
    color: white;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .stepper-title {
    color: rgba(0, 0, 0, 0.38);
    font-weight: 400;
  }
  &:not(:last-child)::after {
    content: '';
    height: 14px;
    width: 0;
    border-left: 1px solid var(--v-expandHeader-base);
    position: absolute;
    bottom: -7px;
    left: 15px;
  }
}

.stepper-item-active {
  opacity: 1;
  .stepper-number {
    background-color: var(--v-expandHeader-base) !important;
  }
  .stepper-title {
    color: var(--v-titlePrimary-base);
    font-weight: 500;
  }
}
</style>
