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
              <p>{{ mkrBalance }} MKR</p>
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
        <button class="submit-btn" @click="closeCdp">
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
      amount: 0,
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
    },
    mkrBalance() {
      if (this.mkrToken) {
        return this.mkrToken.balance;
      }
      return 0;
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
      this.closeModal();
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CloseCdpModal.scss';
</style>
