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

      <mew-light-table v-if="!isMobile" flat divider full-width>
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
      </mew-light-table>

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
              @click="() => removeToken(token)"
            >
              Remove
            </div>
          </div>
        </div>
      </div>
    </div>
  </mew-overlay>
</template>

<script setup>
import { computed, ref } from 'vue';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { cloneDeep } from 'lodash';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useVuetify } from '@/core/composables/vuetify';
import { useCustomStore } from '@/core/store/custom';

const emit = defineEmits(['removeToken', 'addToken']);

// injections/use
const { network } = useGlobalStore();
const { tokensList } = useWalletStore();
const { customTokens, hiddenTokens, setHiddenToken, deleteHiddenToken } =
  useCustomStore();
const vuetify = useVuetify();

// props
const props = defineProps({
  open: {
    default: false,
    type: Boolean
  },
  close: {
    default: () => {},
    type: Function
  }
});

// data
const selectedToken = ref({});

// computed
const formattedCustomTokens = computed(() => {
  return customTokens.value
    ? customTokens.value.map(item => {
        item.isCustom = true;
        // Check if token is in hiddenTokens
        const isHidden = hiddenTokens.value.find(token => {
          return item.contract == token.address;
        });
        item.isHidden = isHidden !== undefined;
        return formatValues(item);
      })
    : [];
});
const formattedTokens = computed(() => {
  return tokensList.value
    ? tokensList.value.reduce((arr, item) => {
        if (item.contract.toLowerCase() !== MAIN_TOKEN_ADDRESS)
          arr.push(formatValues(item));
        return arr;
      }, [])
    : [];
});
const formattedAllTokens = computed(() => {
  const x = formattedCustomTokens.value.concat(formattedTokens.value);
  return x.map((item, index) => {
    return { id: index, ...item };
  });
});
const title = computed(() => {
  return 'Edit Tokens';
});
const isMobile = computed(() => {
  return vuetify.breakpoint.xs;
});
// methods
/**
 * close overlay
 */
const closeEdit = () => {
  selectedToken.value = ref({});
  props.close();
};
/**
 * @returns formatted values to display correctly on token table
 */
const formatValues = item => {
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
      if (item.isHidden) deleteHiddenToken([tokenClone]);
      else setHiddenToken(tokenClone);
    }
  };
  newObj.balance = [
    item.balancef ? item.balancef + ' ' + item.symbol : '0' + ' ' + item.symbol
  ];
  newObj.token = item.symbol;
  newObj.address = item.contract;
  newObj.tokenImg = item.img ? item.img : network.value.type.icon;
  newObj.callToAction = item.isCustom
    ? [
        {
          title: 'Remove',
          btnStyle: 'transparent',
          colorTheme: 'error',
          method: removeToken
        }
      ]
    : [];
  return newObj;
};
const removeToken = token => {
  emit('removeToken', token);
};
const back = () => {
  closeEdit();
};
const addCustomToken = () => {
  emit('addToken');
};
const explorerAddr = addr => {
  const networkType = network.value.type;
  const explorer = networkType.blockExplorerAddr;
  return explorer.replace('[[address]]', addr);
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
