<template>
  <v-sheet max-width="600px" class="pa-8">
    <mew-expand-panel
      :panel-items="panelItems"
      :is-toggle="true"
      :idx-to-expand="activeTab"
    >
      <template v-for="(item, idx) in panelItems" #[item.slotName]>
        <v-container :key="item.details.to + idx" fluid>
          <v-row
            v-for="(detail, index) in Object.keys(item.details)"
            :key="index"
          >
            <v-col cols="2">{{ detail }} </v-col>
            <v-col cols="10" class="text-right word-break--break-all"
              >{{ item.details[detail] }}
            </v-col>
          </v-row>
        </v-container>
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
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { fromWei, toBN } from 'web3-utils';
export default {
  props: {
    transactions: {
      type: Array,
      default: () => []
    },
    send: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…',
      activeTab: 0
    };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    panelItems() {
      const copyTransactions = JSON.parse(JSON.stringify(this.transactions));
      return copyTransactions.map((item, idx) => {
        const reparseItem = {};
        Object.keys(item).forEach(key => {
          reparseItem[key] =
            key !== 'data' && key !== 'from' && key !== 'to'
              ? key === 'gasPrice'
                ? fromWei(item[key], 'gwei')
                : BigNumber(item[key]).toFixed()
              : item[key];
        });
        const txFee = fromWei(toBN(item.gasPrice).mul(toBN(item.gas)));
        delete reparseItem['__typename'];
        delete reparseItem['type'];
        delete reparseItem['handleNotification'];
        return Object.assign(
          {},
          {
            name: `Transaction ${idx + 1}`,
            subtext: `Tx Fee: ${txFee}`,
            slotName: `panelBody${idx + 1}`,
            details: reparseItem
          }
        );
      });
    }
  }
};
</script>
