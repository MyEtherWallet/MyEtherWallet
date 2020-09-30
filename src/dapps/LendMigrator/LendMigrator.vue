<template>
  <div class="lend-migrator-container">
    <back-button />
    <b-container class="text-center">
      <div class="pt-4 lend-title">{{ $t('dappsAave.lend-title') }}</div>
      <div class="d-flex mt-4 mb-1 total-container entire-bal">
        <p>{{ $t('dappsAave.total-lend') }}: {{ lendBalance }}</p>
        <button class="button-link">{{ $t('sendTx.button-entire') }}</button>
      </div>
      <input type="text" :placeholder="$t('dappsAave.total-amount')" />
      <button class="large-round-button-green-filled mt-3">
        {{ $t('dappsAave.migrate') }}
      </button>
    </b-container>
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';

export default {
  components: {
    'back-button': BackButton
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      lendBalance: 0
    };
  },
  mounted() {
    this.getLENDBal();
  },
  methods: {
    getLENDBal() {
      this.lendToken = this.tokensWithBalance.find(item => {
        console.error('item', item.symbol);
        return item.symbol === 'LEND';
      });
      console.error('lend', this.lendToken);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LendMigrator.scss';
</style>
