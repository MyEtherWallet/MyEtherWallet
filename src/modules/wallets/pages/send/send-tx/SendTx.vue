<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :title="$t('sendTx.send-tx')"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template v-slot:moduleBody>
      <div class="full-width px-15 pt-3">
        <div class="d-flex justify-end mr-3 entire-bal">
          <mew-button
            :title="$t('sendTx.entire-bal')"
            btn-style="transparent"
            @click.native="sendEntireBal"
          />
        </div>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="6">
              <mew-select
                :items="ownersTokens"
                :label="$t('sendTx.type')"
                class="mr-3"
              />
            </v-col>
            <v-col cols="6">
              <mew-input
                :label="$t('sendTx.amount')"
                placeholder=" "
                :right-label="fixedBal"
                :value="amount"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <address-select
                :copy-tooltip="$t('common.copy')"
                :save-tooltip="$t('common.save')"
                :enable-save-address="true"
                :label="$t('sendTx.to-addr')"
                :items="addresses"
                :placeholder="$t('sendTx.enter-addr')"
                :success-toast="$t('sendTx.success.title')"
                :is-valid-address="true"
                @emitSelectedValue="getSelectedValue"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container>
        <mew-expand-panel
          is-toggle
          has-dividers
          :panel-items="expandPanel"
          class="px-15"
        >
          <template v-slot:panelBody1>
            <div>
              <mew-input
                :label="$t('common.gas.price')"
                placeholder=" "
                value="40"
              />
              <mew-input
                :label="$t('common.gas.limit')"
                placeholder=" "
                value="21000"
              />
            </div>

            <div class="d-flex justify-space-between px-5">
              <div class="mew-body font-weight-medium d-flex align-center">
                {{ $t('sendTx.tx-fee') }}
                <info-tooltip class="ml-1" text="Tx fees" />
              </div>
              <div>$0.177</div>
            </div>
            <divider dot class="mt-5" />
            <mew-input
              :label="$t('sendTx.add-data')"
              placeholder=" "
              value
              class="mt-10 mb-n5"
            />
          </template>
        </mew-expand-panel>
      </v-container>

      <div class="d-flex flex-column mt-12">
        <div class="text-center">
          <mew-button
            :title="$t('sendTx.send')"
            :has-full-width="false"
            btn-size="xlarge"
          />
        </div>
        <div class="text-center mt-4">
          <mew-button
            :title="$t('common.clear-all')"
            :has-full-width="false"
            btn-size="small"
            btn-style="transparent"
          />
        </div>
      </div>
    </template>
  </mew-module>
</template>

<script>
// import eth from '@/assets/images/currencies/icon-eth-blue.svg';
import divider from '@/components/dividerx/DividerX';
import SendTransaction from './index';

export default {
  components: {
    divider
  },
  props: {
    ownersTokens: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // will remove this once we get state
      account: {
        balance: '20000000000000000000000',
        address: '0x43689531907482BEE7e650D18411E284A7337A66'
      },
      sendTx: null,
      amount: '0',
      fixedBal: '0',
      expandPanel: [
        {
          name: this.$t('common.advanced'),
          subtext: this.$t('sendTx.gas-data')
        }
      ],
      addressValue: '',
      addresses: [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'My Address',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          address: '0x43689531907482BEE7e650D18411E284A7337A66',
          currency: 'ETH',
          nickname: 'nickname',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ]
    };
  },
  mounted() {
    this.sendTx = new SendTransaction(this.account.balance, this.$apollo);
    this.fixedBal = this.sendTx.getFixedBal();
  },
  methods: {
    getSelectedValue(value) {
      this.addressValue = value;
    },
    sendEntireBal() {
      this.amount = this.sendTx.entireBal();
    },
    displayedGasPrice(val) {
      const newVal = val.toString();
      return newVal.toString().includes('.')
        ? `~ ${new BigNumber(newVal).toFixed(2).toString()}`
        : newVal;
    },
  }
};
</script>

<style lang="scss">
.entire-bal {
  .mew-button {
    margin-bottom: -12px;
  }
}
</style>
