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
    :back="back"
    :content-size="'xlarge'"
  >
    <div class="full-width">
      <!--
    =====================================================================================
      Step One: Table of tokens to edit
    =====================================================================================
    -->
      <div class="text-right my-4">
        <mew-button
          title="+ Add Token"
          color-theme="basic"
          btn-style="light"
          btn-size="medium"
          @click.native="addCustomToken"
        />
      </div>

      <the-table v-if="!isMobile" flat divider full-width>
        <table>
          <thead>
            <tr class="text-uppercase">
              <td>Show</td>
              <td>Token</td>
              <td>Balance</td>
              <td>Address</td>
              <td class="text-center">Remove</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(token, tableKey) in formattedAllTokens" :key="tableKey">
              <td>
                <v-checkbox
                  hide-details
                  color="primary"
                  on-icon="mdi-check-circle"
                  off-icon="mdi-checkbox-blank-circle-outline"
                  :input-value="token.checkbox.value"
                  @change="token.checkbox.method(token)"
                ></v-checkbox>
              </td>
              <td>
                <div class="d-flex align-center">
                  <mew-token-container class="mr-2" :img="token.tokenImg" />
                  <div class="font-weight-medium">{{ token.token }}</div>
                </div>
              </td>
              <td>{{ token.balance[0].replace(token.token, '') }}</td>
              <td>
                <div style="max-width: 150px" class="d-flex align-center">
                  <mew-transform-hash :hash="token.address" class="mr-2" />
                  <mew-copy :copy-value="token.address" is-small />
                  <a :href="explorerAddr(token.address)" target="_blank">
                    <v-icon class="basic--text" small> mdi-launch </v-icon>
                  </a>
                </div>
              </td>
              <td class="text-center">
                <mew-button
                  v-if="token.callToAction.length > 0"
                  title="Remove"
                  btn-style="transparent"
                  color-theme="error"
                  btn-size="small"
                  @click.native="token.callToAction[0].method(token)"
                ></mew-button>
              </td>
            </tr>
          </tbody>
        </table>
      </the-table>

      <div v-else class="mt-6">
        <div
          v-for="(token, mobileTableKey) in formattedAllTokens"
          :key="mobileTableKey"
          class="mobile-table py-5"
        >
          <div class="d-flex align-center mb-3">
            <v-checkbox
              hide-details
              color="primary"
              on-icon="mdi-check-circle"
              off-icon="mdi-checkbox-blank-circle-outline"
              :input-value="token.checkbox.value"
              @change="token.checkbox.method(token)"
            ></v-checkbox>
            <mew-token-container class="mr-2" :img="token.tokenImg" />
            <div class="font-weight-medium">{{ token.token }}</div>
            <v-spacer></v-spacer>
            <div>{{ token.balance[0].replace(token.token, '') }}</div>
          </div>
          <div class="d-flex align-center">
            <div style="max-width: 150px" class="d-flex align-center">
              <mew-transform-hash :hash="token.address" class="mr-2" />
              <mew-copy :copy-value="token.address" is-small />
              <a :href="explorerAddr(token.address)" target="_blank">
                <v-icon class="basic--text" small> mdi-launch </v-icon>
              </a>
            </div>
            <v-spacer></v-spacer>
            <div
              v-if="token.callToAction.length > 0"
              class="error--text font-weight-medium cursor--pointer"
              @click="token.calltoAction[0].method(token)"
            >
              Remove
            </div>
          </div>
        </div>
      </div>
    </div>
  </mew-overlay>
</template>

<script>
import TheTable from '@/components/TheTable';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { mapActions, mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import MewTokenContainer from '@/components/MewTokenContainer/MewTokenContainer';

export default {
  components: {
    MewTokenContainer,
    TheTable
  },
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
      selectedToken: {}
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList']),
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
      return 'Edit Tokens';
    },
    isMobile() {
      return this.$vuetify.breakpoint.xs;
    }
  },
  methods: {
    ...mapActions('custom', ['setHiddenToken', 'deleteHiddenToken']),
    /**
     * close overlay
     */
    closeEdit() {
      this.selectedToken = {};
      this.close();
    },
    /**
     * @returns formatted values to display correctly on token table
     */
    formatValues(item) {
      const newObj = {};
      newObj.checkbox = {
        // color: 'primary',
        value: !item.isHidden,
        label: '',
        method: token => {
          const tokenClone = cloneDeep(token);
          delete tokenClone['callToAction'];
          delete tokenClone['checkbox'];
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
      this.closeEdit();
    },
    addCustomToken() {
      this.$emit('addToken');
    },
    explorerAddr(addr) {
      const networkType = this.network.type;
      const EthVMSupported = networkType.isEthVMSupported;
      const explorer = EthVMSupported.supported
        ? EthVMSupported.blockExplorerAddr
        : networkType.blockExplorerAddr;
      return explorer.replace('[[address]]', addr);
    }
  }
};
</script>

<style lang="scss" scoped>
.mobile-table {
  border-bottom: 1px solid #e0e5f2;
}
.v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
}
</style>
