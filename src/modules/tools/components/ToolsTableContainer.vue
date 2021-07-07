<template>
  <white-sheet class="watch-only-address-table">
    <div class="block-header d-flex align-center">
      <mew-blockie
        height="35px"
        width="35px"
        address="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
        class="mr-4 blockie"
      />
      <div class="truncate">
        <div class="font-weight-medium">Elmo's wallet 04</div>
        <div class="d-flex align-center">
          <mew-transform-hash hash="0x98d9964e1764654dtrhtrggfrv3049t04i" />
          <mew-copy
            copy-value="0x98d9964e1764654dtrhtrggfrv3049t04i"
            :is-small="true"
            :tooltip="$t('common.copy')"
          />
        </div>
      </div>
      <div class="ml-auto">
        <v-btn icon depressed color="white">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </div>
    </div>

    <div class="white d-block d-lg-none px-5">
      <div class="d-flex align-center justify-space-between pt-6 pb-2">
        <h5 class="font-weight-medium">ETH Balance</h5>
        <div class="text-right">
          <h5 class="font-weight-bold">$2,000.00</h5>
          <div class="primary--text">8.00123 ETH</div>
        </div>
      </div>
      <v-divider />

      <div class="d-flex align-center justify-space-between py-4">
        <h5 class="font-weight-medium">Value of Tokens</h5>
        <div class="text-right">
          <h5 class="font-weight-bold">$200.00</h5>
          <div class="primary--text">4 Tokens</div>
        </div>
      </div>

      <v-divider />

      <div class="d-flex align-center justify-space-between py-4">
        <h5 class="font-weight-medium">Total Wallet Value</h5>
        <div class="text-right">
          <h5 class="font-weight-bold">$2,000.22</h5>
          <div class="primary--text">18.00123 ETH</div>
        </div>
      </div>

      <v-divider />
    </div>

    <div class="pa-7 d-none d-lg-flex justify-space-between align-center">
      <div class="d-flex align-start">
        <img
          src="@/assets/images/currencies/icon-eth-blue.svg"
          height="35"
          class="mr-4 mt-1"
        />
        <div>
          <div class="font-weight-medium input-label--text">Total Value</div>
          <h5 class="font-weight-bold">$2,231.31</h5>
          <div class="textSecondary--text">12.00431 ETH</div>
        </div>
      </div>
      <div>
        <div class="font-weight-medium input-label--text">ETH Balance</div>
        <h5 class="font-weight-bold">$2,000.00</h5>
        <div class="textSecondary--text">8.00431 ETH</div>
      </div>
      <div>
        <div class="font-weight-medium input-label--text">Value of Tokens</div>
        <h5 class="font-weight-bold">$231.31</h5>
        <div class="textSecondary--text">4 tokens</div>
      </div>
      <div>
        <mew-button
          :title="panel.length == 0 ? 'Show tokens' : 'Hide tokens'"
          btn-style="transparent"
          @click.native="openPanel"
        />
      </div>
    </div>

    <v-expansion-panels v-model="panel" multiple flat>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <tools-table />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div
      class="d-lg-none text-center py-4 primary--text font-weight-medium"
      @click="openPanel"
    >
      {{ panel.length == 0 ? 'Show tokens' : 'Hide tokens' }}
      <v-icon
        :class="panel.length == 0 ? '' : 'r180'"
        class="rotate"
        color="primary"
        >mdi-chevron-down</v-icon
      >
    </div>
  </white-sheet>
</template>

<script>
import ToolsTable from './ToolsTable';
import WhiteSheet from '@/components/white-sheet/WhiteSheet';

export default {
  name: 'ToolsTableContainer',
  components: { ToolsTable, WhiteSheet },
  data: () => ({ panel: [] }),
  methods: {
    openPanel() {
      this.panel = this.panel.length == 0 ? [0] : [];
    }
  }
};
</script>

<style lang="scss" scoped>
.block-header {
  background-color: var(--v-expandHeader-base) !important;
  color: white;
  padding: 15px 20px;
  border-radius: 10px 10px 0 0;
}
.blockie {
  border: 2px solid white;
  border-radius: 100%;
}
</style>

<style lang="scss">
.watch-only-address-table {
  .v-expansion-panel-content__wrap {
    padding: 0 !important;
    margin: 0 !important;
  }
  .v-icon.v-icon {
    color: var(--v-white-base) !important; //add color to mew-copy
  }
}
</style>
