<template>
  <div>
    <!-- ==================================================================== -->
    <!-- Desktop table -->
    <!-- ==================================================================== -->
    <div
      v-if="!isMobile"
      class="mt-4 mb-4 core-components--app-table alteranting-background border-bottom"
      :style="containerStyle"
    >
      <div v-if="title" class="font-weight-bold mt-6 ml-5 mb-10">
        {{ title }}
      </div>
      <table v-if="!loading">
        <thead>
          <tr>
            <td v-for="(header, dataKey) in tableHeaders" :key="dataKey">
              {{ header.toUpperCase() }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(td, dataKey) in tableData" :key="dataKey">
            <td v-if="td.token">
              <div class="d-flex align-center mew-label">
                <mew-token-container
                  v-if="td.tokenImg"
                  :img="td.tokenImg"
                  size="20px"
                  class="mr-2"
                />
                {{ td.token }}
              </div>
            </td>
            <td class="mew-label">
              {{ td.price }}
              <span v-if="td.price" class="textLight--text">/ token</span>
            </td>
            <td class="mew-label">{{ td.cap }}</td>
            <td>
              <div v-if="td.change">
                <div v-if="td.status == '+'" class="d-flex align-center">
                  <div class="mew-label greenPrimary--text">
                    {{ td.change }}%
                  </div>
                  <v-icon small color="greenPrimary">
                    mdi-arrow-up-thick
                  </v-icon>
                </div>
                <div v-else class="d-flex align-center">
                  <div class="mew-label redPrimary--text">{{ td.change }}%</div>
                  <v-icon small color="redPrimary">
                    mdi-arrow-down-thick
                  </v-icon>
                </div>
              </div>
            </td>
            <td>
              <div class="mew-label mb-n1">{{ td.balance[0] }}</div>
              <div style="font-size: 10px">
                {{ td.balance[1] }}
              </div>
            </td>
            <td>
              <template v-if="td.callToAction">
                <!-- ===================================================================================== -->
                <!-- Displays a call to action button -->
                <!-- ===================================================================================== -->
                <div class="d-flex flex-row py-3 justify-end">
                  <mew-button
                    v-for="(button, idx) in td.callToAction"
                    :key="idx"
                    :class="
                      idx !== td.callToAction.length - 1 &&
                      td.callToAction.length > 1
                        ? 'mr-1'
                        : ''
                    "
                    :title="button.title"
                    :disabled="button.disabled"
                    btn-size="small"
                    btn-style="outline"
                    color-theme="greenPrimary"
                    @click.native="button.method(td)"
                  />
                </div>
                <!-- <v-btn
                  v-for="(button, idx) in td.callToAction"
                  :key="idx"
                  depressed
                  outlined
                  color="greenPrimary"
                  class="mew-button small-btn btn-outline"
                  @click="button.method(td)"
                >
                  <div class="d-flex justify-center align-center">
                    {{ button.title }}
                  </div>
                </v-btn> -->
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- ==================================================================== -->
      <!-- Loading state -->
      <!-- ==================================================================== -->
      <div v-if="loading" class="skeleton-loader-container">
        <div v-for="n in Number(loaderCount)" :key="n">
          <v-skeleton-loader width="100%" type="heading" />
        </div>
      </div>
    </div>

    <!-- ==================================================================== -->
    <!-- Mobile table -->
    <!-- ==================================================================== -->
    <div
      v-for="(td, dataKey) in tableDataPaginated"
      v-else
      :key="dataKey"
      class="mx-4 mt-2 core-components--app-table border-around padding-around round-corner mobile-background"
      :style="containerStyle"
    >
      <div v-if="title" class="font-weight-bold mt-6 ml-5 mb-10">
        {{ title }}
      </div>
      <div
        v-for="(header, data) in tableHeaders"
        :key="data"
        class="d-flex align-center justify-space-between mb-1"
      >
        <div class="mew-label font-weight-bold">
          {{ header }}
        </div>
        <div
          v-if="header.toUpperCase() === 'TOKEN'"
          class="mew-label d-flex align-center"
        >
          <mew-token-container :img="td.tokenImg" size="17px" class="mr-2" />
          {{ td.token }}
        </div>
        <div v-else-if="header.toUpperCase() === 'PRICE'" class="mew-label">
          {{ td.price }}
        </div>
        <div
          v-else-if="header.toUpperCase() === 'MARKET CAP'"
          class="mew-label"
        >
          {{ td.cap }}
        </div>
        <div v-else-if="header.toUpperCase() === '24H'" class="mew-label">
          <div class="d-flex align-center">
            <div class="mew-label">
              {{ td.change ? `${td.change}%` : '' }}
            </div>
            <v-icon v-if="td.status == '+'" small color="greenPrimary">
              mdi-arrow-up-thick
            </v-icon>
            <v-icon
              v-else-if="td.change !== '' && td.status === '-'"
              small
              color="redPrimary"
            >
              mdi-arrow-down-thick
            </v-icon>
          </div>
        </div>
        <div
          v-else-if="header.toUpperCase() === 'BALANCE'"
          class="mew-label d-flex align-center"
        >
          {{ td.balance[0] }} {{ td.balance[1] }}
        </div>
      </div>

      <div class="text-right mt-3">
        <template v-if="td.callToAction">
          <v-btn
            v-for="(button, idx) in td.callToAction"
            :key="idx"
            outlined
            color="greenPrimary"
            small
            depressed
            @click="button.method(td)"
          >
            <div class="greenPrimary--text mew-label text-transform--none">
              {{ button.title }}
            </div>
          </v-btn>
        </template>
      </div>
      <!-- ==================================================================== -->
      <!-- Loading state -->
      <!-- ==================================================================== -->
      <div v-if="loading" class="skeleton-loader-container">
        <div v-for="n in Number(loaderCount)" :key="n">
          <v-skeleton-loader width="100%" type="heading" />
        </div>
      </div>
    </div>
    <!-- ==================================================================== -->
    <!-- Pagination for both desktop and mobile -->
    <!-- ==================================================================== -->
    <v-pagination
      v-if="pageLength && false"
      v-model="page"
      class="mt-6"
      :length="pageLength"
    />
  </div>
</template>

<script>
import MewTokenContainer from '../MewTokenContainer/MewTokenContainer.vue';

export default {
  name: 'MewLightTable',
  components: { MewTokenContainer },
  props: {
    /**
     * Applies skeleton loader
     */
    loading: {
      type: Boolean,
      default: false
    },
    loaderCount: {
      type: [String, Number],
      default: 1
    },
    title: {
      type: String,
      default: ''
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
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    // isMobile() {
    //   return this.$vuetify.breakpoint.mdAndDown;
    // },
    pageLength() {
      return Math.ceil(this.tableData.length / this.itemsPerPage);
    },
    tableDataPaginated() {
      return this.paginate(this.tableData, this.itemsPerPage, this.page);
    },
    containerStyle() {
      return {
        display: 'block'
      };
    }
  },
  methods: {
    paginate(array, pageSize, pageNumber) {
      return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    }
  }
};
</script>

<style lang="scss">
// .modules-balance-table {
//   .v-pagination__item--active {
//     box-shadow: none !important;
//     background-color: var(--v-textDark-base) !important;
//   }
//   .v-pagination__navigation {
//     box-shadow: none !important;
//   }
//   .v-pagination__item {
//     box-shadow: none !important;
//   }
// }
.core-components--app-table {
  // Force style Vuetify skeleton loader
  .v-skeleton-loader__heading {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.skeleton-loader-container {
  & > div {
    display: flex;
    align-items: center;
    height: 58px;
    padding: 0px 20px;
  }
}

// Default styles
.core-components--app-table {
  --bg-color: #f4f7fe;
  --hover-color: #eaeffb;
  --border-color: #e0e5f2;
  --shadow-color: rgba(0, 0, 0, 0.15);
  table {
    border-collapse: collapse;
    width: 100%;
    thead {
      border-bottom: 1px solid var(--border-color);
      font-size: 12px;
      color: #76848b;
      font-weight: 500;
    }
    td {
      height: 58px;
      padding: 0px 20px;
    }
  }
}

// Options by props
.box-shadow {
  box-shadow: 0 2px 6px var(--shadow-color);
}
.border-around {
  border: 1px solid var(--border-color);
}
.border-top-bottom {
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}
.border-top {
  border-top: 1px solid var(--border-color);
}
.border-bottom {
  border-bottom: 1px solid var(--border-color);
}
.hover-effect {
  tbody {
    tr:hover {
      background-color: var(--hover-color) !important;
    }
  }
}
.alteranting-background {
  tbody {
    tr:nth-child(odd) {
      background-color: var(--bg-color);
    }
  }
}
.loading {
  tbody {
    display: none;
  }
}
.divider {
  tbody {
    tr:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
    }
  }
}
.padding-around {
  padding: 15px 15px 15px 15px;
}

.padding-side {
  padding: 0px 10px;
}
.round-corner {
  border-radius: 8px;
  overflow: hidden;
}
.mobile-background {
  background-color: var(--v-blueLight-base);
}
.no-table-padding {
  table {
    td {
      padding: 0 !important;
    }
    td:first-child {
      padding-left: 15px !important;
    }
    td:last-child {
      padding-right: 15px !important;
    }
  }
}
</style>
