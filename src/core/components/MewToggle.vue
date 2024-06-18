<template>
  <!--
=====================================================================================
  Mew Toggle 
=====================================================================================
-->
  <div>
    <v-btn-toggle
      v-if="isCustom"
      v-model="onBtn"
      :mandatory="true"
      :borderless="true"
      class="mew-toggle"
    >
      <div
        v-for="(btn, i) in buttonGroup"
        :key="btn + i"
        :class="getClasses()"
        color="mewBg"
        @click="onBtnClick(btn)"
      >
        <!--
=====================================================================================
  Slot: 'btn' + number of btn (used to place custom ui in a specific toggle button)
=====================================================================================
-->
        <slot :name="'btn' + (i + 1)" />
      </div>
    </v-btn-toggle>
    <v-btn-toggle
      v-if="!isCustom"
      v-model="onBtn"
      :mandatory="isDefault"
      :borderless="true"
      class="mew-toggle"
    >
      <v-btn
        v-for="(btn, i) in buttonGroup"
        :key="btn + i"
        :class="getClasses()"
        color="mewBg"
        @click="onBtnClick(btn)"
      >
        {{ btn }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';

// emits
const emits = defineEmits(['onBtnClick']);

// props
const props = defineProps({
  /**
   * Controls which toggle button index is active.
   */
  onToggleBtnIdx: {
    type: Number,
    default: 0
  },
  /**
   * Accepts an array of button names.
   */
  buttonGroup: {
    type: Array,
    default: () => {
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
});

// data
const onBtn = ref(null);
const buttonTypes = {
  custom: 'custom',
  default: 'default',
  percentage: 'percentage'
};

// computed
const isDefault = computed(() => {
  return props.buttonType.toLowerCase() === buttonTypes.default;
});
const isCustom = computed(() => {
  return props.buttonType.toLowerCase() === buttonTypes.custom;
});

// watch
watch(
  () => props.onToggleBtnIdx,
  () => {
    onBtn.value = props.onToggleBtnIdx;
  }
);

// mounted
onMounted(() => {
  onBtn.value = props.onToggleBtnIdx;
});

// methods
const onBtnClick = btn => {
  emits('onBtnClick', btn);
};

const getClasses = () => {
  if (props.buttonType.toLowerCase() === buttonTypes.default) {
    return 'mew-caption default-btn';
  }

  if (props.buttonType.toLowerCase() === buttonTypes.percentage) {
    return 'percentage-btn';
  }
};
</script>

<style lang="scss" scoped>
.mew-toggle {
  border-radius: 6px;
  .v-btn {
    border-radius: 6px;
    opacity: 1;
    padding: 0;
    // default btn group
    &.default-btn {
      color: var(--v-textPrimary-base);
      font-weight: normal !important;
      height: 25px !important;
      min-width: 31px !important;
      margin-right: 5px;
      &.v-btn--active {
        background-color: var(--v-blue500-base) !important;
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
