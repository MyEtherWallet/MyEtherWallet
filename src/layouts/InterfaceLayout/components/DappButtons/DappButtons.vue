<template>
  <div
    :class="['dapps-button', supported ? '' : 'disabled']"
    @click="navigateTo"
  >
    <img :src="supported ? icon : iconDisabled" />
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
    supportedNetworks: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    ...mapState(['network', 'online']),
    supported() {
      if (this.online) {
        return this.supportedNetworks.includes(this.network.type.name);
      }
    }
  },
  methods: {
    navigateTo() {
      this.$router.push(this.param);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappButtons.scss';
</style>
