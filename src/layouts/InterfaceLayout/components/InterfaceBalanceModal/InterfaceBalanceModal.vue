<template>
  <div class="modal-container">
    <b-modal
      ref="balance"
      :title="$t('interface.balance')"
      hide-footer
      centered
      class="bootstrap-modal balance nopadding"
    >
      <div class="content-block total-balance">
        <div class="flex-container">
          <h4 class="modal-title">{{ $t('common.totalBalance') }}</h4>
          <div class="margin-left-auto total-balance-amount">
            <span>{{ balance }}</span> ETH
          </div>
        </div>
      </div>

      <div class="content-block">
        <h4 class="equivalent-values-title">
          {{ $t('interface.equivalentValues') }}
        </h4>
        <ul class="equivalent-values">
          <li v-for="ev in equivalentValues" :key="ev.key">
            <img
              :src="
                require(`@/assets/images/currency/${ev.name.toLowerCase()}.svg`)
              "
            />
            <p>{{ ev.name }}</p>
            <p class="ev-value">{{ ev.value }}</p>
          </li>
        </ul>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
export default {
  props: {
    balance: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      equivalentValues: [
        {
          name: 'BTC',
          value: '102.22453'
        },
        {
          name: 'REP',
          value: '5656.22'
        },
        {
          name: 'CHF',
          value: '12410004.22453'
        },
        {
          name: 'USD',
          value: '312004.53'
        },
        {
          name: 'EUR',
          value: '12410.22'
        },
        {
          name: 'GBP',
          value: '687867.53'
        }
      ]
    };
  },
  mounted() {
    this.fetchBalanceData();
  },
  methods: {
    async fetchBalanceData() {
      this.equivalentValues = [];
      // 1027 is coinmarketcap's id for ethereum
      const url = 'https://cryptorates.mewapi.io/convert/1027';
      const fetchValues = await fetch(url);
      const values = await fetchValues.json();
      delete values['lastCalled'];
      for (const key in values) {
        const objectRes = {
          name: key,
          value: new BigNumber(this.balance)
            .multipliedBy(new BigNumber(values[key]))
            .decimalPlaces(18)
            .toFixed()
        };
        this.equivalentValues.push(objectRes);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceBalanceModal.scss';
</style>
