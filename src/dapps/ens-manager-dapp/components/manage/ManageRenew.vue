<template>
  <div class="full-width">
    <mew-select
      :has-filter="true"
      :label="$t('ens.request.choose-term')"
      :items="items"
      @input="setDuration"
    />

    <div class="font-weight-bold text-center">
      {{ $t('ens.request.estimated-price') }}: {{ rentPriceETH }}
      {{ $t('common.currency.eth') }} (${{ rentPriceUSD }})
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
import {
  formatFloatingPointValue,
  formatFiatValue
} from '@/core/helpers/numberFormatHelper';
export default {
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
  mounted() {
    this.rentPrice();
  },
  methods: {
    rentPrice() {
      return this.getRentPrice(this.duration).then(resp => {
        if (resp) {
          this.rentPriceETH = formatFloatingPointValue(resp.eth).value;
          this.rentPriceUSD = formatFiatValue(resp.usd).value;
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
