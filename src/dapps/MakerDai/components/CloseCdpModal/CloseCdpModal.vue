<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      :title="'Close CDP'"
      centered
      class="bootstrap-modal nopadding"
      hide-footer
    >
      <div class="contents">
        <div v-if="!canClose" class="message-container">
          Not enough MKR to close this CDP
        </div>
        <p class="top-text">
          Closing your CDP requires paying back your outstanding DAI debt, as
          well as the accumulated stability fee. The stability fee can be paid
          in either DAI or MKR.
        </p>
        <div class="value-table-container">
          <div class="value-table mkr-balance">
            <div class="value-block">
              <p><b>My MKR balance</b></p>
              <p>
                <b>{{ mkrBalance }} MKR</b>
              </p>
            </div>
            <p class="get-mkr">Get MKR</p>
          </div>
          <div class="value-table other-values">
            <div class="value-block">
              <p>Outstanding DAI generated</p>
              <p>
                <b>{{ activeCdp.debtValue }} DAI</b>
              </p>
            </div>
            <div class="value-block">
              <p>
                {{
                  $t('dapps.stabilityFeeInMkr', {
                    value: displayFixedValue(
                      displayPercentValue(activeCdp.stabilityFee)
                    )
                  })
                }}
              </p>
              <p>
                <b>{{ getfeeOwed }} MKR</b>
              </p>
            </div>
          </div>
        </div>

        <div class="buttons">
          <standard-button :options="cancelButton" @click.native="closeModal" />
          <standard-button
            :options="closeButton"
            :button-disabled="canClose ? false : true"
            :click-function="closeCdp"
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

const toBigNumber = num => {
  return new BigNumber(num);
};

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
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      govFee: 0,
      closable: false,
      modalDetailInformation: false,
      textValues: {},
      mkrToken: {},
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        fullWidth: true,
        noMinWidth: true
      },
      closeButton: {
        title: 'Close',
        buttonStyle: 'green',
        fullWidth: true,
        noMinWidth: true
      }
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
    },
    canClose() {
      return this.closable;
    }
  },
  watch: {},
  async mounted() {
    this.mkrToken = this.tokensWithBalance.find(item => {
      return (
        item.symbol === 'MKR' ||
        item.address.toLowerCase() ===
          '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD'.toLowerCase()
      );
    });
    this.$refs.modal.$on('shown', async () => {
      if (this.activeCdp) {
        this.closable = await this.activeCdp.canCloseCdp();
        return this.closable;
      }
      this.closable = false;
    });
    // eslint-disable-next-line
  },
  methods: {
    async closeCdp() {
      this.delayCloseModal();
      await this.activeCdp.closeCdp();
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.toFixed(decimals, BigNumber.ROUND_DOWN).toString();
    },
    maxDai() {
      this.amount = this.activeCdp.maxDai;
    },
    currentDai() {
      this.amount = this.activeCdp.debtValue;
    },
    closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal() {
      setTimeout(() => {
        this.closeModal();
      }, 200);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CloseCdpModal';
</style>
