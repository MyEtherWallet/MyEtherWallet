<template>
  <div class="token-selector-interface">
    <div class="border-container" :class="selected ? 'selected' : ''">
      <!-- ============================================================================= -->
      <!-- Token selector interface -->
      <!-- ============================================================================= -->
      <template v-if="!loading">
        <div class="monospace input-block-title textMedium--text">
          {{ title }}
        </div>
        <div class="d-flex align-center">
          <mew-button
            btn-style="transparent"
            color-theme="basic"
            style="padding: 0 10px !important; margin-left: -10px"
          >
            <!-- ========================================= -->
            <!-- Token detail button -->
            <!-- ========================================= -->
            <template v-if="token">
              <mew-token-container size="25px" :img="token.img" />
              <div class="mew-heading-1 ml-3 font-weight-bold textDark--text">
                {{ token.symbol }}
              </div>
              <v-icon color="textDark">mdi-menu-down</v-icon>
            </template>

            <!-- ========================================= -->
            <!-- Just a text button -->
            <!-- ========================================= -->
            <template v-else>
              <div class="mew-heading-1 font-weight-bold textDark--text">
                {{ btnText }}
              </div>
              <v-icon color="textDark">mdi-menu-down</v-icon>
            </template>
          </mew-button>
          <v-spacer />
          <v-text-field
            :value="value"
            class="swap-input"
            :placeholder="placeholder"
            :readonly="readOnly"
            solo
            flat
            hide-details
          />
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="textMedium--text">{{ leftText }}</div>
          <div class="textMedium--text">{{ rightText }}</div>
        </div>
      </template>

      <!-- ============================================================================= -->
      <!-- Skeleton loader for loading -->
      <!-- ============================================================================= -->
      <template v-else>
        <v-skeleton-loader
          class="mt-2 mb-2"
          width="90px"
          height="20px"
          type="image"
        />
        <div class="d-flex align-center">
          <v-skeleton-loader
            width="170px"
            height="40px"
            type="image"
          ></v-skeleton-loader>
          <v-spacer />
          <v-skeleton-loader
            width="120px"
            height="40px"
            type="image"
          ></v-skeleton-loader>
        </div>
        <div class="d-flex align-center justify-space-between mt-3 mb-2">
          <v-skeleton-loader
            width="140px"
            height="20px"
            type="image"
          ></v-skeleton-loader>
          <v-skeleton-loader
            width="100px"
            height="20px"
            type="image"
          ></v-skeleton-loader>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TokenSelectorInterface',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    token: {
      type: Object,
      default: () => {}
    },
    btnText: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.border-container {
  padding: 15px 17px;
  border-radius: 12px;
  border: 2px solid #e3e9ed;
  transition: border 0.15s ease;
  &.selected {
    border: 2px solid var(--v-greenPrimary-base);
  }
}
</style>
