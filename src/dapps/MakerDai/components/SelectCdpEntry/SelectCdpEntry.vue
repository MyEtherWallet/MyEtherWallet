<template>
  <div>
    <div class="container-maker">
      <div class="manage-container">
        <div class="manage-container-blocks">
          <div class="information-single-block">
            <div class="block-item">
              <div class="block-title">
                <div class="select-label">
                  <p>
                    {{ $t('dappsMCDMaker.position-label', { value: cdpId }) }}
                  </p>

                  <p>
                    <span class="standard-button__green-border">
                      <button
                        v-if="hasProxy"
                        class="the-button-box"
                        @click="openManage(cdpId)"
                      >
                        {{ $t('dappsMCDMaker.manage') }}
                      </button>
                      <button
                        v-if="!hasProxy"
                        class="the-button-box"
                        @click="openMigrate(cdpId)"
                      >
                        {{ $t('dappsMCDMaker.view') }}
                      </button>
                    </span>
                  </p>
                </div>
              </div>

              <div class="block-content-container">
                <div class="block-content">
                  <div class="item">
                    <div>
                      <p>{{ $t('dappsMCDMaker.deposited') }}</p>
                    </div>
                    <div>
                      {{ displayFixedValue(aCdp.ethCollateral, 5, false) }}
                      <span>{{ $t('common.currency.eth') }}</span>
                    </div>
                    <div>
                      {{ displayFixedValue(aCdp.pethCollateral, 5, true) }}
                      <span>{{ $t('common.currency.peth') }}</span>
                      {{ displayFixedValue(aCdp.usdCollateral, 2) }}
                      <span>{{ $t('common.currency.usd') }}</span>
                    </div>
                    <div>
                      <br />
                      <div>
                        {{ $t('dappsMCDMaker.liquid-price') }} ({{
                          $t('common.currency.eth')
                        }}/{{ $t('common.currency.usd') }})
                      </div>
                      <span :class="safeRank(aCdp.collatRatio)">{{
                        aCdp ? displayFixedValue(aCdp.liquidationPrice, 2) : 0
                      }}</span>
                      <span class="liq-usd">
                        {{ $t('common.currency.usd') }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="block-content">
                  <div class="item">
                    <div>
                      <p>{{ $t('dappsMCDMaker.generated') }}</p>
                    </div>
                    <div>
                      {{ aCdp.debtValue }}
                      <span>{{ $t('dappsMCDMaker.dai') }}</span>
                    </div>
                    <div>
                      {{ displayFixedValue(aCdp.debtValue, 2) }}
                      <span>{{ $t('common.currency.usd') }}</span>
                    </div>
                    <div>
                      <br />
                      <div>{{ $t('dappsMCDMaker.collateral-ratio') }}</div>
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
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js/bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

export default {
  props: {
    cdpId: {
      type: String,
      default: '0'
    },
    aCdp: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('main', ['account', 'gasPrice', 'web3', 'network', 'ens']),
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
