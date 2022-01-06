<template>
  <div>
    <!-- Stake direction information -->
    <div class="d-flex align-center mb-15">
      <div
        class="border-radius--8px backgroundGrey flex-grow-1 pa-5 d-flex flex-column align-center"
      >
        <div class="mew-caption textLight--text font-weight-regular mb-2">
          You give
        </div>
        <div class="stake-icon white">
          <img
            src="@/assets/images/icons/icon-eth-gray.svg"
            alt="Eth"
            height="34"
          />
        </div>
      </div>
      <div class="px-5">
        <v-icon color="greenPrimary">mdi-arrow-right</v-icon>
      </div>
      <div
        class="border-radius--8px backgroundGrey flex-grow-1 pa-5 d-flex flex-column align-center"
      >
        <div class="mew-caption textLight--text font-weight-regular mb-2">
          You will get
        </div>
        <div class="stake-icon white">
          <img
            src="@/assets/images/icons/icon-stakewise-green.svg"
            alt="Stakewise"
            height="34"
          />
        </div>
      </div>
    </div>

    <!-- Amount to stake -->
    <div class="position--relative">
      <button-balance :loading="false" balance="10035342000" />
      <mew-input
        type="number"
        :max-btn-obj="{
          title: 'Max',
          disabled: false,
          method: setMaxAmount
        }"
      />
    </div>

    <!-- How stake works -->
    <div>
      <div class="font-weight-bold">How staking works</div>
      <ul>
        <li>
          Anyone can deposit any amount of ETH into the Stakewise pool. No
          minimum required.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ButtonBalance from '@/core/components/AppButtonBalance';
export default {
  name: 'ModuleSubStakeEth',
  components: { ButtonBalance },
  data() {
    return {};
  },
  computed: {},
  methods: {
    setMaxAmount() {}
  }
};
</script>

<style lang="scss" scoped>
.stake-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--v-greyLight-base) !important;
  border-radius: 50% !important;
  width: 52px;
  height: 52px;
}
</style>
