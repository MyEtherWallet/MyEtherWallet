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
        :table-data="formattedCustomTokens"
        no-data-text="No custom tokens found!"
        @selectedRow="selectedValues"
        @selectedAll="onSelectAll"
      />
      <div v-if="customTokens.length > 0" class="d-flex justify-center mt-6">
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
          title="Remove Tokens"
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
import { SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { mapGetters, mapActions } from 'vuex';
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
          text: 'Token',
          value: 'token',
          sortable: false,
          width: '20%'
        },
        {
          text: 'Contract Address',
          value: 'address',
          sortable: false,
          width: '50%'
        },
        {
          text: 'Balance',
          value: 'balance',
          sortable: false,
          width: '20%'
        }
      ],
      selectedTokens: []
    };
  },
  computed: {
    ...mapGetters('custom', ['customTokens']),
    ...mapGetters('global', ['network']),
    formattedCustomTokens() {
      return this.customTokens
        ? this.customTokens.map(item => {
            return this.formatValues(item);
          })
        : [];
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
    }
  },
  methods: {
    ...mapActions('custom', ['deleteAll', 'deleteToken']),
    /**
     * close overlay
     */
    closeDelete() {
      this.selectedTokens = [];
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
      if (this.selectedTokens.length === this.customTokens.length) {
        this.deleteAll().then(() => {
          this.closeDelete();
          Toast('Token Remove succesfully', {}, SUCCESS);
        });
      } else {
        this.deleteToken(this.selectedTokens).then(() => {
          this.closeDelete();
          Toast('Token Remove succesfully', {}, SUCCESS);
        });
      }
    }
  }
};
</script>
