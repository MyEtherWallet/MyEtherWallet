<template>
  <v-sheet max-width="600px" class="pa-8">
    <div class="px-3">
      <div class="d-flex justify-space-between mb-2">
        <v-textarea
          outlined
          label="Signature"
          :value="msg"
          :auto-grow="true"
          :readonly="true"
        ></v-textarea>
      </div>
    </div>
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
export default {
  components: {
    // TransactionAddresses,
    // TransactionBalance
  },
  props: {
    msg: {
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
    },
    txFee: {
      type: String,
      default: '0'
    },
    txFeeUSD: {
      type: String,
      default: '0'
    },
    value: {
      type: String,
      default: '0'
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
