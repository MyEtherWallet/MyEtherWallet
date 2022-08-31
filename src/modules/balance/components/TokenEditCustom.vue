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
        <mew-button
          title="+ Add Token"
          color-theme="basic"
          btn-style="light"
          btn-size="medium"
          @click.native="addCustomToken"
        />
      </div>
      <mew-table
        :table-headers="tableHeaders"
        :table-data="formattedAllTokens"
        no-data-text="No tokens found!"
      />
    </div>
  </mew-overlay>
</template>

<script>
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
// import { SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { mapActions, mapGetters, mapState } from 'vuex';
import { cloneDeep } from 'lodash';

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
    showBack() {
      return this.step !== 1;
    }
  },
  methods: {
    ...mapActions('custom', ['setHiddenToken']),
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
          const tokenClone = cloneDeep(token);
          delete tokenClone['callToAction'];
          delete tokenClone['toggle'];
          delete tokenClone['id'];
          delete tokenClone['balance'];
          if (item.isHidden) this.deleteHiddenToken([tokenClone]);
          else this.setHiddenToken(tokenClone);
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
                this.$emit('removeToken', token);
              }
            }
          ]
        : [];
      return newObj;
    },
    back() {
      this.selectedToken = {};
      this.step = 1;
    },
    addCustomToken() {
      this.$emit('addToken');
    }
  }
};
</script>
