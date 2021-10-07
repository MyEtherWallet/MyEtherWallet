<template>
  <div>
    <mew6-white-sheet class="px-5 px-lg-7 py-5 d-flex justify-space-between">
      <v-row no-gutters>
        <v-col cols="12">
          <div class="mew-heading-2 mb-3">{{ tokenTitle }}</div>
        </v-col>
        <v-col cols="12">
          <div v-if="!initialLoad" class="mew-heading-3">
            ${{ totalTokenValues }}
          </div>
          <v-skeleton-loader
            v-else
            v-bind="attrs"
            type="image"
            height="100px"
          ></v-skeleton-loader>
        </v-col>
        <v-col v-if="showTokens" cols="12" class="mt-3">
          <v-row justify="start">
            <v-col v-for="(img, idx) in tokenImages" :key="idx + img" cols="2">
              <img :src="img" height="32px" />
            </v-col>
            <v-col cols="2">
              <div class="circled-total" @click="handleTokensPopup">
                {{ getText }}
              </div>
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
        <div class="mew-heading-3 mb-3 black--text">
          Total Value: ${{ totalTokenValues }}
        </div>
        <module-tokens class="pa-0" dense @trade="handleTokensPopup" />
      </template>
    </app-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import AppModal from '@/core/components/AppModal';
import ModuleTokens from '@/modules/balance/ModuleTokens';
export default {
  name: 'ModuleTokensValue',
  components: {
    AppModal,
    ModuleTokens
  },
  data: () => ({ showPopup: false }),
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    ...mapState('wallet', ['initialLoad']),

    ...mapGetters('external', ['totalTokenFiatValue']),
    tokenTitle() {
      return `My Token${this.tokensList.length > 1 ? 's' : ''} Value`;
    },
    totalTokenValues() {
      return formatFiatValue(this.totalTokenFiatValue).value;
    },
    tokenImages() {
      return this.tokensList
        .filter(token => token.img)
        .slice(0, 5)
        .map(item => {
          return item.img;
        });
    },
    moreTokensCount() {
      return this.tokensList.length - this.tokenImages.length;
    },
    showTokens() {
      return this.tokensList.length > 0 && !this.initialLoad;
    },
    getText() {
      if (this.showTokens) {
        return this.moreTokensCount > 0 && this.moreTokensCount < 1000
          ? `+${this.moreTokensCount}`
          : 'more';
      }
      return '';
    }
  },
  methods: {
    handleTokensPopup() {
      this.showPopup = !this.showPopup;
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
  background-color: var(--v-superPrimaryHover-base);
}
</style>
