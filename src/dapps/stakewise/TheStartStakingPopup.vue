<template>
  <simple-dialog v-model="popup" max-width="420">
    <div class="d-flex align-center pr-8 mt-n4">
      <div class="stake-icon mr-4">
        <img
          src="@/assets/images/icons/icon-stakewise-purple.svg"
          alt="Stakewise"
        />
      </div>
      <div class="mew-heading-3 font-weight-medium">
        Join the Stakewise pool with any amount of ETH
      </div>
    </div>
    <div class="textMedium--text mt-4">
      Start earning rewards on your ETH within 24 hours. Simplified staking with
      no minimum requirements.
    </div>

    <!-- ======================================================================================= -->
    <!-- Stake status -->
    <!-- ======================================================================================= -->
    <div class="stake-status mt-6 backgroundGrey pa-5 border-radius--10px">
      <div class="d-flex justify-space-between mb-2">
        <div
          class="textMedium--text mew-label font-weight-medium text-uppercase"
        >
          Current APR
        </div>
        <div class="greenPrimary--text">5.21%</div>
      </div>
      <div class="d-flex justify-space-between">
        <div
          class="textMedium--text mew-label font-weight-medium text-uppercase"
        >
          ETH in pool
        </div>
        <div class="">0.38421 ETH</div>
      </div>
    </div>
    <mew-button
      title="START STAKING"
      has-full-width
      btn-size="large"
      class="mt-6"
    ></mew-button>
  </simple-dialog>
</template>

<script>
import SimpleDialog from '@/core/components/AppSimpleDialog';
export default {
  name: 'TheStartStakingPopup',
  components: { SimpleDialog },
  data() {
    return { popup: true };
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.stake-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--v-greyMedium-base) !important;
  border-radius: 12px !important;
  width: 60px;
  height: 60px;

  img {
    height: 55px;
  }
}
</style>
