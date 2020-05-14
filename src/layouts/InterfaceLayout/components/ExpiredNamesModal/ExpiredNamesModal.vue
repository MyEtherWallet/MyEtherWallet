<template lang="html">
  <div>
    <b-modal
      ref="expiredNames"
      title="Expired ENS Names!"
      hide-footer
      class="bootstrap-modal nopadding max-height-1"
      centered
      static
      lazy
    >
      <div class="ens-notification-container">
        <h3>
          Heads up! We found some of your ENS names are in the grace period and
          are about to expire!
        </h3>
        <button class="navigate-btn" @click="navigateToEnsManager">
          Go to ENS Manager
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
// import { mapState } from 'vuex';

export default {
  data() {
    return {};
  },
  // computed: {
  //   ...mapState('main', ['account', 'network']),
  //   expiredNames() {
  //     const names = [];
  //     this.account.ensNames.forEach(item => {
  //       if (item.expired)
  //         names.push(`${item.name}.${this.network.type.ens.registrarTLD}`);
  //     });

  //     if (names.length > 1) {
  //       return names.join(', ');
  //     } else if (names.length) {
  //       return names[0];
  //     }
  //     return '';
  //   }
  methods: {
    navigateToEnsManager() {
      this.$router.push({ name: 'ENS initial state' });
      this.$refs.expiredNames.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExpiredNamesModal.scss';
</style>
