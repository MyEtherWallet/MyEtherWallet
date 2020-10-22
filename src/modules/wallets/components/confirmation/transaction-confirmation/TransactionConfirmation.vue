<template>
  <v-sheet max-width="600px" class="pa-8">
    <from-to-block :from="from" :to="to" class="mb-2" />
    <!-- <balance-block /> -->
    <mew-expand-panel :panel-items="panelItems" :is-toggle="true">
      <template #panelBody1>
        <div class="px-3">
          <div class="d-flex justify-space-between mb-2">
            <div>Network</div>
            <div>{{ network.type.name }} by {{ network.service }}</div>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <div>Gas Price</div>
            <div>{{ gasPrice }} <span class="primary--text">GWEI</span></div>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <div>Gas Limit</div>
            <div>{{ gasLimit }}</div>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <div>Nonce</div>
            <div>{{ nonce }}</div>
          </div>
          <div class="d-flex justify-space-between">
            <div>Data</div>
            <div>{{ data }}</div>
          </div>
        </div>
      </template>
    </mew-expand-panel>
    <div class="d-flex justify-center my-8">
      <mew-button
        btn-size="xlarge"
        title="Confirm and Send"
        @click.native="send"
      />
    </div>
    <mew-warning-sheet :description="warningDescription" />
  </v-sheet>
</template>

<script>
import fromToBlock from '@/components/from-to-block/FromToBlock';
// import balanceBlock from '@/components/balance-block/BalanceBlock';

export default {
  components: {
    fromToBlock
    // balanceBlock
  },
  props: {
    to: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    },
    gasPrice: {
      type: String,
      default: ''
    },
    gasLimit: {
      type: String,
      default: ''
    },
    nonce: {
      type: Number,
      default: 0
    },
    network: {
      type: Object,
      default: () => {}
    },
    send: {
      type: Function,
      default: () => {}
    }
  },
  data: function () {
    return {
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…',
      open: false,
      panelItems: [
        {
          name: 'Details'
        }
      ],
      activeTab: 0
    };
  },
  methods: {
    close: () => {}
  }
};
</script>

<style lang="scss">
.v-application .warning {
  border-radius: 10px;
}
</style>
