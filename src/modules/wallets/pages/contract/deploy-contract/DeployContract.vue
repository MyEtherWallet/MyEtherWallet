<template>
  <div>
    <div class="d-block d-lg-none">
      <network mobile class="mb-4" />
      <myEthBalance mobile class="mb-4" />
    </div>

    <div class="d-flex mt-4 mt-lg-0">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Deploy contract">
            <mew-input label="Byte code" placeholder=" " />

            <v-textarea
              no-resize
              outlined
              name="input-7-4"
              label="ABI/JSON Interface"
              value=""
              placeholder=" "
            ></v-textarea>

            <mew-input label="Contract name" placeholder=" " />

            <div class="text-center mt-lg-3">
              <mew-button
                title="Sign Transaction"
                :has-full-width="false"
                btn-size="xlarge"
              />
            </div>
          </interface-wrap>
        </mew6-white-sheet>
      </div>

      <div class="pa-4 d-none d-lg-block"></div>

      <div class="d-none d-lg-block">
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
import interfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import txHistory from '@/modules/wallets/components/transaction-history/TransactionHistory';
import network from '@/modules/wallets/components/network/Network';
import swap from '@/modules/wallets/components/swap/Swap';
import myEthBalance from '@/modules/wallets/components/my-eth-balance/MyEthBalance';

export default {
  components: {
    interfaceWrap,
    swap,
    txHistory,
    network,
    myEthBalance
  }
};
</script>
