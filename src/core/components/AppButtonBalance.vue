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
      <div v-if="!text" class="greenPrimary--text mew-body">
        Balance: {{ balanceFormatted.value }}
      </div>
      <div else class="primary--text mew-body">
        {{ text }}
      </div>
      <mew-tooltip
        v-if="balanceFormatted.tooltipText"
        class="pl-1"
        :text="balanceFormatted.tooltipText"
      />
    </div>
  </div>
</template>

<script>
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
export default {
  components: {},
  props: {
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
    /** Set this proerty to wei if you are dispalying ETH balance vs erc20 tokens*/
    balance: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return { loadingDots: '' };
  },
  computed: {
    balanceFormatted() {
      return formatFloatingPointValue(this.balance);
    }
  },
  mounted() {
    this.animateLoadingDots();
  },
  methods: {
    animateLoadingDots() {
      const dots = 4;

      setInterval(() => {
        if (this.loadingDots.length < dots)
          this.loadingDots = this.loadingDots + '.';
        else this.loadingDots = '';
      }, 400);
    }
  }
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
