<template>
  <div class="modal-container">
    <b-modal
      ref="balance"
      :title="$t('interface.balance')"
      hide-footer
      centered
      class="bootstrap-modal balance nopadding">
      <div class="content-block total-balance">
        <div class="flex-container">
          <h4 class="modal-title">{{ $t('common.totalBalance') }}</h4>
          <div class="margin-left-auto total-balance-amount">
            <span>{{ balance }}</span> ETH
          </div>
        </div>
      </div>

      <div class="content-block">
        <h4 class="equivalent-values-title">{{ $t('interface.equivalentValues') }}</h4>
        <ul class="equivalent-values">
          <li
            v-for="ev in equivalentValues"
            :key="ev.key">
            <img :src="ev.image">
            <p>{{ ev.name }}</p>
            <p class="ev-value">{{ ev.value }}</p>
          </li>
        </ul>
      </div>
    </b-modal>
  </div>
</template>

<script>
import iconBtc from '@/assets/images/currency/btc.svg';
import iconRep from '@/assets/images/currency/rep.svg';
import iconEur from '@/assets/images/currency/eur.svg';
import iconChf from '@/assets/images/currency/chf.svg';
import iconGbp from '@/assets/images/currency/gbp.svg';
import iconUsd from '@/assets/images/currency/usd.svg';

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
          image: iconBtc,
          name: 'BTC',
          value: '102.22453'
        },
        {
          image: iconRep,
          name: 'REP',
          value: '5656.22'
        },
        {
          image: iconChf,
          name: 'CHF',
          value: '12410004.22453'
        },
        {
          image: iconUsd,
          name: 'USD',
          value: '312004.53'
        },
        {
          image: iconEur,
          name: 'EUR',
          value: '12410.22'
        },
        {
          image: iconGbp,
          name: 'GBP',
          value: '687867.53'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceBalanceModal.scss';
</style>
