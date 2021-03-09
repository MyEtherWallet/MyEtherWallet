<template>
  <div class="mt-5">
    <div class="mew-heading-3 mb-5">Select a provider</div>
    <!--
    =====================================================================================
      Sceleton Loader
    =====================================================================================
    -->
    <v-row v-if="step == 0">
      <v-col v-for="btn in 4" :key="btn" cols="12" class="mb-n3">
        <v-card
          flat
          color="selectorBg lighten-1"
          class="d-flex align-center px-5 py-5"
        >
          <v-skeleton-loader width="300px" type="chip" />
          <v-spacer />
          <div class="d-flex align-center">
            <v-skeleton-loader width="170px" type="chip" class="mr-5" />
            <v-skeleton-loader width="32px" type="chip" />
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!--
    =====================================================================================
      Provider Rate Row
    =====================================================================================
    -->
    <v-item-group v-show="step >= 1" mandatory>
      <v-row>
        <v-col
          v-for="(quote, idx) in availableQuotes"
          :key="`quote-${idx}`"
          cols="12"
          class="mb-n3"
        >
          <v-item v-slot="{ active, toggle }">
            <v-card
              :style="
                active ? 'border-color: var(--v-primary-base) !important' : ''
              "
              outlined
              :color="active ? 'selectorBg' : 'selectorBg lighten-1'"
              class="d-flex align-center justify-space-between border-radius--10px pl-5 pr-2 py-1"
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
                          class="ml-3 px-3 rate-chip-xs align-center justify-center"
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
                    <v-chip
                      v-if="bestRate !== null && bestRate === quote.rate"
                      pill
                      color="primary"
                      class="d-none d-sm-block py-1 px-5"
                    >
                      Best Rate
                    </v-chip>
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
  </div>
</template>
<script>
export default {
  name: 'SwapProvidersList',
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
    }
  },
  computed: {
    bestRate() {
      return this.availableQuotes.length > 0 && this.availableQuotes[0].rate
        ? this.availableQuotes[0].rate
        : null;
    }
  }
};
</script>
<style lang="scss" scoped>
.rate-chip-xs {
  border-radius: 10px;
  height: 16px;
  background-color: var(--v-primary-base);
  color: white;
  font-size: 10px;
}
</style>
