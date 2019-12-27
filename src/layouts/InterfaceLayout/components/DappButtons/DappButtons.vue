<template>
  <div
    :class="['dapps-button', supported ? '' : 'disabled']"
    @click="navigateTo"
  >
    <img
      v-show="!isBeenTwoWeeks"
      src="@/assets/images/new-label.png"
      class="new-label"
      alt
    />
    <img
      :src="supported ? icon : iconDisabled"
      :class="[title === 'Ambrpay' ? 'ambrpay-icon' : '', 'dapp-logo']"
      alt
    />
    <div>
      <h4>{{ title }}</h4>
      <p>{{ desc }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconDisabled: {
      type: String,
      default: ''
    },
    param: {
      type: String,
      default: ''
    },
    releaseDate: {
      type: String,
      default: ''
    },
    supportedNetworks: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    ...mapState('main', ['online', 'network']),
    supported() {
      if (this.online) {
        return this.supportedNetworks.includes(this.network.type.name);
      }
      return null;
    },
    isBeenTwoWeeks() {
      const today = new Date();
      const releaseDate = new Date(this.releaseDate);
      const diff = today.getTime() - releaseDate.getTime();
      const MAX_WEEKS = 2;
      return this.milliToWeeks(diff) > MAX_WEEKS;
    }
  },
  methods: {
    milliToWeeks(milli) {
      const secs = milli / 1000;
      const mins = secs / 60;
      const hours = mins / 60;
      const days = hours / 24;
      const weeks = days / 7;
      return weeks;
    },
    navigateTo() {
      this.$router.push(this.param);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappButtons.scss';
</style>
