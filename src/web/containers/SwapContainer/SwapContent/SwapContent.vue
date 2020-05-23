<template>
  <WhiteSheet>
    <InterfaceWrap title="Swap">
      <div class="d-flex">
        <div>
          <mew-select :items="coins" label="From" />
          <mew-input label="Amount" placeholder=" " />
        </div>
        <div></div>
        <div>
          <mew-select :items="coins" label="To" />
          <mew-input label="Amount" placeholder=" " />
        </div>
      </div>
    </InterfaceWrap>
  </WhiteSheet>
</template>

<script>
//import Var from '@/common/plugins/variables.js';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';
//import StdButton from '@/web/components/StdButton';
import eth from '@/assets/images/currencies/icon-eth-blue.svg';

export default {
  components: { WhiteSheet, InterfaceWrap },
  data() {
    return {
      coins: [
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          img: eth
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
