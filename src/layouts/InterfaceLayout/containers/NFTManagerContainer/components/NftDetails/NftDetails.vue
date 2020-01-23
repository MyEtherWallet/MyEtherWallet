<template>
  <div class="crypto-kitties-details">
    <div class="crypto-kitties-details-content-container">
      <back-button style="display: inline;" @click.native="goBack" />

      <div class="grid-container">
        <div class="product-title-mobile mt-4">
          <h3>{{ $t('nftManager.send-my', { value: selectedTitle }) }}</h3>
          <p>#{{ nft.name }}</p>
        </div>

        <div class="kitty-image">
          <img :src="getImage(nft)" alt />
        </div>
        <div class="kitty-text">
          <div class="product-title-desktop">
            <h3>{{ $t('nftManager.send-my', { value: selectedTitle }) }}</h3>
            <p>#{{ nft.name }}</p>
          </div>
          <div class="address-input-container">
            <dropdown-address-selector
              :title="$t('sendTx.to-addr')"
              @toAddress="prepareTransfer"
            />
            <div class="send-button-container">
              <standard-button
                :button-disabled="!isValidAddress"
                :options="{
                  title: $t('sendTx.send'),
                  buttonStyle: 'green',
                  helpCenter: true,
                  noMinWidth: true,
                  fullWidth: true
                }"
                :click-function="transfer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import SmallBackButton from '@/layouts/InterfaceLayout/components/SmallBackButton';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  components: {
    'back-button': SmallBackButton,
    'dropdown-address-selector': DropDownAddressSelector,
    'standard-button': StandardButton
  },
  props: {
    selectedTitle: {
      type: String,
      default: 'Error'
    },
    nft: {
      type: Object,
      default: function() {
        return {};
      }
    },
    selectedContract: {
      type: String,
      default: 'Error'
    },
    nftConfig: {
      type: Object,
      default: function() {
        return {};
      }
    },
    getImage: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      toAddress: '',
      tokenContract: {},
      ERC721tokenContract: {},
      cryptoKittiesContract: {},
      cryptoKittiesConfig: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      isValidAddress: false
    };
  },
  computed: {
    ...mapState(['account', 'web3'])
  },
  watch: {},
  mounted() {
    this.ERC721tokenContract = new this.web3.eth.Contract([
      {
        constant: false,
        inputs: [
          { name: '_from', type: 'address' },
          { name: '_to', type: 'address' },
          {
            name: '_tokenId',
            type: 'uint256'
          }
        ],
        name: 'transferFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]);
  },
  methods: {
    prepareTransfer(toAddress) {
      this.toAddress = toAddress.address;
      this.isValidAddress = toAddress.valid;
      this.ERC721tokenContract.options.address = this.nft.contract;
    },
    buildData() {
      if (
        this.nft.contract.toLowerCase() ===
        this.cryptoKittiesConfig.toLowerCase()
      ) {
        this.cryptoKittiesContract = new this.web3.eth.Contract([
          {
            constant: false,
            inputs: [
              { name: '_to', type: 'address' },
              { name: '_tokenId', type: 'uint256' }
            ],
            name: 'transfer',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ]);

        return this.cryptoKittiesContract.methods
          .transfer(this.toAddress, this.nft.id)
          .encodeABI();
      }
      return this.ERC721tokenContract.methods
        .transferFrom(this.account.address, this.toAddress, this.nft.id)
        .encodeABI();
    },
    transfer() {
      if (this.isValidAddress) {
        const txData = this.buildData();
        const raw = {
          from: this.account.address,
          to: this.nft.contract,
          data: txData
        };
        this.web3.eth
          .sendTransaction(raw)
          .on('transactionHash', () => {
            this.$emit('nftTransferred', this.nft);
            this.toAddress = '';
          })
          .catch(err => {
            this.$emit('resetNFT', this.nft);
            Toast.responseHandler(err, Toast.ERROR);
          });
      }
    },
    goBack() {
      this.$emit('back');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NftDetails';
</style>
