<template>
  <div class="d-flex confirmation-container">
    <i class="check-icon fa fa-check" aria-hidden="true" />
    <h2 class="title">{{ $t('confirmation.success') }}</h2>
    <i18n path="dappsStaked.done-desc" tag="span">
      <span slot="amt">
        {{ amount }}
      </span>
      <a slot="staked" href="https://staked.us/" target="_blank">Staked.us</a>
    </i18n>
    <div class="explorrer-container">
      <a class="explorrer-link" :href="explorrer" target="_blank">{{
        $t('sendTx.success.button-check-explorer', {
          explorrerName: explorrerName
        })
      }}</a>
      <a v-if="showEthvm" class="explorrer-link" :href="ethvm" target="_blank">
        {{
          $t('sendTx.success.button-check-explorer', {
            explorrerName: $t('footer.ethvm')
          })
        }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Misc } from '@/helpers';
export default {
  props: {
    hash: {
      type: String,
      default: ''
    },
    amt: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      amount: 0
    };
  },
  computed: {
    ...mapState('main', ['network']),
    explorrer() {
      return this.network.type.blockExplorerTX.replace('[[txHash]]', this.hash);
    },
    ethvm() {
      return `https://www.ethvm.com/tx/${this.hash}`;
    },
    showEthvm() {
      return this.network.type.name === 'ETH';
    },
    explorrerName() {
      return Misc.getService(this.network.type.blockExplorerTX);
    }
  },
  watch: {
    amt: {
      handler: function (newval) {
        this.amount = newval;
      },
      immediate: true
    }
  },
  mounted() {
    this.$emit('completed', true, { key: 'done', value: true });
  }
};
</script>

<style lang="scss" scoped>
@import 'Done.scss';
</style>
