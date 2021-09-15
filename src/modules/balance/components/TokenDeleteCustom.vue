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
    title="Delete Custom Token"
    :close="close"
    :back="close"
    content-size="large"
  >
    <div class="full-width">
      <mew-popup
        max-width="400px"
        hide-close-btn
        :show="showDeleteConfirmation"
        :title="confirmTitle"
        :left-btn="{
          text: 'Cancel',
          method: toggleDeleteModal,
          color: 'basic'
        }"
        :right-btn="{
          text: 'Delete',
          color: 'error',
          method: confirmDelete,
          enabled: true
        }"
      ></mew-popup>
      <mew-table
        has-select
        :table-headers="tableHeaders"
        :table-data="formattedCustomTokens"
        no-data-text="No custom tokens found!"
        @selectedRow="selectedValues"
        @selectedAll="onSelectAll"
      />
      <div v-if="customTokens.length > 0" class="d-flex justify-center mt-2">
        <mew-button
          :title="title"
          color-theme="error"
          :has-full-width="false"
          btn-size="medium"
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
          text: 'Address',
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
      return `Delete Token${this.selectedTokens.length > 1 ? 's' : ''}`;
    },
    confirmTitle() {
      return `Confirm Delete Token${this.selectedTokens.length > 1 ? 's' : ''}`;
    }
  },
  methods: {
    ...mapActions('custom', ['deleteAll', 'deleteToken']),
    /**
     * @returns formatted values to display correctly on token table
     */
    formatValues(item) {
      const newObj = {};
      newObj.balance = [item.balancef + ' ' + item.symbol];
      newObj.token = item.symbol;
      newObj.address = item.contract;
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
          Toast('Token deleted succesfully', {}, SUCCESS);
        });
      } else {
        this.deleteToken(this.selectedTokens).then(() => {
          this.toggleDeleteModal();
          Toast('Token deleted succesfully', {}, SUCCESS);
        });
      }
    }
  }
};
</script>
