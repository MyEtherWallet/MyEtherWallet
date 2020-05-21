<template>
  <WhiteSheet>
    <InterfaceWrap title="Send Transaction">
      <div>
        <div class="d-flex">
          <mew-select :items="coins" label="Type" class="mr-2" />
          <mew-input
            label="Amount"
            placeholder=" "
            right-label="$23,232.93"
            value="10.23472384"
            class="flex-grow-1"
          />
        </div>
        <address-select
          copy-tooltip="Copy"
          save-tooltip="Save"
          :enable-save-address="true"
          label="label"
          :items="addresses"
          placeholder="Please enter an address"
          success-toast="Success"
          :is-valid-address="false"
          @emitSelectedValue="getSelectedValue"
        />
      </div>
      <div>
        <mew-input label="Gas Price" placeholder=" " value="40" />
        <mew-input label="Gas Limit" placeholder=" " value="21000" />
      </div>
      <div class="d-flex justify-space-between px-5">
        <div class="mew-body font-weight-medium d-flex align-center">
          Transaction Fee <info-tooltip class="ml-1" text="Tx fees" />
        </div>
        <div>$0.177</div>
      </div>
      <Divider class="mt-7 mb-12" />
      <div>
        <mew-input label="Gas Limit" placeholder=" " value="21000" />
      </div>
      <div class="text-center">
        <mew-button title="Send" :has-full-width="false" button-size="xlarge" />
        <div class="mt-6 emerald--text">Clean all</div>
      </div>
    </InterfaceWrap>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';
import eth from '@/assets/images/currencies/icon-eth-blue.svg';
import Divider from '@/components/DividerX';

export default {
  components: { WhiteSheet, InterfaceWrap, Divider },
  data() {
    return {
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
      //console.log('selected value:', value);
      this.addressValue = value;
    }
  }
};
</script>
