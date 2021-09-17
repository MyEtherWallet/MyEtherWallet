<template>
  <!--
    =====================================================================================
      Add Custom Token Overlay
    =====================================================================================
    -->
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="open"
    title="Remove Custom Token"
    :close="closeDelete"
    :back="null"
    content-size="large"
  >
    <div class="full-width">
      <mew-popup
        max-width="500px"
        :has-body-content="true"
        :has-padding="true"
        scrollable
        hide-close-btn
        :show="showDeleteConfirmation"
        :title="confirmTitle"
        :left-btn="{
          text: 'Cancel',
          method: toggleDeleteModal,
          color: 'basic'
        }"
        :right-btn="{
          text: 'Remove',
          color: 'primary',
          method: confirmDelete,
          enabled: true
        }"
      >
        <div class="text-center">
          <p class="mew-body textPrimary--text mb-5">
            {{ title }}
          </p>
          <div
            v-for="token in selectedTokens"
            :key="token.address"
            class="d-flex align-center justify-center py-1"
          >
            <div class="d-flex">
              <v-img :src="token.tokenImg" width="20" height="20" contain />
              {{ token.token }}
            </div>
          </div>
        </div>
      </mew-popup>
      <div class="mew-body textPrimary--text text-center mb-5">
        Please select tokens that you want to remove
      </div>
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
          @click.native="toggleDeleteModal"
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
      selectedTokens: [],
      showDeleteConfirmation: false
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
      return `Are you sure you want to delete ${
        this.selectedTokens.length > 1 ? 'these tokens' : 'this token'
      }?`;
    },
    confirmTitle() {
      return `Confirm Remove Token${this.selectedTokens.length > 1 ? 's' : ''}`;
    }
  },
  methods: {
    ...mapActions('custom', ['deleteAll', 'deleteToken']),
    closeDelete() {
      this.selectedTokens = [];
      this.close();
    },
    /**
     * @returns formatted values to display correctly on token table
     */
    formatValues(item) {
      const newObj = {};
      newObj.balance = [item.balancef + ' ' + item.symbol];
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
     * Toggles delete confirmation modal
     */
    toggleDeleteModal() {
      this.showDeleteConfirmation = !this.showDeleteConfirmation;
    },
    /**
     * Depending on the selected count
     * it will call deleteAll or deleteToken
     */
    confirmDelete() {
      if (this.selectedTokens.length === this.customTokens.length) {
        this.deleteAll().then(() => {
          this.toggleDeleteModal();
          Toast('Token Remove succesfully', {}, SUCCESS);
        });
      } else {
        this.deleteToken(this.selectedTokens).then(() => {
          this.toggleDeleteModal();
          Toast('Token Remove succesfully', {}, SUCCESS);
        });
      }
    }
  }
};
</script>
