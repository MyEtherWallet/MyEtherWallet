<template>
  <div class="full-width">
    <mew-select
      :has-filter="true"
      :label="$t('ens.request.select-duration')"
      :items="items"
      normal-dropdown
      @input="setDuration"
    />
    <div class="font-weight-bold text-center">
      {{ $t('ens.request.estimated-price') }}: {{ rentPriceETH }}
      {{ $t('common.currency.eth') }} ({{ rentPriceUSD }})
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <div>
        <span
          v-if="noFundsForRenewalFees"
          class="balance-error d-flex mt-2 mb-3 justify-center align-center"
        >
          Not enough balance.
          <a
            v-show="network.type.canBuy"
            target="_blank"
            class="link"
            @click="
              () => {
                openBuySell('ENSRenew');
              }
            "
          >
            <u>Buy More Eth</u>
          </a>
        </span>
        <div class="d-flex align-center justify-center">
          <mew-button
            :loading="loadingRenew"
            :disabled="noFundsForRenewalFees || loadingRenew"
            :title="$t('ens.renew')"
            btn-size="xlarge"
            @click.native="renew(duration)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import buyMore from '@/core/mixins/buyMore.mixin.js';
export default {
  mixins: [buyMore],
  props: {
    getRentPrice: {
      default: function () {
        return {};
      },
      type: Function
    },
    renew: {
      default: function () {
        return {};
      },
      type: Function
    },
    getTotalRenewFeeOnly: {
      default: function () {
        return {};
      },
      type: Function
    },
    noFundsForRenewalFees: {
      default: false,
      type: Boolean
    },
    loadingRenew: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      duration: 0,
      rentPriceETH: '',
      rentPriceUSD: ''
    };
  },
  computed: {
    items() {
      const items = [];
      for (let i = 0; i < 20; i++) {
        items.push({
          name: i + 1 + ' ' + `year${i < 1 ? '' : 's'}`,
          value: (i + 1).toString()
        });
      }
      return items;
    }
  },
  watch: {
    duration(newVal) {
      this.getTotalRenewFeeOnly(newVal);
    }
  },
  mounted() {
    this.rentPrice();
    this.getTotalRenewFeeOnly(1);
  },
  methods: {
    ...mapGetters('global', ['getFiatValue', 'network']),
    rentPrice() {
      return this.getRentPrice(this.duration).then(resp => {
        if (resp) {
          this.rentPriceETH = formatFloatingPointValue(resp.eth).value;
          this.rentPriceUSD = this.getFiatValue()(resp.usd);
        }
      });
    },
    setDuration(item) {
      this.duration = parseInt(item.value);
      this.rentPrice();
    }
  }
};
</script>
<style lang="scss" scoped>
.balance-error {
  color: #ff445b;
  font-size: 12px;
}
.link {
  color: #ff445b;
  font-weight: 600;
  padding-left: 5px;
  font-size: 12px;
}
.link:hover {
  color: #e96071;
}
</style>
