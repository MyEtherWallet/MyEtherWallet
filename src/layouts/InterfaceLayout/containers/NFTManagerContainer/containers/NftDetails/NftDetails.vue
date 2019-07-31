<template>
  <div class="crypto-kitties-details">
    <!--    <interface-container-title title="NFT Manager" />-->
    <div class="crypto-kitties-details-content-container">
      <back-button @click.native="goBack" />
      <div class="grid-container">
        <div class="kitty-image">
          <img :src="nft.image" />
        </div>
        <div class="kitty-text">
          <h3>{{ $t('dapps.sendMy', { value: selectedTitle }) }}</h3>
          <p>#{{ nft.token }}</p>
          <div class="address-input-container">
            <address-selector title="To Address" @toAddress="prepareTransfer" />
            <div class="send-button-container">
              <standard-button
                :button-disabled="!isValidAddress"
                :options="sendButton"
                @click.native="transfer"
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
import ERC721 from '../../abis/ERC721';
import { Misc, Toast } from '@/helpers';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import SmallBackButton from '@/layouts/InterfaceLayout/components/SmallBackButton';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';
import StandardButton from '@/components/Buttons/StandardButton';
import { Transaction } from 'ethereumjs-tx';

// Please remove these images after "NFT Manager" development is done. (@/assets/images/temp)
import kitty1 from '@/assets/images/temp/kitty1.svg';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'back-button': SmallBackButton,
    'address-selector': DropDownAddressSelector,
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
    }
  },
  data() {
    return {
      toAddress: '',
      tokenContract: {},
      kitty: { number: 3362, img: kitty1 },
      sendButton: {
        title: 'Send',
        buttonStyle: 'green',
        helpCenter: true,
        noMinWidth: true,
        fullWidth: true
      }
    };
  },

  computed: {
    ...mapState([
      'account',
      'gasPrice',
      'web3',
      'network',
      'linkQuery',
      'online'
    ]),
    isValidAddress() {
      if (this.toAddress !== '') {
        return Misc.isValidENSorEtherAddress(this.toAddress);
      }
      return false;
    }
  },
  watch: {
    nft(newVal, oldVal) {
      console.log(newVal, oldVal); // todo remove dev item
      // this.tokenContract.options.address =
      //   '0xeA3352C1a3480Ac5a32Fcd1F2854529BA7193F14';
    }
  },
  mounted() {
    this.tokenContract = new this.web3.eth.Contract(ERC721);
  },
  methods: {
    prepareTransfer(toAddress) {
      console.log(toAddress); // todo remove dev item
      this.toAddress = toAddress;
      this.tokenContract.options.address = this.nft.contract;
    },
    transfer() {
      if (this.isValidAddress) {
        const txData = this.tokenContract.methods
          .safeTransferFrom(
            this.account.address,
            this.toAddress,
            this.nft.token
          )
          .encodeABI();
        console.log(txData); // todo remove dev item
        const raw = {
          from: this.account.address,
          to: this.nft.contract,
          data: txData
        };
        this.web3.eth.sendTransaction(raw).catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
        // this.emit('')
        this.toAddress = '';
      }
    },
    goBack() {
      console.log('back'); // todo remove dev item
      this.$emit('back');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NftDetails.scss';
</style>
