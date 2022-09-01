<template>
  <div>
    <!-- ===================================================================================== -->
    <!-- Mew Table -->
    <!-- ===================================================================================== -->
    <v-data-table
      v-model="selected"
      :class="[
        'mew-table',
        hasSelect ? 'mew-select-table' : '',
        hasColor ? 'mew-super-primary-table' : ''
      ]"
      :items="indexedItems"
      item-key="id"
      :headers="tableHeaders"
      :show-select="hasSelect"
      :hide-default-footer="indexedItems && indexedItems.length <= 10"
      :items-per-page="10"
      :loader-height="0"
      :loading="loading"
      :no-data-text="noDataText"
      @item-selected="onSelect"
      @toggle-select-all="onSelectAll"
    >
      <!-- ===================================================================================== -->
      <!-- Loading Mew Table -->
      <!-- ===================================================================================== -->
      <template v-if="loading" #loading>
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          class="py-1"
          width="100%"
          min-width="100%"
          type="text"
          elevation="0"
        />
      </template>

      <!-- ===================================================================================== -->
      <!-- Displays checkboxes next to each row -->
      <!-- ===================================================================================== -->

      <template v-if="!loading" #[`item.checkbox`]="{ item }">
        <mew-checkbox
          :label="item.checkbox.label"
          :value="item.checkbox.value"
          @input="item.checkbox.method(item)"
        />
      </template>

      <!-- ===================================================================================== -->
      <!-- Displays the token image and token title -->
      <!-- ===================================================================================== -->
      <template v-if="!loading" #[`item.token`]="{ item }">
        <div class="d-flex align-center">
          <mew-token-container
            size="small"
            :img="item.tokenImg"
            class="mr-2 flex-shrink-0"
          />
          <span class="truncate">{{ item.token }}</span>
        </div>
      </template>

      <!-- ===================================================================================== -->
      <!-- Displays a toggle button -->
      <!-- ===================================================================================== -->
      <template v-if="!loading" #[`item.toggle`]="{ item }">
        <v-switch
          v-if="item.toggle"
          v-model="item.toggle.value"
          :disabled="item.toggle.disabled"
          inset
          :color="item.toggle.color"
          @click="item.toggle.method(item)"
        >
          <template #label>
            <span
              v-if="item.toggle.label"
              :class="
                item.toggle.color +
                '--text font-weight-regular mew-body capitalize'
              "
              >{{ item.toggle.label }}</span
            >
          </template>
        </v-switch>
      </template>

      <!-- ===================================================================================== -->
      <!-- Displays the chart change -->
      <!-- ===================================================================================== -->
      <template v-if="!loading" #[`item.change`]="{ item }">
        <div class="chart-container d-flex align-center">
          <!-- hiding for now because we don't have the data -->
          <!--
            <mew-chart
              v-if="item.changeData"
              :data="item.changeData"
              :color="item.status === '+' ? '#05c0a5' : '#ff445b'"
            />
          -->
          <span
            v-if="item.change !== ''"
            :class="[
              item.status === '+' ? 'primary--text' : 'error--text',
              'd-flex'
            ]"
          >
            {{ item.change + '%' }}
            <v-icon v-if="item.status === '+'" class="primary--text">
              mdi-arrow-up-thick
            </v-icon>
            <v-icon v-if="item.status === '-'" class="error--text">
              mdi-arrow-down-thick
            </v-icon>
          </span>
        </div>
      </template>

      <!-- ===================================================================================== -->
      <!-- Displays the balance in ETH and USD -->
      <!-- ===================================================================================== -->
      <template v-if="!loading" #[`item.balance`]="{ item }">
        <div class="d-flex flex-column py-2">
          <span
            v-for="(bal, idx) in item.balance"
            :key="idx"
            :class="idx === 1 ? 'searchText--text' : ''"
          >
            {{ bal }}
          </span>
        </div>
      </template>

      <!-- ===================================================================================== -->
      <!-- Displays a call to action button -->
      <!-- ===================================================================================== -->
      <template v-if="!loading" #[`item.callToAction`]="{ item }">
        <div class="d-flex flex-row py-3 justify-end">
          <mew-button
            v-for="(button, idx) in item.callToAction"
            :key="idx"
            :class="
              idx !== item.callToAction.length - 1 &&
              item.callToAction.length > 1
                ? 'mr-1'
                : ''
            "
            :title="button.title"
            :disabled="button.disabled"
            btn-size="small"
            :btn-style="button.btnStyle"
            :color-theme="button.colorTheme"
            @click.native="button.method(item)"
          />
        </div>
      </template>

      <!-- ===================================================================================== -->
      <!-- Displays the tx hash -->
      <!-- ===================================================================================== -->
      <template v-if="!loading" #[`item.txHash`]="{ item }">
        <div :class="[!$vuetify.breakpoint.xs ? 'pr-3' : '']">
          <v-tooltip
            eager
            open-on-hover
            content-class="tooltip-inner"
            color="titlePrimary--text"
            top
          >
            <template #[`activator`]="{ on }">
              <a
                :href="'https://www.ethvm.com/tx/' + item.txHash"
                target="_blank"
                class="font-weight-medium mew-address d-flex full-width"
                v-on="on"
              >
                <mew-transform-hash :hash="item.txHash" />
                <v-icon class="arrow-top-right" color="primary">
                  mdi-arrow-top-right
                </v-icon>
              </a>
            </template>
            <span>{{ item.txHash }}</span>
          </v-tooltip>
        </div>
      </template>

      <!-- ===================================================================================== -->
      <!-- Displays the address hash -->
      <!-- ===================================================================================== -->
      <template v-if="!loading" #[`item.address`]="{ item }">
        <div class="d-flex align-center">
          <mew-blockie
            class="mr-2 d-none d-sm-flex"
            :address="item.resolvedAddr ? item.resolvedAddr : item.address"
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
            <template #activator="{ on }">
              <div
                class="address-container font-weight-medium mew-address d-flex"
                v-on="on"
              >
                <span v-if="item.resolvedAddr" class="mew-address truncate">
                  {{ item.address }}
                </span>
                <mew-transform-hash
                  v-if="!item.resolvedAddr"
                  :hash="item.address"
                />
                <mew-copy class="ml-3" :copy-value="item.address" />
                <a
                  v-if="item.coinType == 'eth'"
                  class="address-link"
                  :href="
                    'https://www.ethvm.com/address/' +
                    (item.resolvedAddr ? item.resolvedAddr : item.address)
                  "
                  target="_blank"
                >
                  <v-icon class="call-made"> mdi-call-made </v-icon>
                </a>
                <a
                  v-if="item.coinType == 'btc'"
                  class="address-link"
                  :href="
                    'https://www.blockchain.com/btc/address/' +
                    (item.resolvedAddr ? item.resolvedAddr : item.address)
                  "
                  target="_blank"
                >
                  <v-icon class="call-made"> mdi-call-made </v-icon>
                </a>
              </div>
            </template>
            <span id="mew-table-address">{{ item.address }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import MewTokenContainer from '@/components/MewTokenContainer/MewTokenContainer.vue';
import MewBlockie from '@/components/MewBlockie/MewBlockie.vue';
import MewButton from '@/components/MewButton/MewButton.vue';
import MewTransformHash from '@/components/MewTransformHash/MewTransformHash.vue';
import MewCopy from '@/components/MewCopy/MewCopy.vue';

export default {
  name: 'MewTable',
  components: {
    MewTokenContainer,
    MewBlockie,
    MewButton,
    MewTransformHash,
    MewCopy
  },
  props: {
    /**
     * Selected values passable
     * from parent so values
     * can be preselected
     */
    selectedValues: {
      type: Array,
      default: () => []
    },
    /**
     * Applies skeleton loader
     * note: tableData has to be empty
     * for the prop to work correctly
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * The table headers.
     */
    tableHeaders: {
      type: Array,
      default: () => []
    },
    /**
     * The table data.
     */
    tableData: {
      type: Array,
      default: () => []
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
     * No data text
     */
    noDataText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selected: []
    };
  },
  computed: {
    /**
     * adds id to tableData items
     */
    indexedItems() {
      return this.tableData.map((item, index) => ({
        id: index,
        ...item
      }));
    }
  },
  watch: {
    selectedValues: {
      handler: function (newVal) {
        this.selected = newVal;
      },
      deep: true
    }
  },
  methods: {
    /**
     * emits selectedRow when selecting a checkbox
     */
    onSelectAll(item) {
      this.$emit('selectedAll', item);
    },
    /**
     * emits selectedRow when selecting a checkbox
     */
    onSelect(item) {
      this.$emit('selectedRow', item);
    }
  }
};
</script>

<style lang="scss">
/**
  * Mew Table
  */
.mew-table {
  &.v-data-table {
    background-color: var(--v-mewBg-base);
  }
  table {
    border: 1px solid var(--v-selectHover-base);
    border-radius: 4px;
    table-layout: fixed;
    .v-data-table-header {
      background-color: var(--v-tableHeader-base);
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
    .address-container {
      width: 80%;
    }
  }
  // hiding for now because we are hiding the chart, see line 56
  // .chart-container {
  //   justify-content: flex-end;
  // }

  .mew-checkbox {
    .v-icon {
      font-size: 25px;
    }
  }

  .v-icon {
    color: inherit;
    font-size: 18px;
  }

  /**
  * Table footer
  */
  .v-data-footer {
    border-top: none;
  }

  /**
  * Checkbox (not active)
  */
  .v-simple-checkbox {
    .mdi-checkbox-blank-outline {
      color: var(--v-searchText-base);
    }
  }

  /**
  * Checkbox (active)
  */
  .v-simple-checkbox {
    .mdi-checkbox-marked {
      color: var(--v-primary-base);
    }
  }

  .address-link {
    color: inherit;
  }

  &.mew-select-table {
    .v-data-table__selected {
      background: inherit !important;
      td {
        color: var(--v-basic-base) !important;
      }
    }
  }

  /**
  * Super primary color table
  */
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
  /**
  * Mobile 
  */
  .v-data-table__mobile-row__cell {
    width: 60%;

    div,
    a {
      justify-content: flex-end;
    }
  }

  .v-data-table-header-mobile {
    tr > th {
      width: 100%;
    }
  }
}
</style>
