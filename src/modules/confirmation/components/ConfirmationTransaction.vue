<template>
  <v-sheet max-width="600px" class="pa-3 pa-md-8">
    <transaction-addresses :from="from" :to="to" class="mb-2" />
    <transaction-balance
      :tx-fee="txFee"
      :tx-fee-usd="txFeeUsd"
      :value="value"
    />
    <mew-expand-panel :panel-items="panelItems" :is-toggle="true">
      <template #panelBody1>
        <v-container fluid>
          <v-row v-for="(detail, idx) in details" :key="idx">
            <v-col cols="5">{{ detail.title }} </v-col>
            <v-col cols="7" class="text-right word-break--break-all">
              <scroll-block v-if="detail.expanding">
                {{ detail.value }}
              </scroll-block>
              <div v-else>{{ detail.value }}</div>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </mew-expand-panel>
    <mew-warning-sheet :description="warningDescription" />
  </v-sheet>
</template>

<script>
import ScrollBlock from '@/core/components/AppScrollBlock';
import TransactionAddresses from './TransactionAddresses';
import TransactionBalance from './TransactionBalance';
export default {
  components: {
    ScrollBlock,
    TransactionAddresses,
    TransactionBalance
  },
  props: {
    to: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default:
        '345789263925392632683930562036852345789263925392632683930562036852345789263925392632683930562036852345789263925392632683930562036852345789263925392632683930562036852345789263925392632683930562036852'
    },
    gasPrice: {
      type: String,
      default: ''
    },
    gasLimit: {
      type: String,
      default: ''
    },
    nonce: {
      type: Number,
      default: 0
    },
    network: {
      type: Object,
      default: () => {}
    },
    signTx: {
      type: Function,
      default: () => {}
    },
    txFee: {
      type: String,
      default: '0'
    },
    txFeeUsd: {
      type: String,
      default: '0'
    },
    value: {
      type: String,
      default: '0'
    }
  },
  data: function () {
    return {
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…',
      open: false,
      panelItems: [
        {
          name: 'Details'
        }
      ],
      activeTab: 0
    };
  },
  computed: {
    details() {
      return [
        {
          title: 'Network',
          value: this.network.type.name + ' by ' + this.network.service
        },
        {
          title: 'Gas Price',
          value: this.gasPrice + ' gwei'
        },
        {
          title: 'Gas Limit',
          value: this.gasLimit
        },
        {
          title: 'Nonce',
          value: this.nonce
        },
        {
          title: 'Data',
          value: this.data,
          expanding: true
        }
      ];
    }
  }
};
</script>
