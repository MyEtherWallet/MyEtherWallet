<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Move CDP"
    >
      <div class="inputs-container">
        <div class="input-container">
          <label>How much ETH would you like to deposit?</label>
          <div class="input-box">
            <input v-model="address" />
          </div>
        </div>
      </div>
      <div class="buttons-container">
        <button class="cancel-btn">
          Cancel
        </button>
        <button
          :class="['submit-btn', btnActive ? '' : 'disabled']"
          @click="moveCdp"
        >
          Submit
        </button>
      </div>
      <help-center-button />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import BigNumber from 'bignumber.js';

import { Misc } from '@/helpers';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'help-center-button': HelpCenterButton
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
      mkrToken: {}
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
    console.log(this.tokensWithBalance); // todo remove dev item
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
        await this.activeCdp.moveCdp(this.address);
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
@import 'MoveCdp.scss';
</style>
