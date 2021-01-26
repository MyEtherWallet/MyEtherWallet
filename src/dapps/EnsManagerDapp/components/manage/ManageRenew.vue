<template>
  <div>
    <mew-select
      :has-filter="false"
      :label="$t('ens.request.choose-term')"
      :items="items"
      @input="setDuration"
    />

    <div class="font-weight-bold text-center">
      {{ $t('ens.request.estimated-price') }}: {{ estimatedPrice.eth }}
      {{ $t('common.currency.eth') }} (${{ estimatedPrice.usd }})
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('ens.renew')"
        btn-size="xlarge"
        @click.native="renew(duration)"
      />
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

export default {
  props: {
    renew: {
      default: function () {
        return {};
      },
      type: Function
    },
    hostName: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      duration: 1
    };
  },
  computed: {
    ...mapState('wallet', ['currency']),
    items() {
      const items = [];
      for (let i = 0; i < 20; i++) {
        items.push({ name: i + 1 + ' ' + 'year', value: i + 1 });
      }
      return items;
    },
    estimatedPrice() {
      const eth = new BigNumber(this.pricingByLength)
        .dividedBy(this.currency.value)
        .times(this.duration)
        .toFixed(2);

      const usd = new BigNumber(this.pricingByLength)
        .times(this.duration)
        .toFixed(2);
      return {
        usd: usd,
        eth: eth
      };
    },
    // double check how this works
    pricingByLength() {
      if (this.hostName.length === 3) {
        return 640;
      } else if (this.hostName.length === 4) {
        return 160;
      }

      return 5;
    }
  },
  methods: {
    setDuration(item) {
      this.duration = item.value;
    },
    reset() {
      this.duration = 1;
    }
  }
};
</script>
