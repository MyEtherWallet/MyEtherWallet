<template lang="html">
  <div class="mew-component--blockie-with-currency">
    <div v-if="type !== 'swap'" class="position--relative">
      <mew-blockie :address="address" width="40px" height="40px" />

      <div class="currency">
        <img
          src="@/assets/images/currencies/icon-eth-blue.svg"
          alt="currency"
        />
      </div>
    </div>
    <div v-if="type === 'swap'" class="position--relative swap-icons">
      <img
        class="from"
        src="@/assets/images/currencies/icon-eth-blue.svg"
        alt="currency"
      />
      <img
        class="to"
        src="@/assets/images/currencies/icon-eth-blue.svg"
        alt="currency"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: { type: String, default: '' },
    address: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '64px'
    },
    height: {
      type: String,
      default: '64px'
    },
    size: {
      type: Number,
      default: 8
    },
    scale: {
      type: Number,
      default: 16
    },
    currency: {
      type: String,
      default: 'eth'
    }
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.currency {
  border: 1px solid white;
  border-radius: 100%;
  position: absolute;
  height: 18px;
  width: 18px;
  bottom: -2px;
  right: -2px;
  img {
    width: 100%;
    height: 100%;
  }
}

.swap-icons {
  .from {
    position: relative;
    border-radius: 50%;
    border: 2px solid white;
  }
  .to {
    border-radius: 50%;
    border: 2px solid white;

    position: absolute;
    top: 0px;
    left: 20px;
  }
}
</style>

<style lang="scss">
.mew-component--blockie-with-currency {
  .address-identicon {
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    height: 100%;
    width: 100%;
    border: 2px solid white !important;
  }
}
</style>
