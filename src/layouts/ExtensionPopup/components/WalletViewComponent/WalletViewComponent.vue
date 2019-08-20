<template>
  <div class="wallet-view-container">
    <div class="wallet-view-info">
      <div>
        <blockie :address="address" width="50px" height="50px" />
      </div>
      <div v-show="shouldConcat">
        <p class="name-address">
          <span v-show="name !== ''" class="name"
            >{{ name.length > 14 ? concatName : name }} </span
          ><br />
          <span v-show="!showFullAddr">{{ concatAddr }}</span>
          <span v-show="showFullAddr">{{ address }}</span>
        </p>
        <i
          :class="[showFullAddr ? 'fa-chevron-up' : 'fa-chevron-down', 'fa']"
          @click="showFullAddr = !showFullAddr"
        />
      </div>
      <div v-show="!shouldConcat">
        <p class="name-address">
          <span v-show="name !== ''" class="name"
            >{{ name.length > 14 ? concatName : name }} </span
          ><br />
          <span>{{ address }}</span>
        </p>
      </div>
    </div>
    <div class="wallet-view-balance">
      <p>Balance:</p>
      <p class="balance">
        <span> {{ concatBalance }} </span> {{ network.type.name }}
      </p>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import {mapState} from 'vuex';
export default {
  components: {
    blockie: Blockie
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    balance: {
      type: String,
      default: '0'
    },
    shouldConcat: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showFullAddr: false
    };
  },
  computed: {
    ...mapState(['network']),
    concatName() {
      return `${this.name.substring(0, 14)}...`;
    },
    concatAddr() {
      return `${this.address.substr(0, 10)}...${this.address.substr(
        this.address.length - 4,
        this.address.length
      )}`;
    },
    concatBalance() {
      const stringifiedBal = `${this.balance}`;
      return stringifiedBal.length > 11
        ? `${stringifiedBal.substr(0, 11)}...`
        : stringifiedBal;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletViewComponent.scss';
</style>
