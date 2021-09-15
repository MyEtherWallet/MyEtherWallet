<template>
  <div class="modules--swap--components--swap-providers-list my-5">
    <div v-if="step > 0 || isLoading" class="mew-heading-3 mb-5 pl-4">
      Select rate
    </div>
    <!--
    =====================================================================================
      Sceleton Loader (desktop/mobile)
    =====================================================================================
    -->
    <div v-if="isLoading" class="my-5">
      <div class="loading align-center px-5 py-3 rate d-none d-sm-flex">
        <v-container fluid class="d-flex flex-column align-center my-3">
          <img :src="currentPicture" height="30" class="my-4" />
          <div class="titlePrimary--text font-weight-medium py-5">
            Finding best rates...
          </div>
          <v-progress-linear indeterminate color="primary" />
        </v-container>
      </div>

      <div
        class="
          loading
          align-center
          px-5
          py-5
          border-radius--10px
          d-flex d-sm-none
        "
      >
        <div class="titlePrimary--text font-weight-medium mew-body">
          Finding best rates...
        </div>
        <v-spacer />
        <v-skeleton-loader type="avatar" />
      </div>
    </div>

    <!--
    =====================================================================================
      Provider Rate Row
    =====================================================================================
    -->
    <v-item-group v-if="step >= 1 && toTokenSymbol && !hasProviderError">
      <v-row no-gutters>
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
                setProvider(idx);
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
                <v-col cols="10" sm="7">
                  <v-container class="pa-2">
                    <v-row
                      class="align-center justify-start pl-5 pr-1 py-3 py-sm-4"
                    >
                      <!--
                    =====================================================================================
                      Token Icon
                    =====================================================================================
                    -->
                      <mew-token-container size="small" :icon="toTokenIcon" />
                      <!--
                      =====================================================================================
                        Rate
                      =====================================================================================
                      -->
                      <div
                        class="
                          d-block d-sm-flex
                          mx-2 mx-sm-4
                          align-center
                          justify-start
                        "
                      >
                        <div
                          v-if="bestRate !== null && bestRate === quote.rate"
                          class="
                            primary--text
                            font-weight-medium
                            mew-label
                            order-sm-12
                            pl-sm-2
                          "
                        >
                          Best Rate
                        </div>
                        <div
                          class="d-flex order-sm-1 justify-start align-center"
                        >
                          <div class="mb-0 mew-heading-3 font-weight-medium">
                            {{ quote.rate }} {{ toTokenSymbol }}
                          </div>
                          <mew-tooltip
                            v-if="quote.tooltip && quote.tooltip !== ''"
                            class="pl-1"
                            :text="quote.tooltip"
                          />
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
                <v-col cols="2" sm="5">
                  <v-row class="align-center justify-end pr-3">
                    <mew-checkbox :value="active" />
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>

    <!--
    =====================================================================================
      Show More Providers Button
    =====================================================================================
    -->
    <div
      v-if="step >= 1 && providersCut > 0 && toTokenSymbol && !hasProviderError"
      class="cursor--pointer user-select--none primary--text mt-7 ml-4"
      @click="showMore = !showMore"
    >
      {{ moreProvidersText }}
      <v-icon v-show="!showMore" small color="primary">mdi-arrow-down</v-icon>
      <v-icon v-show="showMore" small color="primary">mdi-arrow-up</v-icon>
    </div>
    <!--
    =====================================================================================
      Providers Message
    =====================================================================================
    -->
    <app-user-msg-block
      v-if="step >= 1 && hasProviderError && !isLoading"
      :message="providersError"
      :is-alert="false"
      container-padding="pa-4 py-6"
    />
  </div>
</template>
<script>
import AppUserMsgBlock from '@/core/components/AppUserMsgBlock';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
const MAX_PROVIDERS = 3;
export default {
  name: 'SwapProvidersList',
  components: {
    AppUserMsgBlock
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
    checkLoading: {
      type: Boolean,
      default: true
    },
    providersError: {
      type: Object,
      default: () => {
        return { subtitle: '' };
      }
    }
  },
  data() {
    return {
      showMore: false,
      currentPicture: null,
      partners: [
        { image: require('../assets/0x.png') },
        { image: require('../assets/paraswap.png') },
        { image: require('../assets/1inch.png') },
        { image: require('../assets/Changelly.png') }
      ]
    };
  },
  computed: {
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
     * Property returns quotes to be displaid on the ui
     * If more then 3 quotes found: the list will be sliced by max_providers
     * List Fitlers out null and undefined items
     * Used in Providers Rate Row
     */
    providersList() {
      if (!this.isLoading && this.step > 0) {
        const list =
          !this.showMore && this.providersCut > 0
            ? this.availableQuotes
                .slice(0, MAX_PROVIDERS)
                .filter(item => !!item)
            : this.availableQuotes.filter(item => !!item);
        return list.map(quote => {
          const formatted = formatFloatingPointValue(quote.rate * 100);
          return {
            rate: formatted.value,
            tooltip: `${formatted.tooltipText} ${this.toTokenSymbol}`
          };
        });
      }
      return [];
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
    providersList(newValue, oldVal) {
      if (
        newValue.length > 0 &&
        oldVal.length === 0 &&
        !this.hasProviderError
      ) {
        const bestRate = newValue.findIndex(item => {
          return item.rate === this.bestRate;
        });
        this.$nextTick(() => {
          if (bestRate !== -1) {
            this.$refs[`card${bestRate}`][0].toggle();
            this.setProvider(bestRate);
          }
        });
      }
    },
    isLoading(value) {
      let index = 0;
      const length = this.partners.length;

      if (value) {
        const myLoop = () => {
          setTimeout(() => {
            if (this.checkLoading === false && index >= 4) {
              this.$emit('stopLoadingProviders', false);
            }
            this.currentPicture = this.partners[index]?.image;
            index++;
            if (index <= length) myLoop();
          }, 600);
        };
        myLoop();
      }

      // if (value) {
      //   this.partners.forEach((partner, index) => {
      //     setTimeout(() => {
      //       this.currentPicture = partner.image;
      //       if (index * 600 === 1800) {
      //         setTimeout(() => {
      //           this.$emit('stopLoadingProviders', false);
      //         }, 600);
      //       }
      //     }, index * 600);
      //   });
      // }
    }
  },
  mounted() {
    this.currentPicture = this.partners[0].image;
  }
};
</script>

<style lang="scss">
.modules--swap--components--swap-providers-list {
  .loading {
    .v-skeleton-loader__avatar {
      height: 25px !important;
      width: 25px !important;
    }
    .v-skeleton-loader__heading {
      height: 25px !important;
      width: 100px !important;
      border-radius: 15px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.rate-active {
  border: 1px solid var(--v-primary-base) !important;
  background-color: var(--v-superPrimary-base) !important;
}
.rate {
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid var(--v-selectBorder-base);
}
</style>
