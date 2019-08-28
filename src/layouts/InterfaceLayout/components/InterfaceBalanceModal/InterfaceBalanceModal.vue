<template>
  <div class="modal-container">
    <b-modal
      ref="balance"
      :title="$t('interface.balance')"
      hide-footer
      centered
      class="bootstrap-modal balance nopadding"
      static
      lazy
    >
      <div class="content-block total-balance">
        <div class="flex-container">
          <h4 class="modal-title">{{ $t('common.totalBalance') }}</h4>
          <div class="margin-left-auto total-balance-amount">
            <span>{{ balance }}</span>
            {{ network.type.currencyName }}
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
import { mapState } from 'vuex';
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
          value: ''
        },
        {
          name: 'REP',
          value: ''
        },
        {
          name: 'CHF',
          value: ''
        },
        {
          name: 'USD',
          value: ''
        },
        {
          name: 'EUR',
          value: ''
        },
        {
          name: 'GBP',
          value: ''
        }
      ]
    };
  },
  computed: {
    ...mapState(['network', 'online'])
  },
  watch: {
    balance() {
      this.fetchBalanceData();
    }
  },
  mounted() {
    this.fetchBalanceData();
  },

  methods: {
    async fetchBalanceData() {
      if (this.online) {
        const newArr = [];
        const url = 'https://cryptorates.mewapi.io/convert/ETH';
        const fetchValues = await fetch(url);
        const values = await fetchValues.json();
        delete values['lastCalled'];
        Object.keys(values).forEach(item => {
          if (
            this.equivalentValues.find(curr => {
              return curr.name === item;
            })
          ) {
            const objectRes = {
              name: item,
              value: new BigNumber(this.balance)
                .multipliedBy(new BigNumber(values[item]))
                .decimalPlaces(18)
                .toFixed()
            };
            newArr.push(objectRes);
          }
        });
        this.equivalentValues = newArr;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceBalanceModal.scss';
</style>
