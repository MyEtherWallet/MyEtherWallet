<template>
  <div class="mt-5">
    <div class="mew-heading-3 mb-5">Select a provider</div>
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
              <div class="mew-heading-2 font-weight-medium">
                {{ (Math.round(quote.rate * 100) / 100).toFixed(3) }}
                {{ toTokenSymbol }}
              </div>
              <div class="d-flex align-center">
                <img
                  :class="$vuetify.theme.dark ? 'invert' : ''"
                  :src="quote.exchangeInfo.img"
                  :alt="quote.exchangeInfo.name"
                  height="25"
                />
                <mew-checkbox class="ml-3" :value="active" />
              </div>
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
    }
  }
};
</script>
