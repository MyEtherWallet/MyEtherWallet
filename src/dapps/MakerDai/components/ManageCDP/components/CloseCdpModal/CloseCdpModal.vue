<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="'Close CDP'"
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      hide-footer
    >
      <div class="detail-info">
        <div class="info">
          <div class="expended-info expended-info-open">
            <div class="grid-block">
              <p>My MKR balance:</p>
              <p>0.000 MKR</p>
              <p>Get MKR</p>
            </div>
            <div class="grid-block top-board">
              <p>Outstanding DAI generated</p>
              <p>{{ activeCdp.debtValue }} DAI</p>
            </div>
            <div class="grid-block btm-board">
              <p>
                {{
                  $t('dapps.stabilityFeeInMkr', {
                    value: displayFixedValue(
                      displayPercentValue(activeCdp.stabilityFee)
                    )
                  })
                }}
              </p>
              <p>{{ getfeeOwed }} MKR</p>
            </div>
          </div>
        </div>
      </div>

      <div class="buttons-container">
        <button class="cancel-btn">
          Submit
        </button>
        <button class="submit-btn" @click="submitBtn">
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

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'help-center-button': HelpCenterButton
  },
  props: {
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
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      govFee: 0,
      modalDetailInformation: false,
      textValues: {}
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network'
    }),
    getfeeOwed() {
      const result = this.activeCdp.governanceFeeOwed;
      return this.displayFixedValue(result, 8);
    },
    newCollateralRatio() {
      if (this.activeCdp) {
        return this.activeCdp.collatRatio;
      }
      return 0;
    },
    newCollateralRatioSafe() {
      if (this.activeCdp) {
        return toBigNumber(this.activeCdp.collatRatio).gte(2);
      }
      return true;
    },
    newLiquidationPrice() {
      if (this.activeCdp) {
        return this.activeCdp.liquidationPrice;
      }
      return 0;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    submitBtn() {
      switch (this.action) {
        case 'deposit':
          this.lockEth();
          break;
        case 'generate':
          this.drawDai();
          break;
        case 'withdraw':
          this.freeEth();
          break;
        case 'payback':
          this.wipeDai();
          break;
        default:
          return {};
      }
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals, BigNumber.ROUND_DOWN).toString();
    },
    async lockEth() {
      if (toBigNumber(this.amount).gte(0)) {
        return await this.activeCdp.lockEth(this.amount);
      }
    },
    maxDai() {
      this.amount = this.activeCdp.maxDai;
    },
    currentDai() {
      this.amount = this.activeCdp.debtValue;
    },
    async drawDai() {
      if (toBigNumber(this.amount).gte(0)) {
        return await this.activeCdp.drawDai(this.amount);
      }
    },
    async freeEth() {
      if (toBigNumber(this.amount).gte(0)) {
        return await this.activeCdp.freeEth(this.amount);
      }
    },
    async wipeDai() {
      if (toBigNumber(this.amount).gte(0)) {
        return await this.activeCdp.wipeDai(this.amount);
      }
    },

    getTitleText() {
      switch (this.action) {
        case 'deposit':
          return 'Deposit Collateral';
        case 'generate':
          return 'Generate DAI';
        case 'withdraw':
          return 'Withdraw Collateral';
        case 'payback':
          return 'Payback DAI';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CloseCdpModal.scss';
</style>
