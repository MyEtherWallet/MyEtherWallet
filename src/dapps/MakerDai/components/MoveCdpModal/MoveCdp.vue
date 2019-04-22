<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      title="Move CDP"
    >
      <div class="modal-content">
        <p class="top-text">
          You may only move your CDP to an Ethereum address that you own. By
          clicking the box below, you(“You”)affirmatively represent that you
          alone own and control (i) the CDP that you will transfer, and (ii) the
          public Ethereum address to which it will be transferred.
        </p>

        <div class="input-container">
          <label>Enter the address to send the cdp?</label>
          <div class="input-box">
            <input v-model="address" />
          </div>
        </div>

        <div class="buttons">
          <standard-button :options="cancelButton" @click.native="closeModal" />
          <standard-button
            :options="submitButton"
            :button-disabled="btnActive ? false : true"
            @click.native="moveCdp"
          />
        </div>
        <help-center-button />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StandardButton from '@/components/Buttons/StandardButton';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import BigNumber from 'bignumber.js/bignumber.js';

import { Misc } from '@/helpers';

// const toBigNumber = num => {
//   return new BigNumber(num);
// };

export default {
  components: {
    'help-center-button': HelpCenterButton,
    'standard-button': StandardButton
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    action: {
      type: String,
      default: ''
    },
    activeCdp: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      address: '',
      amountEth: 0,
      amountDai: 0,
      govFee: 0,
      modalDetailInformation: false,
      textValues: {},
      mkrToken: {},
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true
      },
      submitButton: {
        title: 'Submit',
        buttonStyle: 'green',
        noMinWidth: true,
        fullWidth: true
      }
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network'
    }),
    btnActive() {
      return this.address !== '';
    }
  },
  watch: {},
  mounted() {
    this.mkrToken = this.tokensWithBalance.find(item => {
      return (
        item.symbol === 'MKR' ||
        item.address.toLowerCase() ===
          '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD'.toLowerCase()
      );
    });
    // eslint-disable-next-line
  },
  methods: {
    closeCdp() {
      this.activeCdp.closeCdp();
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals, BigNumber.ROUND_DOWN).toString();
    },
    async moveCdp() {
      if (Misc.isValidETHAddress(this.address)) {
        this.activeCdp.moveCdp(this.address);
        this.closeModal();
      }
    },
    closeModal() {
      this.$refs.modal.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MoveCdp';
</style>
