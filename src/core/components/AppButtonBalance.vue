<template>
  <div class="core--components--app-button-balance">
    <div v-if="loading" class="greenPrimary--text d-flex align-center">
      <v-progress-circular
        size="11"
        width="2"
        class="mr-1"
        indeterminate
        color="primary"
      />
      {{ loadingText }}
      <span v-if="!noDots" class="loading-dots">{{ loadingDots }}</span>
    </div>

    <div v-else class="d-flex align-center justify-end">
      <div v-if="!text" class="greenPrimary--text mew-body BalanceLabel">
        Balance: {{ balanceFormatted.value }}
      </div>
      <div else class="primary--text mew-body">
        {{ text }}
      </div>
      <mew-tooltip
        v-if="balanceFormatted.tooltipText"
        class="pl-1"
        style="height: 21px"
        :text="balanceFormatted.tooltipText"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';

// props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  noDots: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading balance'
  },
  balance: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
});

// data
const loadingDots = ref('');

// computed
const balanceFormatted = computed(() => {
  return formatFloatingPointValue(props.balance);
});

// mounted
onMounted(() => {
  animateLoadingDots();
});

// methods
const animateLoadingDots = () => {
  const dots = 4;

  setInterval(() => {
    if (loadingDots.value.length < dots)
      loadingDots.value = loadingDots.value + '.';
    else loadingDots.value = '';
  }, 400);
};
</script>

<style lang="scss" scoped>
.core--components--app-button-balance {
  position: absolute;
  top: -25px;
  right: 0px;
}

.loading-dots {
  width: 20px;
}
</style>
