<template>
  <div class="mew-component--domain-table">
    <div class="px-4">
      <!-- 
      =============================================================
      Table
      =============================================================
      -->
      <div>
        <!-- 
        =============================================================
        Table item
        =============================================================
        -->
        <div v-for="(d, key) in searchResults" :key="key">
          <!-- 
          =============================================================
          Top warning message
          =============================================================
          -->
          <div v-if="!d.available">
            <div
              class="
                pa-5
                table-border-bottom
                warning--text
                text--darken-2
                d-flex
                align-center
              "
            >
              <v-icon class="mr-2" color="warning darken-2" small>
                mdi-block-helper
              </v-icon>
              <div
                class="
                  warning--text
                  text--darken-2
                  mew-heading-2
                  font-weight-regular
                "
              >
                {{ d.name }} is unavailable
              </div>
            </div>
            <!-- 
            =============================================================
            Second row message
            =============================================================
            -->
            <div class="pt-6 pb-4 px-2 bluePrimary--text font-weight-bold">
              {{ userMsgText }}
            </div>
          </div>
          <div
            v-if="d.available"
            class="
              table-border-top
              py-6
              px-5
              d-md-flex
              align-center
              justify-space-between
            "
          >
            <div
              :class="
                $vuetify.breakpoint.mdAndUp
                  ? 'mew-heading-2 font-weight-regular'
                  : 'mew-heading-4 font-weight-medium mb-4'
              "
            >
              {{ d.name }}
            </div>

            <div class="d-flex align-center justify-space-between">
              <div class="text-md-right mr-5">
                <div>{{ d.priceEth }} ETH</div>
                <div class="textLight--text">${{ d.price }} USD</div>
              </div>
              <mew-button
                icon="mdi-cart-outline"
                icon-type="mdi"
                color-theme="secondary"
                btn-style="light"
                :btn-size="$vuetify.breakpoint.mdAndUp ? 'large' : 'small'"
                :title="$vuetify.breakpoint.mdAndUp ? 'Buy domain' : 'Buy'"
                @click.native="buyDomain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DomainTable',
  components: {},
  props: {
    searchResults: {
      type: Array,
      default: () => {}
    },
    buyDomain: {
      type: Function,
      default: () => {}
    },
    userMsgText: { default: 'You might like one of these', type: String }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
// ==================================================================================================
// Replace with mew-components color variables when mew-components is updated.
// ==================================================================================================
$greyMedium: #d7dae3;
$bluePrimary: #4b83e8;

.bluePrimary--text {
  color: $bluePrimary;
}

.textLight--text {
  color: #939fb9;
}
// ==================================================================================================

.mew-component--domain-table {
  border: 1px solid $greyMedium;
  border-radius: 12px;
}

.table-border-bottom {
  border-bottom: 1px solid $greyMedium;
}

.table-border-top {
  border-top: 1px solid $greyMedium;
}
</style>
