<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      title="$t('dappsMaker.moveTitle')"
    >
      <div class="modal-content">
        <p class="top-text">
          {{ $t('dappsMaker.moveNotice') }}
        </p>
        <check-box @changeStatus="checkBoxClicked">
          <template v-slot:terms
            ><p class="checkbox-label">
              {{ $t('dappsMaker.understandAndAgree') }}
            </p></template
          >
        </check-box>

        <div class="input-container">
          <label>{{ $t('dappsMaker.moveQuestion') }}</label>
          <div class="input-box">
            <input v-model="address" />
          </div>
        </div>

        <div class="buttons">
          <standard-button :options="cancelButton" @click.native="closeModal" />
          <standard-button
            :options="submitButton"
            :button-disabled="btnActive ? false : true"
            :click-function="moveCdp"
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
import CheckBox from '../CheckBox';

import BigNumber from 'bignumber.js/bignumber.js';

import { Misc } from '@/helpers';

// const toBigNumber = num => {
//   return new BigNumber(num);
// };

export default {
  components: {
    'check-box': CheckBox,
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
      checkBoxChecked: false,
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
      return Misc.isValidETHAddress(this.address) && this.checkBoxChecked;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    closeCdp() {
      this.activeCdp.closeCdp();
    },
    checkBoxClicked() {
      this.checkBoxChecked = !this.checkBoxChecked;
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
