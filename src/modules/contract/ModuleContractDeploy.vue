<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <mew-module class="d-flex flex-grow-1 pt-6" :has-elevation="true" :has-indicator="true" title="Deploy contract">
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
                btn-size="xlarge"
              />
            </div>
          </mew-module   class="d-flex flex-grow-1 pt-6" >
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

import Network from '@/modules/network/ModuleNetwork';
import Swap from '@/components/swap/Swap';

export default {
  name: 'ModuleContractDeploy',
  components: {
    network: Network,
    swap: Swap
  }
};
</script>
