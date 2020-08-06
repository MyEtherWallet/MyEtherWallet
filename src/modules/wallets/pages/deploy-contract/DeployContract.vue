<template>
  <div>
    <div class="d-flex">
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

            <div class="text-center mt-3">
              <mew-button
                title="Sign Transaction"
                :has-full-width="false"
                button-size="xlarge"
              />
            </div>
          </interface-wrap>
        </mew6-white-sheet>
      </div>
      <div class="pa-4"></div>
      <div>
        <network />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';

import Network from '@/modules/wallets/components/network';
import Swap from '@/modules/wallets/components/swap';

export default {
  components: {
    'interface-wrap': InterfaceWrap,
    network: Network,
    swap: Swap
  }
};
</script>
