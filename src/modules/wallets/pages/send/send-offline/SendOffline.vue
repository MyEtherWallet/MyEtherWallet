<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Send Offline">
            <div>
              <div class="d-flex">
                <mew-select :items="coins" label="Type" class="mr-3" />
                <div class="position--relative flex-grow-1">
                  <div class="corner-btn">Entire balance</div>
                  <mew-input
                    label="Amount"
                    placeholder=" "
                    right-label="$23,232.93"
                    value="10.23472384"
                  />
                </div>
              </div>

              <address-select
                copy-tooltip="Copy"
                save-tooltip="Save"
                :enable-save-address="true"
                label="To Address"
                :items="addresses"
                placeholder="Please enter an address"
                success-toast="Success"
                :is-valid-address="true"
                @emitSelectedValue="getSelectedValue"
              />
            </div>

            <mew-expand-panel is-toggle has-dividers :panel-items="exPannel">
              <template v-slot:panelBody1>
                <div>
                  <mew-input label="Gas Price" placeholder=" " value="40" />
                  <mew-input label="Gas Limit" placeholder=" " value="21000" />
                </div>

                <div class="d-flex justify-space-between px-5">
                  <div class="mew-body font-weight-medium d-flex align-center">
                    Transaction Fee
                    <info-tooltip class="ml-1" text="Tx fees" />
                  </div>
                  <div>$0.177</div>
                </div>
                <Divider dot class="mt-5" />
                <mew-input
                  label="Add Data"
                  placeholder=" "
                  value
                  class="mt-10 mb-n5"
                />
              </template>
            </mew-expand-panel>

            <div class="text-center mt-12">
              <mew-button
                title="Send"
                :has-full-width="false"
                button-size="xlarge"
              />
            </div>
            <div class="text-center mt-4">
              <mew-button
                title="Clear all"
                :has-full-width="false"
                button-size="small"
                btn-style="transparent"
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
import network from '@/modules/wallets/components/network/Network';
import swap from '@/modules/wallets/components/swap/Swap';
import interfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import eth from '@/assets/images/currencies/icon-eth-blue.svg';
import divider from '@/components/dividerx/DividerX';

export default {
  components: {
    network,
    swap,
    interfaceWrap,
    divider
  },
  data() {
    return {
      exPannel: [
        {
          name: 'Advanced',
          subtext: 'Gas & Data'
        }
      ],
      addressValue: '',
      addresses: [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'My Address',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          address: '0x43689531907482BEE7e650D18411E284A7337A66',
          currency: 'ETH',
          nickname: 'nickname',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      coins: [
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          img: eth
        }
      ]
    };
  },
  methods: {
    getSelectedValue(value) {
      this.addressValue = value;
    }
  }
};
</script>
