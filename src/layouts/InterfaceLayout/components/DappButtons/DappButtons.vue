<template>
  <div :class="['dapps-button', supported ? '' : 'disabled']">
    <router-link :to="param" tag="div">
      <img :src="supported ? icon : iconDisabled" />
      <div>
        <h4>{{ title }}</h4>
        <p>{{ desc }}</p>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
    supportedNetworks: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    ...mapGetters({
      network: 'network'
    }),
    supported() {
      return this.supportedNetworks.includes(this.network.type.name);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappButtons.scss';
</style>
