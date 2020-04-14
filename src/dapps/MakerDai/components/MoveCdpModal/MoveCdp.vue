<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="$t('dappsMCDMaker.move-title')"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      static
      lazy
    >
      <div class="modal-content">
        <p class="top-text">
          {{ $t('dappsMCDMaker.move-notice') }}
        </p>
        <check-box @changeStatus="checkBoxClicked">
          <template v-slot:terms
            ><p class="checkbox-label">
              {{ $t('dappsMCDMaker.understand-and-agree') }}
            </p></template
          >
        </check-box>

        <div class="input-container">
          <label>{{ $t('dappsMCDMaker.move-question') }}</label>
          <div class="input-box">
            <input v-model="address" />
          </div>
        </div>
        <div>
          <div v-if="destAddressHasProxy">
            <p>
              {{
                $t('dappsMCDMaker.proxy-address', { value: destAddressProxy })
              }}
            </p>
            {{ $t('dappsMCDMaker.move-with-proxy') }}
          </div>
          <div v-if="!destAddressHasProxy">
            {{ $t('dappsMCDMaker.move-without-proxy') }}
          </div>
        </div>
        <div class="buttons">
          <standard-button
            :options="{
              title: $t('common.cancel'),
              buttonStyle: 'green-border',
              noMinWidth: true
            }"
            :click-function="closeModal"
          />
          <standard-button
            :options="{
              title: $t('common.submit'),
              buttonStyle: 'green',
              noMinWidth: true,
              fullWidth: true
            }"
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
import { mapState } from 'vuex';
import StandardButton from '@/components/Buttons/StandardButton';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
import CheckBox from '../CheckBox';

import BigNumber from 'bignumber.js/bignumber.js';

import { Misc } from '@/helpers';
export default {
  components: {
    'check-box': CheckBox,
    'help-center-button': HelpCenterButton,
    'standard-button': StandardButton
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function () {
        return [];
      }
    },
    action: {
      type: String,
      default: ''
    },
    values: {
      type: Object,
      default: function () {
        return {
          maxEthDraw: '',
          maxUsdDraw: '',
          ethCollateral: '',
          usdCollateral: '',
          debtValue: '',
          maxDai: '',
          collateralRatio: '',
          cdpId: ''
        };
      }
    },
    destAddressHasProxy: {
      type: Boolean,
      default: false
    },
    destAddressProxy: {
      type: String,
      default: ''
    },
    activeCdpId: {
      type: Number,
      default: 0
    },
    makerActive: {
      type: Boolean,
      default: false
    },
    getValueOrFunction: {
      type: Function,
      default: function () {}
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
      mkrToken: {}
    };
  },
  computed: {
    ...mapState('main', ['account', 'gasPrice', 'web3', 'network', 'ens']),
    btnActive() {
      return Misc.isValidETHAddress(this.address) && this.checkBoxChecked;
    }
  },
  watch: {
    address(newVal) {
      if (Misc.isValidETHAddress(newVal)) {
        this.$emit('checkForProxy', newVal);
      }
    }
  },
  mounted() {
    this.$refs.modal.$on('shown', () => {
      this.cdpId = this.$route.params.cdpId;
      this.isVisible = true;
      this.address = '';
      this.getActiveCdp();
    });

    this.$refs.modal.$on('hidden', () => {
      this.isVisible = false;
    });

    if (this.makerActive) {
      this.getActiveCdp();
    }
  },
  methods: {
    getActiveCdp() {
      if (this.cdpId > 0) {
        this.currentCdp = this.getValueOrFunction('getCdp')(this.cdpId);
        this.currentCdpType = this.currentCdp.cdpCollateralType;
        this.$forceUpdate();
      }
    },
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
      if (this.currentCdp) {
        if (Misc.isValidETHAddress(this.address)) {
          this.currentCdp.moveCdp(this.address);
          this.closeModal();
        }
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
