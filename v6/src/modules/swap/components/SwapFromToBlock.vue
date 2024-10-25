<template>
  <div class="position--relative backgroundGrey border-radius--5px">
    <div class="right-arrow d-flex align-center justify-center">
      <v-icon class="textLight--text">mdi-arrow-right-thick</v-icon>
    </div>
    <v-row>
      <v-col cols="6" class="text-center px-10 py-6">
        <img class="mb-2" :src="fromImg" :alt="fromType" height="40" />
        <div class="font-weight-bold text-uppercase">
          {{ fromVal }} <span class="greyPrimary--text">{{ fromType }}</span>
        </div>
        <div class="d-flex align-center">
          <div class="text-uppercase monospace address">{{ from }}</div>
          <div class="text-uppercase monospace">
            {{ from.substr(to.length - 5) }}
          </div>
        </div>
      </v-col>
      <v-col cols="6" class="text-center px-10 py-6">
        <img class="mb-2" :src="toImg" :alt="toType" height="40" />
        <div class="font-weight-bold text-uppercase">
          {{ toVal }} <span class="greyPrimary--text">{{ toType }}</span>
        </div>
        <div class="d-flex align-center">
          <div class="text-uppercase monospace address">{{ to }}</div>
          <div class="text-uppercase monospace">
            {{ to.substr(to.length - 5) }}
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    from: { default: '', type: String },
    to: { default: '', type: String },
    fromVal: { default: '0', type: String },
    fromImg: { default: '@/assets/images/currencies/eth.png', type: String },
    toImg: { default: '@/assets/images/currencies/eth.png', type: String },
    toVal: { default: '0', type: String },
    toType: { default: 'ETH', type: String },
    fromType: { default: 'ETH', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.address {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-arrow {
  background-color: var(--v-textDark-base);
  border-radius: 100%;
  height: 40px;
  width: 40px;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.1);
}
</style>
