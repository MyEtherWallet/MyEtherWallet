<template>
  <div>
    <div class="d-block d-lg-none">
      <tips mobile class="mb-4" />
      <network mobile class="mb-4" />
      <myEthBalance mobile class="mb-4" />
    </div>

    <div class="d-flex mt-4 mt-lg-0">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Sign Message">
            <v-textarea
              outlined
              no-resize
              name="message"
              label="Message"
              value="This is a message I wish to send to someone who can validate that I own the signing address."
            ></v-textarea>

            <div class="text-center mt-3">
              <mew-button
                title="Sign"
                :has-full-width="false"
                btn-size="xlarge"
                @click.native="openOverlay('SignMessageConfirmation')"
              />
            </div>
            <div class="text-center mt-4">
              <mew-button
                title="Clear all"
                :has-full-width="false"
                btn-size="small"
                btn-style="transparent"
              />
            </div>
          </interface-wrap>
        </mew6-white-sheet>
      </div>

      <div class="pa-4 d-none d-lg-block"></div>

      <div class="d-none d-lg-block">
        <tips />
        <div class="pa-4"></div>
        <network />
        <div class="pa-4"></div>
        <tx-history title="Transaction history" />
        <div class="pa-4"></div>
        <myEthBalance />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>

    <div class="d-block d-lg-none">
      <tx-history class="mt-4" title="Transaction history" mobile />
      <swap class="mt-4" mobile />
    </div>
  </div>
</template>

<script>
import tips from '@/modules/wallets/components/tips/Tips';
import interfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import txHistory from '@/modules/wallets/components/transaction-history/TransactionHistory';
import network from '@/modules/wallets/components/network/Network';
import swap from '@/modules/wallets/components/swap/Swap';
import myEthBalance from '@/modules/wallets/components/my-eth-balance/MyEthBalance';

export default {
  components: {
    tips,
    interfaceWrap,
    swap,
    txHistory,
    network,
    myEthBalance
  },
  data() {
    return {};
  }
};
</script>
