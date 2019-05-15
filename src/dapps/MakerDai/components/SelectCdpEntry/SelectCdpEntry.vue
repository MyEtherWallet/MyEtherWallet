<template>
  <div>
    <div class="container-maker">
      <div class="manage-container">
        <div class="manage-container-blocks">
          <div class="information-single-block">
            <div class="block-item">
              <div class="block-title">
                <div class="select-label">
                  <p>{{ $t('dappsMaker.positionLabel', { value: cdpId }) }}</p>

                  <p>
                    <span class="standard-button__green-border">
                      <button
                        v-if="hasProxy"
                        class="the-button-box"
                        @click="openManage(cdpId)"
                      >
                        {{ $t('dappsMaker.manage') }}
                      </button>
                      <button
                        v-if="!hasProxy"
                        class="the-button-box"
                        @click="openMigrate(cdpId)"
                      >
                        {{ $t('dappsMaker.view') }}
                      </button>
                    </span>
                  </p>
                </div>
              </div>

              <div class="block-content-container">
                <div class="block-content">
                  <div class="item">
                    <div>
                      <p>{{ $t('dappsMaker.deposited') }}</p>
                    </div>
                    <div>
                      {{ displayFixedValue(aCdp.ethCollateral, 5, false) }}
                      <span>ETH</span>
                    </div>
                    <div>
                      {{ displayFixedValue(aCdp.pethCollateral, 5, true) }}
                      <span>PETH</span> /
                      {{ displayFixedValue(aCdp.usdCollateral, 2) }}
                      <span>USD</span>
                    </div>
                    <div>
                      <br />
                      <div>{{ $t('dappsMaker.liquidPrice') }} (ETH/USD)</div>
                      <span :class="safeRank(aCdp.collatRatio)">{{
                        aCdp ? displayFixedValue(aCdp.liquidationPrice, 2) : 0
                      }}</span>
                      <span class="liq-usd"> USD</span>
                    </div>
                  </div>
                </div>
                <div class="block-content">
                  <div class="item">
                    <div>
                      <p>{{ $t('dappsMaker.generated') }}</p>
                    </div>
                    <div>{{ aCdp.debtValue }} <span>DAI</span></div>
                    <div>
                      {{ displayFixedValue(aCdp.debtValue, 2) }}
                      <span>USD</span>
                    </div>
                    <div>
                      <br />
                      <div>{{ $t('dappsMaker.collateralRatio') }}</div>
                      <span :class="safeRank(aCdp.collatRatio)">
                        {{
                          aCdp
                            ? displayFixedValue(
                                displayPercentValue(aCdp.collatRatio)
                              )
                            : 0
                        }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js/bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie
  },
  props: {
    cdpId: {
      type: String,
      default: '0'
    },
    aCdp: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice',
      web3: 'web3',
      network: 'network',
      ens: 'ens'
    }),
    hasProxy() {
      if (this.aCdp) {
        return !this.aCdp.noProxy;
      }
      return true;
    }
  },
  async mounted() {},
  methods: {
    openManage() {
      if (this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'manage',
          params: {
            cdpId: this.cdpId
          }
        });
      }
    },
    openMigrate() {
      if (this.$route.path.includes('maker-dai')) {
        this.$router.push({
          name: 'migrate',
          params: {
            cdpId: this.cdpId
          }
        });
      }
    },
    displayPercentValue(raw) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      return raw.times(100).toString();
    },
    displayFixedValue(raw, decimals = 3) {
      if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
      if (raw.isFinite()) {
        return raw.toFixed(decimals).toString();
      }
      return '--';
    },
    safeRank(val) {
      if (toBigNumber(val).gte(2)) {
        return 'green';
      }
      if (toBigNumber(val).lt(1.6)) {
        return 'red';
      }
      return 'orange';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SelectCdpEntry';
</style>
