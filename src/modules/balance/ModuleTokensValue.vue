<template>
  <div class="module-tokens-value">
    <mew6-white-sheet class="px-5 px-lg-7 py-5 d-flex justify-space-between">
      <v-row no-gutters>
        <v-col cols="11">
          <div class="mew-heading-2 mb-3">{{ tokenTitle }}</div>
        </v-col>
        <v-col cols="1" @click="toggleDropdown">
          <v-icon style="color: black">{{ chevronIcon }}</v-icon>
        </v-col>
        <v-col v-if="showTokens && dropdown" cols="12" class="mt-3">
          <v-row v-for="(token, idx) in tokens" :key="idx" justify="start">
            <v-col cols="2">
              <mew-token-container
                size="medium"
                :img="token.img"
                class="token-shadow"
              ></mew-token-container>
            </v-col>
            <v-col cols="6" class="mt-2 token-balance"
              >{{ token.balancef }} {{ token.symbol }}</v-col
            >
            <v-col cols="4" align="right" class="token-value mt-2">
              {{ token.usdBalancef }}
            </v-col>
          </v-row>
          <v-row justify="start">
            <v-col cols="9">
              <div v-if="tokensList.length > 5" class="more-tokens">
                {{ getText }}
              </div>
            </v-col>
            <v-col v-if="tokensList.length > 1" cols="3">
              <div class="tokens-link" @click="handleTokensPopup">See all</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </mew6-white-sheet>
    <app-modal
      title="My Tokens"
      :close="handleTokensPopup"
      :show="showPopup"
      :has-buttons="false"
      scrollable
      width="700"
      @close="handleTokensPopup"
    >
      <template #dialogBody>
        <div class="mew-heading-3 mb-3 black--text px-4">
          Total Value: {{ totalTokenValues }}
        </div>
        <module-tokens class="pa-0" dense @trade="handleTokensPopup" />
      </template>
    </app-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'ModuleTokensValue',
  components: {
    AppModal: () => import('@/core/components/AppModal'),
    ModuleTokens: () => import('@/modules/balance/ModuleTokens')
  },
  data: () => ({ showPopup: false, dropdown: true }),
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    ...mapState('wallet', ['initialLoad']),
    ...mapGetters('external', ['totalTokenFiatValue']),
    ...mapGetters('global', ['getFiatValue']),
    tokenTitle() {
      return `My Token${this.tokensList.length > 1 ? 's' : ''}`;
    },
    totalTokenValues() {
      return this.getFiatValue(this.totalTokenFiatValue);
    },
    tokens() {
      const tokens = this.tokensList
        .reduce((arr, token) => {
          if (token) {
            arr.push(token);
          }
          return arr;
        }, [])
        .slice(0, 5);
      return tokens;
    },
    moreTokensCount() {
      return this.tokensList.length - this.tokens.length;
    },
    showTokens() {
      return this.tokensList.length > 0 && !this.initialLoad;
    },
    getText() {
      if (this.showTokens) {
        return `+${this.moreTokensCount} tokens`;
      }
      return '';
    },
    chevronIcon() {
      return this.dropdown ? 'mdi-chevron-up' : 'mdi-chevron-down';
    }
  },
  methods: {
    handleTokensPopup() {
      this.showPopup = !this.showPopup;
    },
    toggleDropdown() {
      this.dropdown = !this.dropdown;
    }
  }
};
</script>
<style lang="scss" scoped>
.circled-total {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding-top: 6px !important;
  color: #05c0a5;
  border: 1px dashed #05c0a5;
  text-align: center;
  cursor: pointer;
  font-size: 10px;
}
.circled-total:hover {
  background-color: var(--v-greyLight-base);
}
.token-shadow {
  box-shadow: inset 0px 0px 0px 1px #ffffff;
  filter: drop-shadow(0px 4px 10px rgba(24, 43, 75, 0.1));
  border-radius: 100px;
}
.tokens-link {
  width: 50px;
  height: 24px;

  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.25px;
  cursor: pointer;

  color: #05c0a5;
}
.more-tokens {
  width: 82px;
  height: 24px;

  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.25px;

  color: #081d34;
}
.token-balance {
  width: 84px;
  height: 20px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;

  color: #081d34;
}
.token-value {
  width: 54px;
  height: 20px;

  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;

  color: #081d34;
}
</style>
