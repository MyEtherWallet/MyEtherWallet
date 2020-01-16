<template>
  <div class="mobile-info-block">
    <div class="info-block-title text-uppercase font-reset mb-1">
      {{ $t('common.balance.wallet') }}
    </div>

    <div class="info-block-value text-monospace pl-3">
      {{ accountBalance
      }}<span class="font-reset">{{ network.type.currencyName }}</span>
    </div>

    <div class="pl-3">
      <div class="equivalent-values-title font-reset">
        <i class="fa fa-angle-right" aria-hidden="true"></i>
        {{ $t('interface.check-balance.equivalent') }}
      </div>
      <ul class="equivalent-values-data pl-3">
        <li
          v-for="ev in equivalentValues"
          :key="ev.key"
          class="d-flex align-items-center"
        >
          <img
            :src="
              require(`@/assets/images/currency/${ev.name.toLowerCase()}.svg`)
            "
            alt
            class="mr-2"
          />
          <div class="mr-2 text-monospace">{{ ev.name }}</div>
          <div class="text-monospace">{{ ev.value }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import BigNumber from 'bignumber.js';

export default {
  components: {},
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
    ...mapState(['network', 'web3', 'account', 'online']),
    accountBalance() {
      return this.web3.utils.fromWei(
        new BigNumber(this.account.balance).toFixed(),
        'ether'
      );
    }
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
    showBalanceModal() {
      this.getBalance();
      this.$refs.balanceModal.$refs.balance.show();
    },
    getBalance() {
      if (this.account.address) {
        this.web3.eth
          .getBalance(this.account.address.toLowerCase())
          .then(res => {
            this.$store.dispatch('setAccountBalance', res);
          })
          .catch(err => {
            Toast.responseHandler(err, Toast.ERROR);
          });
      }
    },
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
              value: new BigNumber(this.accountBalance)
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
@import 'MobileBalanceBlock.scss';
</style>
