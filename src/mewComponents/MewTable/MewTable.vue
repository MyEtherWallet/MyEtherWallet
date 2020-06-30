<template>
  <div>
    <v-data-table
      :class="['mew-table', hasSelect ? 'mew-select-table' : '', hasColor ? 'mew-super-primary-table' : '']"
      :items="tableData"
      :item-key="tableHeaders[0].value"
      :headers="tableHeaders"
      :calculate-widths="true"
      :single-select="true"
      :show-select="hasSelect"
      hide-default-footer
      @item-selected="onSelect"
    > 
      <template v-slot:item.data-table-select="{ select, isSelected }">
        <v-simple-checkbox
          :value="isSelected"
          @input="select($event)"
          color="primary"
          on-icon="mdi-circle-slice-8"
          off-icon="mdi-circle-outline"
          :ripple="false"
        /> 
      </template>
      <template v-slot:item.edit="{ item }">
        <mew-btn
          @click.native="editRow(item)"
          :title="item.edit"
          btn-style="transparent"
        />
      </template>
      <template
        v-slot:item.txHash="{ item }"
      >
        <v-tooltip
          eager
          open-on-hover
          content-class="tooltip-inner"
          color="titlePrimary--text"
          top
        >
          <template v-slot:activator="{ on }">
            <a
              v-on="on"
              :href="'https://etherscan.io/tx/' + item.txHash"
              target="_blank"
              class="font-weight-medium mew-address d-flex"
            >
              <span
                class="d-flex"
              >
                <span>
                  {{ getFirstPart(item.txHash) }}</span>
                <span class="hash-mid-section truncate">{{ getMiddlePart(item.txHash) }}</span>
                <span>{{ getLastPart(item.txHash) }}</span>
              </span>
              <v-icon
                class="arrow-top-right"
                color="primary"
              >mdi-arrow-top-right</v-icon>
            </a>
          </template>
          <span>{{ item.txHash }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.address="{ item }">
        <div class="d-flex align-center">
          <blockie
            class="mr-2"
            :address="item.address"
            width="25px"
            height="25px"
          />
          <v-tooltip
            eager
            open-on-hover
            content-class="tooltip-inner"
            color="titlePrimary--text"
            top
          >
            <template v-slot:activator="{ on }">
              <div
                v-on="on"
                class="font-weight-medium mew-address d-flex"
              >
                <span
                  class="d-flex"
                >
                  <span>
                    {{ getFirstPart(item.address) }}</span>
                  <span class="addr-mid-section truncate">{{ getMiddlePart(item.address) }}</span>
                  <span>{{ getLastPart(item.address) }}</span>
                </span>
                <v-icon 
                  @click="copyToClipboard('mew-table-address')"
                  class="content-copy cursor-pointer ml-1"
                >
                  mdi-content-copy
                </v-icon>
                <a
                  class="address-link"
                  :href="'https://etherscan.io/address/' + item.address"
                  target="_blank"
                >
                  <v-icon
                    class="call-made"
                  >
                    mdi-call-made
                  </v-icon>
                </a>
              </div>
            </template>
            <span id="mew-table-address">{{ item.address }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
    <toast
      ref="toast"
      :duration="2000"
      toast-type="success"
      :text="successToast"
    />
  </div>
</template>

<script>
import CopyToClipboard from '@/helpers/copy.js';
import Blockie from '@/components/Blockie/Blockie.vue';
import Toast from '@/components/Toast/Toast.vue';
import MewButton from '@/components/MewButton/MewButton.vue';

export default {
  components: {
    'blockie': Blockie,
    'toast': Toast,
    'mew-btn': MewButton
  },
  props: {
    /**
     * The table headers.
     */
    tableHeaders: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /**
     * The table data.
     */
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /**
     * Applies select button to each row. 
     */
    hasSelect: {
      type: Boolean,
      default: false
    },
    /**
     * Applies superPrimary color to table.
     */
    hasColor: {
      type: Boolean,
      default: false
    },
    /**
     * Text for toast success.
     */
    successToast: {
      type: String,
      default: ''
    }
  },
  methods: {
    getFirstPart(addr) {
      return addr.slice(0, 7);
    },
    getMiddlePart(addr) {
      const n = addr.length;
      return addr.slice(7, n - 7);
    },
    getLastPart(addr) {
      const n = addr.length;
      return addr.slice(n - 7, n);
    },
    getEllipsis(str) {
      return str.substr(0, 6) + '...' + str.substr(str.length-7, str.length);
    },
    onSelect(item) {
      if (item.value === true) {
        this.$emit('selectedRow', item)
      }
    },
    copyToClipboard(id) {
      CopyToClipboard(id);
      this.$refs.toast.showToast();
    },
    editRow(item) {
      this.$emit('editRow', item);
    }
  }
}
</script>

<style lang="scss">
// mew-table
.mew-table {
  table {
    border: 1px solid var(--v-selectHover-base);
    border-radius: 4px;
    table-layout: fixed;
    .v-data-table-header {
      background-color: var(--v-selectHover-base);
      th {
        border-bottom: none !important;
        font-size: 11px;
        font-weight: bold;
        height: 25px;
        text-transform: uppercase;
        span {
          color: var(--v-searchText-base) !important;
        }
      }
    }
  }

  .v-icon {
    color: inherit;
    font-size: 18px;
  }

  // for table footer
  .v-data-footer {
    border-top: none;
  }

  // selected table
  .v-simple-checkbox {
    i {
      color: var(--v-searchText-base);
    }
  }

  .address-link {
    color: inherit;
  }

  
  &.mew-select-table {
    tbody {
      tr:nth-of-type(odd) {
        background-color: var(--v-swapDisable-base) !important;
      }
      td {
        color: var(--v-searchText-base) !important;
      }
      .v-icon.call-made {
        font-size: 21px;
      }
    }
    .v-data-table__selected {
      background: inherit !important;
      td {
        color: var(--v-basic-base) !important;
      }
    }
  }

  // super primary table
  &.mew-super-primary-table {
    thead {
      tr {
        background-color: var(--v-superPrimary-darken1);
      }
    }
    tbody {
      tr {
        background-color: var(--v-superPrimary-base);
        &:hover {
          background-color: var(--v-primaryOutlineActive-base) !important;
        }
      }
    }
  }
}

// for mobile
.v-data-table__mobile-row__cell {
  width: 100%;

  div, a {
    justify-content: flex-end;
  }
}

.v-data-table-header-mobile {
  tr > th {
    width: 100%;
  }
}

.hash-mid-section {
  max-width: 120px;
}

// to truncate the hash
@media only screen and (max-width: 900px) {
  .hash-mid-section {
    max-width: 80px;   
  }
}

@media only screen and (max-width: 700px) {
  .hash-mid-section {
    max-width: 45px;   
  }
}

// to truncate the address
@media only screen and (max-width: 1100px) {
  .addr-mid-section {
    max-width: 120px;   
  }
}

@media only screen and (max-width: 700px) {
  .addr-mid-section {
    max-width: 20px;   
  }
}
</style>