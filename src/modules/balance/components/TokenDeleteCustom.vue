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
    title="Delete custom token"
    :close="close"
    :back="close"
    content-size="large"
  >
    <div class="full-width">
      <mew-table
        has-select
        :table-headers="tableHeaders"
        :table-data="formattedCustomTokens"
        no-data-text="No custom tokens found!"
        @selectedRow="selectedValues"
      />
    </div>
  </mew-overlay>
</template>

<script>
import { mapGetters } from 'vuex';
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
      ]
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
    }
  },
  methods: {
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
    selectedValues(val) {
      console.log(val);
    }
  }
};
</script>
