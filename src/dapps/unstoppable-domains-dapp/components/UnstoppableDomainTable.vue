<template>
  <div>
    <div class="px-4">
      <!-- 
      =============================================================
      Table
      =============================================================
      -->
      <div>
        <div v-for="(d, key) in searchResults" :key="`${key}unavailable`">
          <!-- 
          =============================================================
          Top warning message
          =============================================================
          -->
          <div v-if="!d.available" class="domain-list-items">
            <div class="pa-5 d-flex align-center">
              <v-icon class="mr-2" color="warning darken-2" small>
                mdi-block-helper
              </v-icon>
              <div
                class="warning--text text--darken-2 mew-heading-2 font-weight-regular"
              >
                {{ d.name }} is unavailable
              </div>
            </div>
          </div>
          <!-- 
          =============================================================
          Second row message
          =============================================================
          -->
          <div
            v-if="!d.available"
            class="pt-6 pb-4 px-2 bluePrimary--text font-weight-bold"
          >
            {{ userMsgText }}
          </div>
        </div>
      </div>
      <div class="domain-list-items px-5">
        <div v-for="(d, key) in searchResults" :key="key">
          <div
            v-if="d.available"
            class="table-border-bottom py-6 px-5 d-md-flex align-center justify-space-between"
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
                <div>{{ convertedEthPrice(d.price) }} ETH</div>
                <div class="textLight--text">${{ d.price }} USD</div>
              </div>
              <mew-button
                icon="mdi-cart-outline"
                icon-type="mdi"
                color-theme="secondary"
                btn-style="light"
                :btn-size="$vuetify.breakpoint.mdAndUp ? 'large' : 'small'"
                :title="$vuetify.breakpoint.mdAndUp ? 'Buy domain' : 'Buy'"
                @click.native="buyDomain(d)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

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
    userMsgText: {
      default: 'You might like one of these',
      type: String
    }
  },
  data: () => ({}),
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('unstoppable', [
      'domain',
      'email',
      'domainPrice',
      'resellerId',
      'order'
    ])
  },
  methods: {
    convertedEthPrice(price) {
      return BigNumber(price).gt(0)
        ? BigNumber(price).dividedBy(this.fiatValue).toFixed(4)
        : '0';
    }
  }
};
</script>

<style lang="scss" scoped>
$greyMedium: #d7dae3;

.textLight--text {
  color: #939fb9;
}

.domain-list-items {
  border: 1px solid $greyMedium;
  border-radius: 12px;
}

.hide-list-items {
  border: none;
}

.table-border-bottom {
  border-bottom: 1px solid $greyMedium;
}
</style>
