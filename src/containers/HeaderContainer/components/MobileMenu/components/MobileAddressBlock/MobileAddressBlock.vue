<template>
  <div class="mobile-address-block">
    <div class="wrap">
      <div class="blockie-container">
        <blockie
          :address="account.address"
          class="blockie-image"
          width="50px"
          height="50px"
        />
      </div>
      <div class="data-block">
        <div class="top-title">
          Address
        </div>
        <p class="the-address">{{ account.address }}</p>
        <div class="buttons-container">
          <button>
            <img src="~@/assets/images/icons/printer-white.svg" />
          </button>
          <button>
            <img src="~@/assets/images/icons/copy.svg" />
          </button>
          <button>
            <img src="~@/assets/images/icons/change.svg" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import { mapGetters } from 'vuex';

export default {
  name: 'MobileAddressBlock2',
  components: {
    blockie: Blockie
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet',
      online: 'online',
      web3: 'web3',
      account: 'account'
    })
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MobileAddressBlock.scss';
</style>
