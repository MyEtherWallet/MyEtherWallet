<template>
  <v-btn
    :color="btnColor"
    :x-small="xSmall"
    :small="small"
    :large="large"
    :x-large="xLarge"
    :depressed="depressed"
    :dark="isDark"
    :height="height"
    :outlined="isOutlined"
  >
    <div
      :class="['btn-content d-flex align-center', btnTextColor, contentClass]"
    >
      <v-icon v-if="leftIcon" size="20px" class="mr-1">{{ leftIcon }}</v-icon>
      <slot />
      <v-icon v-if="rightIcon" size="20px" class="ml-1">{{ rightIcon }}</v-icon>
    </div>
  </v-btn>
</template>

<script>
export default {
  components: {},
  props: {
    theme: {
      type: String,
      default: ''
    },
    leftIcon: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: ''
    },
    contentClass: {
      type: String,
      default: ''
    },
    outlined: {
      type: Boolean,
      default: false
    },
    depressed: {
      type: Boolean,
      default: true
    },
    dark: {
      type: Boolean,
      default: false
    },
    xSmall: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    xLarge: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {};
  },
  computed: {
    isOutlined() {
      if (this.outlined) return this.outlined;
      if (this.theme == 'green') return false;
      if (this.theme == 'purple') return false;
      if (this.theme == 'outlinedGray') return true;
      return false;
    },
    isDark() {
      if (this.dark) return this.dark;
      if (this.theme == 'green') return true;
      if (this.theme == 'purple') return true;
      if (this.theme == 'outlinedGray') return false;
      return false;
    },
    btnColor() {
      if (this.color) return this.color;
      if (this.theme == 'green') return 'greenPrimary';
      if (this.theme == 'purple') return '#4B83E8';
      if (this.theme == 'outlinedGray') return '#D9DCE2';
      return '';
    },
    btnTextColor() {
      if (this.textColor) return this.textColor + '--text';
      if (this.theme == 'green') return '';
      if (this.theme == 'purple') return '';
      if (this.theme == 'outlinedGray') return 'textDark--text';
      return '';
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.v-btn {
  border-radius: 12px;
  text-transform: initial;
}
.btn-content {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.6px;
}
</style>
