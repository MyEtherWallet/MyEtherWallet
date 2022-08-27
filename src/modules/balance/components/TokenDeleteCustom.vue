<template>
  <!--
    =====================================================================================
      Delete Custom Token Overlay
    =====================================================================================
    -->
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="open"
    :title="title"
    :close="closeDelete"
    :back="null"
    :content-size="step === 1 ? 'large' : 'medium'"
  >
    <div v-if="step === 1" class="full-width">
      <!--
    =====================================================================================
      Step One: Select tokens to delete
    =====================================================================================
    -->
      <mew-table
        has-select
        :table-headers="tableHeaders"
        :table-data="formattedAllTokens"
        :selected-values="displaySelectedTokens"
        no-data-text="No tokens found!"
        @selectedRow="selectedValues"
        @selectedAll="onSelectAll"
      />
      <div
        v-if="formattedAllTokens.length > 0"
        class="d-flex justify-center mt-6"
      >
        <mew-button
          title="Next"
          color-theme="primary"
          :has-full-width="true"
          btn-size="xlarge"
          :disabled="!enableDeleteButton"
          @click.native="next"
        />
      </div>
    </div>
    <!--
    =====================================================================================
      Step Two: Confirm
    =====================================================================================
    -->
    <div v-if="step === 2" class="full-width">
      <div
        v-for="token in selectedTokens"
        :key="token.address"
        class="d-flex align-center justify-center py-1"
      >
        <div class="d-flex align-center justify-center">
          <v-img
            class="mr-2"
            :src="token.tokenImg"
            width="20"
            height="20"
            contain
          />
          {{ token.token }}
        </div>
      </div>
      <div class="mt-9">
        <mew-button
          title="Hide Tokens"
          color-theme="error"
          :has-full-width="true"
          btn-size="xlarge"
          class="mb-4"
          @click.native="confirmDelete"
        />
        <mew-button
          title="Keep Tokens"
          color-theme="textDark"
          :has-full-width="true"
          btn-size="xlarge"
          btn-style="outline"
          @click.native="closeDelete"
        />
      </div>
    </div>
  </mew-overlay>
</template>

<script>
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { mapGetters, mapActions, mapState } from 'vuex';
export default {
  props: {
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    }
  },
  data() {
    return {
      step: 1,
      tableHeaders: [
        {
          text: 'Contract Address',
          value: 'address',
          sortable: false,
          width: '50%'
        },
        {
          text: 'Token',
          value: 'token',
          sortable: false,
          width: '20%'
        },
        {
          text: 'Balance',
          value: 'balance',
          sortable: false,
          width: '20%'
        }
      ],
      selectedTokens: [],
      preselected: false
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    ...mapState('wallet', ['loadingWalletInfo']),
    ...mapGetters('custom', ['customTokens', 'hiddenTokens']),
    ...mapGetters('global', ['network']),
    formattedCustomTokens() {
      return this.customTokens
        ? this.customTokens.map(item => {
            return this.formatValues(item);
          })
        : [];
    },
    formattedHiddenTokens() {
      return this.hiddenTokens
        ? this.hiddenTokens.map(item => {
            return item;
          })
        : [];
    },
    formattedTokens() {
      // Check for duplicate keys (token Symbols)
      return this.tokensList
        ? this.tokensList
            .map(item => {
              return this.formatValues(item);
            })
            .filter(t => {
              // Check if token is in hiddenTokens
              const isHidden = this.hiddenTokens.find(token => {
                return t.address == token.address;
              });
              return !isHidden && t.address !== MAIN_TOKEN_ADDRESS;
            })
        : [];
    },
    formattedAllTokens() {
      const x = this.formattedCustomTokens
        .concat(this.formattedTokens)
        .concat(this.formattedHiddenTokens);
      return x.map((item, index) => {
        return { id: index, ...item };
      });
    },
    enableDeleteButton() {
      return this.selectedTokens.length > 0;
    },
    title() {
      return this.step === 1
        ? `Select the ${
            this.selectedTokens.length > 1 ? 'tokens' : 'token'
          } you want to remove`
        : `Are you sure you want to remove ${
            this.selectedTokens.length > 1 ? 'these tokens' : 'this token'
          }?`;
    },
    displaySelectedTokens() {
      return this.selectedTokens;
    },
    loading() {
      return this.loadingWalletInfo;
    },
    preselectedTokens() {
      const tokens = [];
      for (const token of this.formattedHiddenTokens) {
        const newObj = this.formattedAllTokens.filter(item => {
          return item.address === token.address;
        })[0];
        tokens.push(newObj);
      }
      return tokens;
    }
  },
  watch: {
    loading(val) {
      if (!val && !this.preselected) {
        this.selectedTokens = this.preselectedTokens;
        this.preselected = true;
      }
    },
    open(val) {
      if (val && !this.preselected && !this.loading) {
        this.selectedTokens = this.preselectedTokens;
        this.preselected = true;
      }
    }
  },
  methods: {
    ...mapActions('custom', [
      'deleteAll',
      'deleteToken',
      'setHiddenToken',
      'deleteHiddenToken'
    ]),
    // preselectTokens() {
    //   const preselectedTokens = [];
    //   console.log('formattedAllTokens', this.formattedAllTokens);
    //   console.log('formattedAllTokens length', this.formattedAllTokens.length);
    //   for (const token of this.formattedHiddenTokens) {
    //     const newObj = this.formattedAllTokens.filter(item => {
    //       return item.address === token.address;
    //     })[0];
    //     console.log('newObj', newObj);
    //     preselectedTokens.push(newObj);
    //   }
    //   console.log('selectedTokens', preselectedTokens);
    //   this.selectedTokens = preselectedTokens;
    //   this.preselected = true;
    // },
    /**
     * close overlay
     */
    closeDelete() {
      this.selectedTokens = [];
      this.preselected = false;
      this.step = 1;
      this.close();
    },
    /**
     * @returns formatted values to display correctly on token table
     */
    formatValues(item) {
      const newObj = {};
      newObj.balance = [
        item.balancef
          ? item.balancef + ' ' + item.symbol
          : '0' + ' ' + item.symbol
      ];
      newObj.token = item.symbol;
      newObj.address = item.contract;
      newObj.tokenImg = item.img ? item.img : this.network.type.icon;
      return newObj;
    },
    /**
     * @returns formatted values to display correctly on token table
     */
    // formatHiddenValues(item) {
    //   const newObj = item;
    //   return newObj;
    // },
    /**
     * Selects tokens
     */
    selectedValues(token) {
      if (token.value) {
        this.selectedTokens.push(token.item);
      } else {
        this.selectedTokens = this.selectedTokens.filter(item => {
          if (token.item.address !== item.address) {
            return item;
          }
        });
      }
    },
    /**
     * Handles select all
     */
    onSelectAll(token) {
      if (token.value) {
        this.selectedTokens = token.items;
      } else {
        this.selectedTokens = [];
      }
    },
    /**
     * Takes user to the confirm step
     */
    next() {
      this.step = 2;
    },
    /**
     * Depending on the selected count
     * it will call deleteAll or deleteToken
     */
    confirmDelete() {
      // Add check for type of selected tokens (custom, native, hidden)

      // Delete custom token
      const allCustomSelected =
        this.customTokens.length > 0
          ? this.formattedCustomTokens.every(val => {
              return this.selectedTokens.indexOf(val) !== -1;
            })
          : false;
      if (allCustomSelected) {
        this.deleteAll().then(() => {
          this.closeDelete();
          Toast('Token Hidden succesfully', {}, SUCCESS);
        });
      } else {
        // If token is a custom token delete
        const isCustomToken = this.selectedTokens.every(val => {
          return this.formattedCustomTokens.indexOf(val) !== -1;
        });
        if (isCustomToken) {
          this.deleteToken(this.selectedTokens).then(() => {
            this.closeDelete();
            Toast('Token Hidden succesfully', {}, SUCCESS);
          });
        }
      } // End if token is custom

      this.selectedTokens.map(item => {
        this.setHiddenToken(item).then(() => {
          this.closeDelete();
          Toast('Token Hidden succesfully', {}, SUCCESS);
        });
      });
    }
  }
};
</script>
