<template>
  <div>
    <app-table
      v-if="!isMobile"
      border-around
      round-corner
      background
      full-width
      flat
    >
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>ADDRESS</td>
            <td>NICKNAME</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(td, dataKey) in tableData" :key="dataKey">
            <td class="mew-label">{{ td.number }}</td>
            <td>
              <div
                class="d-flex align-center flex-shrink-1"
                style="width: 25vw; max-width: 225px"
              >
                <mew-blockie
                  class="mr-1"
                  height="20px"
                  width="20px"
                  :address="td.address"
                />
                <mew-tooltip
                  :text="td.address"
                  hide-icon
                  class="address-container"
                >
                  <template #contentSlot>
                    <mew-transform-hash
                      :hash="td.address"
                      class="mr-2 mew-label"
                    />
                  </template>
                </mew-tooltip>
                <app-copy-btn :copy-value="td.address">
                  <v-btn x-small icon color="greenPrimary">
                    <img
                      src="@/assets/images/icons/icon-copy-green.svg"
                      alt="copy"
                      height="13"
                    />
                  </v-btn>
                </app-copy-btn>
                <a
                  v-if="explorerAddr(td) !== ''"
                  :href="explorerAddr(td)"
                  target="_blank"
                >
                  <v-btn x-small icon color="greenPrimary">
                    <img
                      src="@/assets/images/icons/icon-arrow-top-right-green.svg"
                      alt="copy"
                      height="13"
                    />
                  </v-btn>
                </a>
              </div>
            </td>
            <td
              style="
                max-width: 95px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
              class="mew-label"
            >
              {{ td.nickname }}
            </td>
            <td>
              <mew-button
                btn-style="transparent"
                btn-size="small"
                @click.native="onEdit(td)"
              >
                <div class="mew-label">Edit</div>
              </mew-button>
            </td>
          </tr>
        </tbody>
      </table>
    </app-table>

    <app-table
      v-for="(td, dataKey) in tableData"
      v-else
      :key="dataKey"
      class="mb-2"
      full-width
      border-around
      padding-around
      flat
      round-corner
      mobile-background
    >
      <div class="d-flex align-center justify-space-between">
        <div class="mew-label font-weight-bold">Nickname</div>
        <div class="mew-label">{{ td.nickname }}</div>
      </div>
      <div class="d-flex align-center justify-space-between">
        <div class="mew-label font-weight-bold">Address</div>
        <div
          class="d-flex align-center flex-shrink-1"
          style="width: 38vw; max-width: 160px"
        >
          <mew-transform-hash :hash="td.address" class="mr-1 mew-label" />
          <app-copy-btn :copy-value="td.address">
            <v-btn x-small icon color="greenPrimary">
              <img
                src="@/assets/images/icons/icon-copy-green.svg"
                alt="copy"
                height="12"
              />
            </v-btn>
          </app-copy-btn>
          <a
            v-if="explorerAddr(td) !== ''"
            :href="explorerAddr(td)"
            target="_blank"
          >
            <v-btn x-small icon color="greenPrimary">
              <img
                src="@/assets/images/icons/icon-arrow-top-right-green.svg"
                alt="copy"
                height="12"
              />
            </v-btn>
          </a>
        </div>
      </div>

      <div class="text-right mt-2">
        <v-btn
          outlined
          color="greenPrimary"
          small
          depressed
          @click="onEdit(td)"
        >
          <div class="greenPrimary--text mew-label text-transform--none">
            Edit
          </div>
        </v-btn>
      </div>
    </app-table>
  </div>
</template>

<script>
import AppCopyBtn from '@/core/components/AppCopyBtn';
import AppTable from '@/core/components/AppTable';

export default {
  name: 'SettingsAddressTable',
  components: { AppTable, AppCopyBtn },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    /**
     * Default Address Explorer
     * if item doesn't include it
     */
    defaultExplorerAddr() {
      return 'https://ethvm.com/address/[[address]]';
    }
  },
  methods: {
    onEdit(tableData) {
      this.$emit('onClick', tableData);
    },
    /**
     * Get Address Explorer from item
     * return EthVM if coinType/explorer is
     * undefined but address is supported
     */
    explorerAddr(item) {
      const address =
        item.resolvedAddr && !item.resolvedAddr.includes('.')
          ? item.resolvedAddr
          : item.address;
      const coinType = item.coinType;
      if (coinType && coinType.toLowerCase() === 'bitcoin')
        return 'https://www.blockchain.com/btc/address/' + address;
      const prefix = address.substring(0, 2);
      if (
        item.explorerAddr ||
        (coinType && coinType.toLowerCase() === 'ethereum') ||
        (prefix === '0x' && address.length === 42)
      ) {
        const explorer = item.explorerAddr
          ? item.explorerAddr
          : this.defaultExplorerAddr;
        return explorer.replace('[[address]]', address);
      }
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
.address-container {
  max-width: 210px;
}
</style>
