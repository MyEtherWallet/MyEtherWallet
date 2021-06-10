<template>
<<<<<<< HEAD
  <div class="modules--swap--components--swap-providers-list my-5">
=======
  <div>
>>>>>>> v6/add-swap-low-balance-note
    <div v-if="step > 0 || isLoading" class="mew-heading-3 mb-5">
      Select a provider
    </div>
    <!--
    =====================================================================================
      Providers Message
    =====================================================================================
    -->
    <app-user-msg-block
      v-if="step == 0 && !isLoading"
      :message="providersMessage"
      :is-alert="false"
    />

    <!--
    =====================================================================================
      Sceleton Loader
    =====================================================================================
    -->
    <div
      v-if="step === 0 && isLoading"
      class="
        loading
        d-flex
        align-center
        px-5
        py-5
        tableHeader
        border-radius--10px
      "
    >
      <div class="d-flex align-center">
        <v-skeleton-loader type="avatar" class="mr-3" />
        <v-skeleton-loader type="heading" />
      </div>
      <v-spacer />
      <div class="textSecondary--text font-weight-medium">
        Finding best rates...
      </div>
      <v-spacer />
      <div class="d-flex align-center">
        <v-skeleton-loader type="heading" class="mr-3" />
        <v-skeleton-loader type="avatar" />
      </div>
    </div>

    <!--
    =====================================================================================
      Provider Rate Row
    =====================================================================================
    -->
    <v-item-group v-if="step >= 1">
      <v-row>
        <v-col
          v-for="(quote, idx) in providersList"
          :key="`quote-${idx}`"
          cols="12"
          class="mb-n3"
        >
          <v-item v-slot="{ active, toggle }" :ref="`card${idx}`">
            <v-card
              :style="
                active ? 'border-color: var(--v-primary-base) !important' : ''
              "
              outlined
              :color="active ? 'selectorBg' : 'selectorBg lighten-1'"
              class="
                d-flex
                align-center
                justify-space-between
                border-radius--10px
                pl-5
                pr-2
                py-1
              "
              @click="
                toggle();
                setProvider(idx);
              "
            >
              <v-row dense class="align-center justify-start pa-2">
                <!--
                =====================================================================================
                  Token Image, Rate & Best Rate Chip
                  xs = 10 / total = 10
                  md = 7 / total = 7
                =====================================================================================
                -->
                <v-col cols="10" sm="7">
                  <v-row class="align-center justify-start">
                    <!--
                    =====================================================================================
                      Exchange Name and Best Rate Chip (Present on XS ONLY)
                    =====================================================================================
                    -->
                    <v-col cols="12" class="d-sm-none pb-2">
                      <v-row class="pl-10 align-center justify-start">
                        <div class="textSecondary--text">
                          {{ quote.exchangeInfo.name }}
                        </div>
                        <div
                          v-if="bestRate !== null && bestRate === quote.rate"
                          class="
                            ml-3
                            px-3
                            rate-chip-xs
                            align-center
                            justify-center
                          "
                        >
                          Best Rate
                        </div>
                      </v-row>
                    </v-col>
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
                    <div class="mew-heading-2 font-weight-medium mx-2 mx-sm-4">
                      {{ (Math.round(quote.rate * 100) / 100).toFixed(3) }}
                      {{ toTokenSymbol }}
                    </div>
                    <!--
                    =====================================================================================
                      Best Rate Chip (hidden on xs)
                    =====================================================================================
                    -->
                    <div
                      v-if="bestRate !== null && bestRate === quote.rate"
                      class="d-none d-sm-block primary--text font-weight-bold"
                    >
                      Best Rate
                    </div>
                  </v-row>
                </v-col>
                <!--
                =====================================================================================
                  Provider Image & Checkbox
                  xs = 2 / total = 12
                  sm = 5 / total = 12
                =====================================================================================
                -->
                <v-col cols="2" sm="5">
                  <v-row class="align-center justify-end">
                    <v-img
                      v-if="false"
                      :class="[
                        $vuetify.theme.dark ? 'invert' : '',
                        'd-none d-sm-block'
                      ]"
                      :src="quote.exchangeInfo.img"
                      :alt="quote.exchangeInfo.name"
                      max-height="25"
                      max-width="150"
                      contain
                    />
                    <mew-checkbox :value="active" />
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
    <!--
    =====================================================================================
      Show More Providers Button
    =====================================================================================
    -->
    <mew-button
      v-if="step >= 1 && providersCut > 0"
      :title="moreProvidersText"
      btn-style="transparent"
      btn-size="small"
      :icon="moreProvidersIcon"
      icon-type="mdi"
      icon-align="right"
      class="mt-5"
      @click.native="showMore = !showMore"
    />
  </div>
</template>
<script>
import AppUserMsgBlock from '@/core/components/AppUserMsgBlock';
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
    }
  },
  data() {
    return {
      showMore: false,
      providersMessage: {
        title: 'Select token and enter amount to see rates.',
        subtitle:
          'MEW finds the best price for you across multiple DEXs and Exchange services.'
      }
    };
  },
  computed: {
    /**
     * Property returns best rate in the quotes
     * Or null id quotes not defined.
     * Used in best rate chip
     */
    bestRate() {
      return this.availableQuotes.length > 0 && this.availableQuotes[0].rate
        ? this.availableQuotes[0].rate
        : null;
    },
    /**
     * Property returns quotes to be displaid on the ui
     * If more then 3 qoutes found: the list will be sliced by max_providers
     * Used in Providers Rate Row
     */
    providersList() {
      return !this.showMore && this.providersCut > 0
        ? this.availableQuotes.slice(0, MAX_PROVIDERS)
        : this.availableQuotes;
    },
    /**
     * Property returns number of providers that was sliced on the ui
     */
    providersCut() {
      return this.availableQuotes.length - MAX_PROVIDERS;
    },
    /**
     * Property returns a string for show more providers button
     * If showMore - returns "Show Less",
     * If show less - returns "{providers cut} More Providers"
     */
    moreProvidersText() {
      if (this.providersCut > 0) {
        const single = 'More Provider';
        const multiple = 'More Providers';
        if (!this.showMore) {
          return this.providersCut === 1
            ? `${this.providersCut} ${single}`
            : `${this.providersCut} ${multiple}`;
        }
        return 'Show Less';
      }
      return '';
    },
    /**
     * Property returns an icon for show more providers button,
     * based on showMore property
     */
    moreProvidersIcon() {
      return this.showMore ? 'mdi-arrow-up' : 'mdi-arrow-down';
    }
  },
  watch: {
    providersList(newValue, oldVal) {
      if (newValue.length > 0 && oldVal.length === 0) {
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
    }
  }
};
</script>

<style lang="scss">
.modules--swap--components--swap-providers-list {
  .loading {
    .v-skeleton-loader__avatar {
      height: 30px !important;
      width: 30px !important;
    }
    .v-skeleton-loader__heading {
      height: 30px !important;
      width: 100px !important;
      border-radius: 15px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.rate-chip-xs {
  border-radius: 10px;
  height: 16px;
  background-color: var(--v-primary-base);
  color: white;
  font-size: 10px;
}
</style>
