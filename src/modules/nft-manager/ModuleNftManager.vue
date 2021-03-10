<template>
  <div>
    <mew-module
      class="d-flex flex-grow-1 pt-6"
      :has-elevation="true"
      :has-indicator="true"
      title="NFT Manager"
    >
      <template #moduleBody>
        <mew-tabs
          v-if="contracts.length !== 0"
          :items="tabs"
          is-vertical
          @onTab="onTab"
        >
          <template
            v-for="(contract, idx) in contracts"
            :slot="'tabItemContent' + (idx + 1)"
          >
            <div :key="idx">
              <div class="d-flex justify-space-between mb-5">
                <h5 class="font-weight-bold">
                  {{ nft.getActiveName() }}
                </h5>
                <div>Showing {{ startIndex }} to {{ endIndex }}</div>
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
                    :disabled="!hasPriorPage && !contentLoading"
                    @click.native="priorPage"
                  />
                  <mew-button
                    :has-full-width="false"
                    btn-style="outline"
                    title="Next"
                    btn-size="small"
                    :disabled="!hasNextPage && !contentLoading"
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
                  <div class="d-flex align-center">
                    <img
                      height="100"
                      :src="kitty.image ? kitty.image : imageUrl(kitty)"
                      alt="Crypto Kitty"
                    />
                    <div class="ml-5 pa-10">{{ kitty.name }}</div>
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
      </template>
    </mew-module>
    <mew-toast
      ref="toast"
      :text="toastMsg"
      :toast-type="toastType"
      :duration="3000"
    />
  </div>
</template>

<script>
import NFT from './handlers/handlerNftManager';
import { mapGetters, mapState } from 'vuex';
import sanitizeHex from '@/core/helpers/sanitizeHex';
import BigNumber from 'bignumber.js';
import { Toast, SUCCESS } from '@/modules/toast/handler/handlerToast';
import getService from '@/core/helpers/getService';

export default {
  components: {},
  data() {
    return {
      nft: {},
      ready: false,
      tabs: [],
      contracts: [],
      showItems: [],
      tabActive: 1,
      tokens: [],
      open: false,
      selectedNft: {},
      addresses: [],
      isEth: true,
      toastType: '',
      toastMsg: '',
      customGasLimit: '',
      toAddress: '',
      amount: '0',
      selectedCurrency: {},
      data: '0x',
      clearAll: false,
      txFeeInETH: '0',
      txFeeInUSD: '0',
      currentPage: 1,
      countPerPage: 9,
      contentLoading: false
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['online']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['network', 'gasPrice']),
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
    },
    hasPriorPage() {
      this.tokens;
      if (this.ready) {
        return this.nft.hasPriorPage();
      }
      return false;
    },
    validValues() {
      return !(
        this.isValidAddress() &&
        this.activeAddress !== '' &&
        this.customGasLimit !== ''
      );
    },
    activeAddress() {
      return this.address;
    },
    startIndex() {
      return 1 + (this.currentPage * this.countPerPage - this.countPerPage);
    },
    endIndex() {
      const endIdx = this.currentPage * this.countPerPage;
      if (this.tokens.length < this.countPerPage) {
        return (
          this.currentPage * this.countPerPage -
          (this.countPerPage - this.tokens.length)
        );
      }
      return this.tokens.length < endIdx ? endIdx : this.tokens.length;
    }
  },
  mounted() {
    this.nft = new NFT({
      network: this.network,
      address: this.activeAddress,
      web3: this.web3,
      apollo: this.$apollo
    });
    console.error("nft", this.nft)
    this.addresses = [
      {
        address: this.address,
        currency: 'ETH',
        nickname: 'My Address'
      }
    ];
    this.nft.init().then(() => {
      this.ready = true;
      const detailsRaw = this.nft.getAvailableContracts();
      this.contracts = detailsRaw;
      console.error('contracts', this.contracts)
      this.tabs = detailsRaw.map(item => {
        return { name: `${item.name} (${item.count})` };
      });
      console.error('items', this.tabs)
      this.onTab(0);
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
      if (this.validValues) {
        try {
          this.nft
            .send(this.toAddress, this.selectedNft.token_id)
            .then(response => {
              this.updateValues();
              Toast(
                'Cheers! Your transaction was mined. Check it in ',
                {
                  title: `${getService(this.network.type.blockExplorerTX)}`,
                  url: this.network.type.blockExplorerTX.replace(
                    '[[txHash]]',
                    response.blockHash
                  )
                },
                SUCCESS,
                5000
              );
            });
          this.updateValues();
          this.open = !this.open;
          this.selectedNft = {};
        } catch (e) {
          this.toastType = 'warning';
          this.toastMsg = e.message;
          this.$refs.toast.showToast();
        }
      }
    },
    updateValues() {
      this.tokens = this.nft.selectNftsToShow();
      this.tabs = this.tabs.map(item => {
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
      if (this.ETHUSDValue.value && this.nft) {
        return this.nft.txFeeUSD(
          this.customGasLimit,
          this.ETHUSDValue.value,
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
        this.web3.eth
          .estimateGas(params)
          .then(res => {
            this.customGasLimit = res.toString();
            this.txFeeInETH = this.txFeeETH();
            this.txFeeInUSD = this.txFeeUSD();
          })
          .catch(err => {
            this.customGasLimit = '';
            this.toastType = 'warning';
            this.toastMsg = err.message;
            this.$refs.toast.showToast();
          });
      } catch (e) {
        this.customGasLimit = '';
        this.toastType = 'warning';
        this.toastMsg = e.message;
        this.$refs.toast.showToast();
      }
    },
    isValidAddress() {
      if (this.nft.ready) {
        return this.nft.isValidAddress(this.toAddress);
      }
      return false;
    },
    setAddress(address) {
      if (typeof address === 'object' && !!address) {
        this.toAddress = address.address;
      } else {
        this.toAddress = address;
      }
    },
    nextPage() {
      try {
        if (this.contentLoading) return;
        this.contentLoading = true;
        this.nft
          .nextPage()
          .then(() => {
            this.tokens = this.nft.selectNftsToShow();
            this.currentPage = this.nft.getCurrentPage();
            this.countPerPage = this.nft.getCountPerPage();
            this.contentLoading = false;
          })
          .catch(() => {
            this.contentLoading = false;
          });
      } catch (e) {
        this.contentLoading = false;
      }
    },
    priorPage() {
      this.nft.priorPage();
      this.tokens = this.nft.selectNftsToShow();
      this.currentPage = this.nft.getCurrentPage();
      this.countPerPage = this.nft.getCountPerPage();
    },
    imageUrl(token) {
      if (this.ready) {
        return this.nft.getImageUrl(token.token_id, token.contract);
      }
    },
    onTab(val) {
      this.tabActive = val;
      if (this.contracts.length === 0) {
        this.contracts = this.nft.getAvailableContracts();
      }
      this.contentLoading = true;
      this.tokens = [];
      this.nft
        .setActiveContract(this.nft.getAvailableContracts()[val].contract)
        .then(() => {
          this.nft.getPageValues().then(result => {
            if (result.tokens && Array.isArray(result.tokens)) {
              this.tokens = this.nft.selectNftsToShow();
              this.currentPage = this.nft.getCurrentPage();
              this.countPerPage = this.nft.getCountPerPage();
              this.contentLoading = false;
              this.$nextTick();
            } else {
              this.showItems = [];
            }
          });
        })
        .catch(e => {
          this.toastType = 'warning';
          this.toastMsg = e.message;
          this.$refs.toast.showToast();
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
  .full-wide {
    min-width: 75%;
  }
}
</style>
