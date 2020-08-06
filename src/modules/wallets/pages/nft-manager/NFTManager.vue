<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Swap">
            <mew-tabs :items="items">
              <template v-slot:tabContent1
                ><div>
                  <div class="d-flex justify-space-between mb-5">
                    <h5 class="font-weight-bold">CryptoFlowers</h5>
                    <div>Total 3</div>
                  </div>
                  <div>
                    <div
                      v-for="(kitty, key) in CryptoKitties"
                      :key="key"
                      class="superPrimary border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                    >
                      <div class="d-flex align-center">
                        <img
                          height="100"
                          :src="kitty.image"
                          alt="Crypto Kitty"
                        />
                        <div class="ml-5">#{{ kitty.number }}</div>
                      </div>
                      <mew-button
                        :has-full-width="false"
                        btn-style="outline"
                        title="Send"
                        button-size="large"
                      />
                    </div>
                  </div></div
              ></template>
              <template v-slot:tabContent2
                ><div>
                  <div class="d-flex justify-space-between mb-5">
                    <h5 class="font-weight-bold">CryptoKitties</h5>
                    <div>Total 3</div>
                  </div>
                  <div>
                    <div
                      v-for="(kitty, key) in CryptoKitties"
                      :key="key"
                      class="superPrimary border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                    >
                      <div class="d-flex align-center">
                        <img
                          height="100"
                          :src="kitty.image"
                          alt="Crypto Kitty"
                        />
                        <div class="ml-5">#{{ kitty.number }}</div>
                      </div>
                      <mew-button
                        :has-full-width="false"
                        btn-style="outline"
                        title="Send"
                        button-size="large"
                      />
                    </div>
                  </div></div
              ></template>
              <template v-slot:tabContent2
                ><div>
                  <div class="d-flex justify-space-between mb-5">
                    <h5 class="font-weight-bold">GodsUnchained</h5>
                    <div>Total 3</div>
                  </div>
                  <div>
                    <div
                      v-for="(kitty, key) in CryptoKitties"
                      :key="key"
                      class="superPrimary border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                    >
                      <div class="d-flex align-center">
                        <img
                          height="100"
                          :src="kitty.image"
                          alt="Crypto Kitty"
                        />
                        <div class="ml-5">#{{ kitty.number }}</div>
                      </div>
                      <mew-button
                        :has-full-width="false"
                        btn-style="outline"
                        title="Send"
                        button-size="large"
                      />
                    </div>
                  </div></div
              ></template>
              <template v-slot:tabContent3
                ><div>
                  <div class="d-flex justify-space-between mb-5">
                    <h5 class="font-weight-bold">MyCryptoHeros</h5>
                    <div>Total 3</div>
                  </div>
                  <div>
                    <div
                      v-for="(kitty, key) in CryptoKitties"
                      :key="key"
                      class="superPrimary border-radius--5px pl-4 pr-6 py-0 mb-2 d-flex align-center justify-space-between"
                    >
                      <div class="d-flex align-center">
                        <img
                          height="100"
                          :src="kitty.image"
                          alt="Crypto Kitty"
                        />
                        <div class="ml-5">#{{ kitty.number }}</div>
                      </div>
                      <mew-button
                        :has-full-width="false"
                        btn-style="outline"
                        title="Send"
                        button-size="large"
                      />
                    </div>
                  </div></div
              ></template>
            </mew-tabs>
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
import Network from '@/modules/wallets/components/network/Network';
import Swap from '@/modules/wallets/components/swap/Swap';
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import Kitty1 from '@/assets/images/temp/cryptokitties1.svg';
import Kitty2 from '@/assets/images/temp/cryptokitties2.svg';
import Kitty3 from '@/assets/images/temp/cryptokitties3.svg';

export default {
  components: {
    network: Network,
    swap: Swap,
    'interface-wrap': InterfaceWrap
  },
  data() {
    return {
      CryptoKitties: [
        { image: Kitty1, number: '4534' },
        { image: Kitty2, number: '4537' },
        { image: Kitty3, number: '4589' }
      ]
    };
  }
};
</script>
