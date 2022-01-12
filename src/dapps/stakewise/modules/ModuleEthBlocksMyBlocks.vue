<template>
  <div class="pt-5 pb-13 px-3 pa-sm-15">
    <v-row>
      <v-col cols="12" md="8">
        <compound />
      </v-col>
      <v-col cols="12" md="4">
        <side-apr class="mb-4" />
        <side-staking class="mb-4" />
        <side-rewards />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SideApr from './ModuleSideApr';
import SideStaking from './ModuleSideStaking';
import SideRewards from './ModuleSideRewards';
import Compound from './ModuleSubCompound';
import { mapState } from 'vuex';
export default {
  name: 'ModuleEthBlocksMint',
  components: { SideApr, SideStaking, SideRewards, Compound },
  data() {
    return {};
  },
  computed: {
    ...mapState('wallet', ['blockNumber'])
  }
};
</script>

<style lang="scss" scoped></style>
