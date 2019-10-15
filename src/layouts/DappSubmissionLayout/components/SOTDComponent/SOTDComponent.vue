<template>
  <div class="mt-4 sotd-wrapper">
    <div v-show="show" class="sotd-container">
      <div class="text-container">
        <img
          src="~@/assets/images/icons/dapps/sotd.png"
          alt="State of the DApps"
        />
        <p>
          A joint effort with State of the DApps. By submitting your dapp
          information, you acknowledge that your Dapp will be listed on
          <a href="https://www.stateofthedapps.com/">stateofthedapps.com</a>
        </p>
      </div>
      <div>
        <i class="fa fa-times" @click="hideText()" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true
    };
  },
  methods: {
    hideText() {
      if (this.show === true) {
        this.show = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SOTDComponent.scss';
</style>
