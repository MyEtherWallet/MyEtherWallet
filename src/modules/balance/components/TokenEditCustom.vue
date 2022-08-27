<template>
  <!--
    =====================================================================================
      Edit Tokens Overlay
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
    :close="closeEdit"
    :back="showBack ? back : null"
    :content-size="step === 1 ? 'xlarge' : 'medium'"
  >
    <div v-if="step === 1" class="full-width">
      <!--
    =====================================================================================
      Step One: Table of tokens to edit
    =====================================================================================
    -->
      <div class="text-right pb-1">
        <span
          class="greenPrimary--text cursor-pointer pr-3"
          @click="addCustomToken"
          >+ Add Token</span
        >
      </div>
      <mew-table
        :table-headers="tableHeaders"
        :table-data="formattedAllTokens"
        no-data-text="No tokens found!"
      />
    </div>
    <!--
    =====================================================================================
      Step Two: Confirm Remove
    =====================================================================================
    -->
    <div v-if="showRemove" class="full-width">
      <div class="d-flex align-center justify-center py-1">
        <div class="d-flex align-center justify-center">
          <v-img
            class="mr-2"
            :src="selectedToken.tokenImg"
            width="20"
            height="20"
            contain
          />
          {{ selectedToken.token }}
        </div>
      </div>
      <div class="mt-9">
        <mew-button
          title="Remove Token"
          color-theme="error"
          :has-full-width="true"
          btn-size="xlarge"
          class="mb-4"
          @click.native="confirmDelete"
        />
        <mew-button
          title="Keep Token"
          color-theme="textDark"
          :has-full-width="true"
          btn-size="xlarge"
          btn-style="outline"
          @click.native="back"
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
          text: 'Show',
          value: 'toggle',
          sortable: false,
          filterable: false,
          width: '15%'
        },
        {
          text: 'Token',
          value: 'token',
          sortable: false,
          width: '20%'
        },
        {
          text: 'Contract Address',
          value: 'address',
          sortable: false,
          width: '40%'
        },
        {
          text: 'Balance',
          value: 'balance',
          sortable: false,
          width: '20%'
        },
        {
          text: 'Remove',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          width: '15%'
        }
      ],
      selectedToken: {}
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
            item.isCustom = true;
            // Check if token is in hiddenTokens
            const isHidden = this.hiddenTokens.find(token => {
              return item.contract == token.address;
            });
            item.isHidden = isHidden !== undefined;
            return this.formatValues(item);
          })
        : [];
    },
    formattedTokens() {
      return this.tokensList
        ? this.tokensList.reduce((arr, item) => {
            if (item.contract.toLowerCase() !== MAIN_TOKEN_ADDRESS)
              arr.push(this.formatValues(item));
            return arr;
          }, [])
        : [];
    },
    formattedAllTokens() {
      const x = this.formattedCustomTokens.concat(this.formattedTokens);
      return x.map((item, index) => {
        return { id: index, ...item };
      });
    },
    title() {
      return this.step === 1
        ? `Edit Tokens`
        : `Are you sure you want to remove ${this.selectedToken.token} token?`;
    },
    showRemove() {
      return this.step === 2;
    },
    showBack() {
      return this.step !== 1;
    }
  },
  methods: {
    ...mapActions('custom', [
      'deleteToken',
      'setHiddenToken',
      'deleteHiddenToken'
    ]),
    /**
     * close overlay
     */
    closeEdit() {
      this.selectedToken = {};
      this.step = 1;
      this.close();
    },
    /**
     * @returns formatted values to display correctly on token table
     */
    formatValues(item) {
      const newObj = {};
      newObj.toggle = {
        color: 'primary',
        value: !item.isHidden,
        method: token => {
          if (item.isHidden) this.deleteHiddenToken([token]);
          else this.setHiddenToken(token);
        }
      };
      newObj.balance = [
        item.balancef
          ? item.balancef + ' ' + item.symbol
          : '0' + ' ' + item.symbol
      ];
      newObj.token = item.symbol;
      newObj.address = item.contract;
      newObj.tokenImg = item.img ? item.img : this.network.type.icon;
      newObj.callToAction = item.isCustom
        ? [
            {
              title: 'Remove',
              btnStyle: 'transparent',
              colorTheme: 'error',
              method: token => {
                this.selectedToken = token;
                this.next();
              }
            }
          ]
        : [];
      return newObj;
    },
    /**
     * Takes user to the confirm step
     */
    next() {
      this.step = 2;
    },
    back() {
      this.selectedToken = {};
      this.step = 1;
    },
    /**
     * Delete custom token
     */
    confirmDelete() {
      const tokenSymbol = this.selectedToken.token;
      this.deleteToken([this.selectedToken]).then(() => {
        this.closeEdit();
        Toast(`${tokenSymbol} Token removed succesfully`, {}, SUCCESS);
      });
    },
    addCustomToken() {
      this.closeEdit();
      this.$emit('addToken');
    }
  }
};
</script>
