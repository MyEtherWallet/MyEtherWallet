<template>
  <div>
    <div class="d-block d-lg-none">
      <network mobile class="mb-4" />
      <myEthBalance mobile class="mb-4" />
    </div>

    <div class="d-flex mt-4 mt-lg-0">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Send Transaction">
            <mew-select
              ref="mewSelect"
              :items="tokens"
              :label="$t('sendTx.type')"
              @input="setCurrency"
            />

            <div class="mb-2 text-right">
              <v-btn
                color="primary"
                class="text-transform--initial mb-2"
                x-small
                text
                @click.native="setEntireBal"
              >
                {{ $t('sendTx.button-entire') }}
              </v-btn>
              <mew-input
                ref="mewInput"
                :value="amount"
                :label="$t('sendTx.amount')"
                placeholder=" "
                :right-label="currencyBalance"
                @input="setAmount"
              />
            </div>

            <mew-address-select
              copy-tooltip="Copy"
              save-tooltip="Save"
              :enable-save-address="true"
              label="To Address"
              :items="addresses"
              placeholder="Please enter an address"
              success-toast="Success"
              :is-valid-address="true"
              class="mb-2"
              @emitSelectedValue="getSelectedValue"
            />

            <mew-expand-panel
              ref="expandPanel"
              is-toggle
              has-dividers
              :panel-items="expandPanel"
            >
              <template #panelBody1>
                <div class="font-weight-medium d-flex align-center mb-3">
                  <div>{{ $t('sendTx.tx-fee') }}</div>
                  <mew-tooltip class="ml-1" text="" />
                </div>

                <div v-show="isEth">
                  <i18n path="sendTx.cost-eth-usd" tag="div">
                    <span slot="eth">{{ txFeeETH() }}</span>
                    <span slot="usd">{{ txFeeUSD() }}</span>
                  </i18n>
                </div>

                <mew-input
                  :value="customGasLimit"
                  :label="$t('common.gas.limit')"
                  placeholder=""
                  @input="setCustomGasLimit"
                />

                <mew-input
                  v-model="data"
                  class="mt-4"
                  :label="$t('sendTx.add-data')"
                  placeholder=" "
                />
              </template>
            </mew-expand-panel>

            <div class="d-flex flex-column mt-12">
              <div class="text-center">
                <mew-button
                  :title="$t('sendTx.send')"
                  :has-full-width="false"
                  btn-size="xlarge"
                  @click.native="send()"
                />
              </div>
              <div class="text-center mt-4">
                <mew-button
                  :title="$t('common.clear-all')"
                  :has-full-width="false"
                  btn-size="small"
                  btn-style="transparent"
                  @click.native="clear()"
                />
              </div>
            </div>
          </interface-wrap>
        </mew6-white-sheet>
      </div>

      <div class="pa-4 d-none d-lg-block"></div>

      <div class="d-none d-lg-block">
        <network />
        <div class="pa-4"></div>
        <tx-history title="Transaction history" />
        <div class="pa-4"></div>
        <myEthBalance />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>

    <div class="d-block d-lg-none">
      <tx-history class="mt-4" title="Transaction history" mobile />
      <swap class="mt-4" mobile />
    </div>

    <mew-toast
      ref="toast"
      :text="toastMsg"
      :toast-type="toastType"
      :duration="1000"
    />
  </div>
</template>

<script>
import network from '@/modules/wallets/components/network/Network';
import txHistory from '@/modules/wallets/components/transaction-history/TransactionHistory';
import myEthBalance from '@/modules/wallets/components/my-eth-balance/MyEthBalance';
import swap from '@/modules/wallets/components/swap/Swap';
import interfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import eth from '@/assets/images/currencies/icon-eth-blue.svg';

export default {
  components: {
    txHistory,
    myEthBalance,
    network,
    swap,
    interfaceWrap
  },
  data() {
    return {
      exPannel: [
        {
          name: 'Advanced',
          subtext: 'Gas & Data'
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
      ],
      coins: [
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          img: eth
        }
      ]
    };
  },
  methods: {
    getSelectedValue(value) {
      this.addressValue = value;
    }
  }
};
</script>
