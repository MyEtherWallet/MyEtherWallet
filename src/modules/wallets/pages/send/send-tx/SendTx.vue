<template>
  <v-container class="d-flex">
    <div class="flex-grow-1">
      <mew6-white-sheet>
        <interface-wrap :title="$t('sendTx.send-tx')">
          <div>
            <div class="d-flex justify-end mr-3 entire-bal">
              <mew-button
                :title="$t('sendTx.entire-bal')"
                btn-style="transparent"
                @click.native="sendEntireBal"
              />
            </div>
            <div class="d-flex">
              <mew-select
                :items="tokens"
                :label="$t('sendTx.type')"
                class="mr-3"
              />
              <div class="position--relative flex-grow-1">
                <mew-input
                  :label="$t('sendTx.amount')"
                  placeholder=" "
                  :right-label="fixedBal"
                  :value="amount"
                />
              </div>
            </div>

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
          </div>

          <mew-expand-panel is-toggle has-dividers :panel-items="expandPanel">
            <template v-slot:panelBody1>
              <div>
                <mew-input label="Gas Price" placeholder=" " value="40" />
                <mew-input label="Gas Limit" placeholder=" " value="21000" />
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

          <div class="text-center mt-12">
            <mew-button
              :title="$t('sendTx.send')"
              :has-full-width="false"
              button-size="xlarge"
            />
          </div>
          <div class="text-center mt-4">
            <mew-button
              :title="$t('common.clear-all')"
              :has-full-width="false"
              button-size="small"
              btn-style="transparent"
            />
          </div>
        </interface-wrap>
      </mew6-white-sheet>
    </div>
    <div class="pa-4"></div>
  </v-container>
</template>

<script>
import interfaceWrap from '@/components/interface-wrap/InterfaceWrap';
// import eth from '@/assets/images/currencies/icon-eth-blue.svg';
import divider from '@/components/dividerx/DividerX';
import SendTransaction from './index';
import TokensList from '@/modules/tokens/index';

export default {
  components: {
    divider,
    interfaceWrap
  },
  data() {
    return {
      // will remove this once we get state
      account: {
        balance: '20000000000000000000000'
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
      ],
      tokens: [
        // {
        //   name: 'ETH',
        //   subtext: 'Ethereum',
        //   value: 'Ethereum',
        //   img: eth
        // }
      ]
    };
  },
  mounted() {
    this.sendTx = new SendTransaction(this.account.balance, this.$apollo);
    this.tokensList = new TokensList(this.$apollo);
    this.fixedBal = this.sendTx.getFixedBal();
    this.getOwnersERC20Tokens();
  },
  methods: {
    getSelectedValue(value) {
      this.addressValue = value;
    },
    sendEntireBal() {
      this.amount = this.sendTx.getEntireBal();
    },
    async getOwnersERC20Tokens() {
      this.tokens = await this.tokensList.getOwnersERC20Tokens(
        '0x43689531907482BEE7e650D18411E284A7337A66'
      );
      console.error('tokens', this.tokens);
    }
  }
};
</script>

<style lang="scss">
// change this on mew components
.entire-bal {
  .mew-button {
    padding: 0 !important;
  }
}
</style>
