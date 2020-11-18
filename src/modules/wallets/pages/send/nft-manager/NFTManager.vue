<template>
  <div class="mew-component--nft-manager">
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="NFT Manager">
            <mew-tabs :items="items" is-vertical @onTab="getActive">
              <template
                v-for="(contract, idx) in showContracts"
                :slot="'tabItemContent' + (idx + 1)"
              >
                <div :key="idx">
                  <div class="d-flex justify-space-between mb-5">
                    <h5 class="font-weight-bold">
                      {{ nft.getActiveName() }}
                    </h5>
                    <div>Total {{ nft.getTokenCount() }}</div>
                  </div>
                  <div v-if="tokens.length === 0">Loading</div>
                  <div v-if="tokens.length !== 0">
                    <div
                      v-if="hasPages"
                      class="pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                    >
                      <mew-button
                        :has-full-width="false"
                        btn-style="outline"
                        title="Prior"
                        btn-size="small"
                        @click.native="priorPage"
                      />
                      <mew-button
                        :has-full-width="false"
                        btn-style="outline"
                        title="Next"
                        btn-size="small"
                        :disabled="!hasNextPage"
                        @click.native="nextPage"
                      />
                    </div>

                    <v-card
                      v-for="(kitty, key) in tokens"
                      :key="key"
                      flat
                      color="tableHeader"
                      class="border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                    >
                      <!--                      {{ kitty.image }}-->
                      <div class="d-flex align-center">
                        <img
                          height="100"
                          :src="kitty.image ? kitty.image : imageUrl(kitty)"
                          alt="Crypto Kitty"
                          @error="iconFallback"
                        />
                        <div class="ml-5 pa-10">#{{ kitty.name }}</div>
                      </div>
                      <mew-button
                        :has-full-width="false"
                        btn-style="outline"
                        title="Send"
                        btn-size="large"
                        @click.native="send(kitty)"
                      />
                    </v-card>
                  </div>
                </div>
              </template>
            </mew-tabs>
          </interface-wrap>
        </mew6-white-sheet>
      </div>
      <mew-overlay
        title="Send NFT"
        :show-overlay="open"
        right-btn-text="Close"
        :back="send"
        :close="send"
      >
        <template #mewOverlayBody>
          <img
            height="151"
            :src="selectedNft.image ? selectedNft.image : imageUrl(selectedNft)"
            alt="Crypto Kitty"
            @error="iconFallback"
          />
          <div class="d-flex flex-column align-content-center">
            <div class="ma-5">#{{ selectedNft.name }}</div>
            <mew-address-select
              ref="addressSelect"
              :value="toAddress"
              :copy-tooltip="$t('common.copy')"
              :save-tooltip="$t('common.save')"
              :enable-save-address="true"
              :label="$t('sendTx.to-addr')"
              :items="addresses"
              :placeholder="$t('sendTx.enter-addr')"
              :success-toast="$t('sendTx.success.title')"
              :is-valid-address="isValidAddress()"
              @input="setAddress"
            />
            <mew-expand-panel
              ref="expandPanel"
              is-toggle
              has-dividers
              :panel-items="expandPanel"
            >
              <template #panelBody1>
                <div
                  class="d-flex justify-space-between px-5 border-bottom pb-5"
                >
                  <div class="mew-body font-weight-medium d-flex align-center">
                    {{ $t('sendTx.tx-fee') }}
                    <mew-tooltip class="ml-1" text="" />
                  </div>
                  <div v-show="isEth">
                    <i18n path="sendTx.cost-eth-usd" tag="div">
                      <span slot="eth">{{ txFeeInETH }}</span>
                      <span slot="usd">{{ txFeeInUSD }}</span>
                    </i18n>
                  </div>
                </div>
                <div>
                  <mew-input
                    :value="customGasLimit"
                    :disabled="true"
                    :label="$t('common.gas.limit')"
                    placeholder=""
                    @input="setCustomGasLimit"
                  />
                </div>

                <mew-input
                  v-model="data"
                  :label="$t('sendTx.add-data')"
                  :disabled="true"
                  placeholder=" "
                  class="mt-10 mb-n5"
                />
              </template>
            </mew-expand-panel>
            <mew-button
              :has-full-width="false"
              btn-style="outline"
              title="Confirm & send"
              btn-size="large"
              :disabled="toAddress === ''"
              @click.native="sendTx(selectedNft)"
            />
          </div>
        </template>
      </mew-overlay>
      <div class="pa-4"></div>
      <div></div>
    </div>
  </div>
</template>

<script>
import NFT from '@/modules/nft';
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import { mapState } from 'vuex';
import sanitizeHex from '../../../../../helpers/sanitizeHex';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'interface-wrap': InterfaceWrap
  },
  data() {
    return {
      nft: {},
      ready: false,
      items: [],
      showContracts: [],
      showItems: [],
      tabActive: 1,
      tokens: [],
      open: false,
      selectedNft: {},
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
      expandPanel: [
        {
          name: this.$t('common.advanced'),
          subtext: this.$t('sendTx.data-gas')
        }
      ],
      isEth: true,
      toastType: '',
      toastMsg: '',
      customGasLimit: '',
      toAddress: '',
      // sendTx: null,
      amount: '0',
      selectedCurrency: {},
      data: '0x',
      clearAll: false,
      txFeeInETH: '0',
      txFeeInUSD: '0'
    };
  },
  computed: {
    ...mapState('wallet', [
      'balance',
      'network',
      'gasPrice',
      'web3',
      'address',
      'usd'
    ]),
    ...mapState('global', ['online']),
    hasPages() {
      this.tokens;
      if (this.ready) {
        return this.nft.hasPages();
      }
      return false;
    },
    hasNextPage() {
      this.tokens;
      if (this.ready) {
        return this.nft.hasNextPage();
      }
      return false;
    }
  },
  mounted() {
    this.nft = new NFT({
      network: this.network,
      address: this.address,
      web3: this.web3
    });
    this.nft.init().then(() => {
      this.ready = true;
      const detailsRaw = this.nft.getAvailableContracts();
      this.showContracts = detailsRaw;
      this.items = detailsRaw.map(item => {
        return { name: `${item.name} (${item.count})` };
      });
      this.getActive(0);
    });
  },
  methods: {
    send(selectedNft) {
      if (selectedNft) {
        this.selectedNft = selectedNft;
        this.estimateGas();
      }
      this.open = !this.open;
    },
    sendTx() {
      if (this.toAddress !== '') {
        try {
          // this.nft.send(this.toAddress, this.selectedNft.token_id);
          this.nft.removeSentNft(this.selectedNft.token_id);
          this.updateValues();
          this.open = !this.open;
          this.selectedNft = {};
        } catch (e) {
          // eslint-disable-next-line
                  console.error(e);
        }
      }
    },
    updateValues() {
      this.tokens = this.nft.selectNftsToShow();
      this.items = this.items.map(item => {
        if (
          item.name
            .toLowerCase()
            .includes(this.nft.getActiveName().toLowerCase())
        ) {
          return {
            name: `${this.nft.getActiveName()} (${this.nft.getTokenCount()})`
          };
        }
        return item;
      });
    },
    txFeeETH() {
      return this.nft
        ? this.nft.txFeeETH(this.customGasLimit, this.gasPrice)
        : '--';
    },
    txFeeUSD() {
      if (this.usd.current_price && this.nft) {
        return this.nft.txFeeUSD(
          this.customGasLimit,
          this.usd.current_price,
          this.gasPrice
        );
      }
      return '--';
    },
    estimateGas() {
      try {
        const address = this.toAddress !== '' ? this.toAddress : this.address;
        const details = this.nft.sendData(address, this.selectedNft.token_id);
        const params = {
          from: details.from,
          value: 0,
          to: details.to,
          gasPrice: sanitizeHex(new BigNumber(this.gasPrice).toString(16)),
          data: details.data
        };
        this.data = details.data;
        this.web3.eth.estimateGas(params).then(res => {
          this.customGasLimit = res.toString();
          this.txFeeInETH = this.txFeeETH();
          this.txFeeInUSD = this.txFeeUSD();
        });
      } catch (e) {
        console.log(e);
      }
    },
    setCustomGasLimit() {},
    isValidAddress() {
      return true;
    },
    setAddress(address) {
      this.toAddress = address;
    },
    iconFallback(e) {
      // eslint-disable-next-line
      console.log('err', e);
    },
    nextPage() {
      this.nft.nextPage().then(() => {
        this.tokens = this.nft.selectNftsToShow();
      });
    },
    priorPage() {
      this.nft.priorPage();
      this.tokens = this.nft.selectNftsToShow();
    },
    imageUrl(token) {
      if (this.ready) {
        return this.nft.getImageUrl(token.token_id, token.contract);
      }
    },
    getActive(val) {
      this.tabActive = val;
      if (this.showContracts.length === 0) {
        this.showContracts = this.nft.getAvailableContracts();
      }
      this.tokens = [];
      this.nft
        .setActiveContract(this.nft.getAvailableContracts()[val].contract)
        .then(() => {
          this.nft.getPageValues().then(result => {
            if (result.tokens && Array.isArray(result.tokens)) {
              this.tokens = this.nft.selectNftsToShow();
              this.$nextTick();
            } else {
              this.showItems = [];
            }
          });
        });
    }
  }
};
</script>

<style lang="scss">
.mew-component--nft-manager {
  .v-tabs {
    .v-tabs-items {
      background-color: transparent !important;
    }

    .v-slide-group {
      border-right: 1px solid var(--v-inputBorder-base) !important;
      margin-right: 20px;
      padding-right: 10px;
    }

    .v-tab {
      text-align: left;
      font-weight: 400 !important;
      font-size: 14px !important;
      justify-content: flex-start;
    }

    .v-tab--active {
      font-weight: 600 !important;
      border-left: 4px solid var(--v-primary-base) !important;
    }
  }
}
</style>
