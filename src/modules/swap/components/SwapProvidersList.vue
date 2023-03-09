<template>
  <div class="modules--swap--components--swap-providers-list my-5">
    <!--
    =====================================================================================
      Provider Rate Row
    =====================================================================================
    -->
    <v-dialog v-model="show" max-width="300px">
      <v-sheet class="pa-3">
        <v-item-group v-if="canShow" :value="selectedProviderId">
          <v-row no-gutters>
            <v-col>
              <div
                v-if="providersList.length > 0"
                class="mew-heading-3 mb-5 pl-4"
              >
                Select rate
              </div>
            </v-col>
            <v-col class="text-right">
              <v-icon @click="handleShow">mdi-close</v-icon></v-col
            >
            <v-col
              v-for="(quote, idx) in providersList"
              :key="`quote-${idx}`"
              cols="12"
              class="mb-1"
            >
              <v-item v-slot="{ active, toggle }" :ref="`card${idx}`">
                <v-container
                  :class="[
                    active ? 'rate-active' : '',
                    'd-flex align-center rate py-0 px-1'
                  ]"
                  @click="
                    toggle();
                    setProvider(idx, true);
                  "
                >
                  <v-row no-gutters class="align-center justify-start">
                    <!--
                =====================================================================================
                  Token Image, Rate & Best Rate Chip
                  xs = 10 / total = 10
                  md = 7 / total = 7
                =====================================================================================
                -->
                    <v-col>
                      <v-container class="pa-2">
                        <v-row
                          class="align-center justify-start pl-5 pr-1 py-3 py-sm-4"
                        >
                          <!--
                    =====================================================================================
                      Token Icon
                    =====================================================================================
                    -->
                          <mew-token-container
                            size="small"
                            :img="toTokenIcon"
                          />
                          <!--
                      =====================================================================================
                        Rate
                      =====================================================================================
                      -->
                          <div
                            class="d-block d-sm-flex mx-2 mx-sm-4 align-center justify-start"
                          >
                            <div
                              class="d-flex order-sm-1 justify-start align-center"
                            >
                              <div
                                class="mb-0 mew-heading-3 font-weight-medium"
                              >
                                {{ quote.amount }} {{ toTokenSymbol }}
                              </div>
                              <!-- <mew-tooltip
                              v-if="quote.amount && quote.amount !== ''"
                              class="pl-1"
                              :text="quote.tooltip"
                            /> -->
                            </div>
                          </div>
                        </v-row>
                      </v-container>
                    </v-col>
                    <!--
                =====================================================================================
                  Provider Image & Checkbox
                  xs = 2 / total = 12
                  sm = 5 / total = 12
                =====================================================================================
                -->
                    <v-col cols="2" md="auto">
                      <div
                        v-if="bestRate !== null && bestRate === quote.rate"
                        class="white--text font-weight-bold primary pa-1 pl-3 pr-3 rounded ml-auto text-right"
                      >
                        BEST
                      </div></v-col
                    >
                  </v-row>
                </v-container>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
        <div class="mt-3 textMedium--text">Offer includes a 3% MEW Fee</div>
      </v-sheet>
    </v-dialog>
    <v-row v-if="canShow" no-gutters>
      <v-col> Rate </v-col>
      <v-col md="auto">
        <div class="text-right rate-button" @click="handleShow">
          {{ providerLabel }}
          <v-icon>mdi-chevron-down</v-icon>
        </div>
      </v-col>
    </v-row>

    <!--
    =====================================================================================
      Show More Providers Button
    =====================================================================================
    -->
    <div
      v-if="step >= 1 && providersCut > 0 && toTokenSymbol && !hasProviderError"
      class="cursor--pointer user-select--none greenPrimary--text mt-7 ml-4"
      @click="showMore = !showMore"
    >
      {{ moreProvidersText }}
      <v-icon v-show="!showMore" small color="greenPrimary"
        >mdi-arrow-down</v-icon
      >
      <v-icon v-show="showMore" small color="greenPrimary">mdi-arrow-up</v-icon>
    </div>
    <!--
    =====================================================================================
      Providers Message
    =====================================================================================
    -->
    <app-user-msg-block
      v-if="step > 0 && hasProviderError && !isLoading"
      :message="providersError"
      :is-alert="false"
      container-padding="pa-4 py-6"
    />
  </div>
</template>
<script>
import { isArray } from 'lodash';

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
const MAX_PROVIDERS = 3;
export default {
  name: 'SwapProvidersList',
  components: {
    AppUserMsgBlock: () => import('@/core/components/AppUserMsgBlock')
  },
  props: {
    step: {
      type: Number,
      default: 0
    },
    availableQuotes: {
      type: Array,
      default: () => []
    },
    setProvider: {
      type: Function,
      default: () => {}
    },
    toTokenSymbol: {
      type: String,
      default: ''
    },
    toTokenIcon: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    providersError: {
      type: Object,
      default: () => {
        return { subtitle: '' };
      }
    },
    selectedProviderId: {
      type: Number,
      default: () => undefined
    }
  },
  data() {
    return {
      showMore: false,
      show: false
    };
  },
  computed: {
    canShow() {
      return this.toTokenSymbol && !this.hasProviderError && this.step >= 1;
    },
    /**
     * @Returns Boolean
     * checks whether there's errors
     * with the providers
     */
    hasProviderError() {
      return (
        this.availableQuotes.length === 0 || this.providersError.subtitle !== ''
      );
    },
    /**
     * Property returns best rate in the quotes
     * Or null id quotes not defined.
     * Used in best rate chip
     */
    bestRate() {
      return this.providersList.length > 0 && this.providersList[0].rate
        ? this.providersList[0].rate
        : null;
    },
    /**
     * Property returns quotes to be displayed on the ui
     * If more then 3 quotes found: the list will be sliced by max_providers
     * List Fitlers out null and undefined items
     * Used in Providers Rate Row
     */
    providersList() {
      if (!this.isLoading && this.step > 0) {
        const list =
          !this.showMore && this.providersCut > 0
            ? this.availableQuotes.slice(0, MAX_PROVIDERS)
            : this.availableQuotes;
        const returnedList = list.reduce((arr, item) => {
          if (item) {
            const formatted = formatFloatingPointValue(item.rate * 100);
            const formattedAmt = formatFloatingPointValue(
              item.to_amount || item.amount
            );
            arr.push({
              rate: formatted.value,
              amount: formattedAmt.value,
              tooltip: `${formattedAmt.tooltipText || formattedAmt.value} ${
                this.toTokenSymbol
              }`
            });
          }
          return arr;
        }, []);
        if (returnedList) return returnedList;
      }
      return [];
    },
    providerLabel() {
      const label =
        this.selectedProviderId !== undefined
          ? this.providersList[this.selectedProviderId].amount
          : 'Select Provider';
      const symbol =
        this.selectedProviderId !== undefined ? this.toTokenSymbol : '';
      return `${label} ${symbol}`;
    },
    /**
     * Property returns number of providers that was sliced on the ui
     */
    providersCut() {
      return this.availableQuotes.filter(item => !!item).length - MAX_PROVIDERS;
    },
    /**
     * Property returns a string for show more providers button
     * If showMore - returns "Show Less",
     * If show less - returns "{providers cut} More Providers"
     */
    moreProvidersText() {
      if (this.providersCut > 0) {
        const single = 'More Rate';
        const multiple = 'More Rates';
        if (!this.showMore) {
          return this.providersCut === 1
            ? `${this.providersCut} ${single}`
            : `${this.providersCut} ${multiple}`;
        }
        return 'Show Less';
      }
      return '';
    }
  },
  watch: {
    providersList: {
      handler: function (newVal, oldVal) {
        const hasOldVal = !oldVal || (isArray(oldVal) && oldVal.length === 0);
        if (newVal.length > 0 && hasOldVal && !this.hasProviderError) {
          const bestRate = newVal.findIndex(item => {
            return item.rate === this.bestRate;
          });

          this.$nextTick(() => {
            if (bestRate !== -1) {
              const rateCard = this.$refs[`card${bestRate}`];
              if (!rateCard) return;
              const card = rateCard[0];
              if (!card?.isActive) {
                card.toggle();
              }
              this.setProvider(bestRate, this.step === 1);
            }
          });
        }
      },
      immediate: true
    },
    selectedProviderId: {
      handler: function (id) {
        setTimeout(() => {
          if (id !== undefined) {
            const card = this.$refs[`card${id}`][0];
            if (card?.hasOwnProperty('isActive') && !card?.isActive) {
              card.toggle();
            }
          } else {
            setTimeout(() => {
              const refs = Object.keys(this.$refs);
              const cards = refs.filter(c => c.includes('card'));
              cards.forEach(c => {
                const card = this.$refs[c][0];
                if (card?.isActive) {
                  card.toggle();
                }
              });
            }, 500);
          }
        }, 100);
      }
    }
  },
  methods: {
    handleShow() {
      this.show = !this.show;
    }
  }
};
</script>

<style lang="scss" scoped>
.rate-active {
  border: 1px solid var(--v-greenPrimary-base) !important;
  background-color: var(--v-buttonGrayLight-base) !important;
}
.rate {
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid var(--v-borderInput-base);
}
.rate-button {
  cursor: pointer;
}
</style>
