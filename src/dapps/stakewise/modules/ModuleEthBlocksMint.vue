<template>
  <div class="pt-5 pb-13 px-3 pa-sm-15">
    <v-item-group v-model="tab" mandatory class="mb-9">
      <v-item v-slot="{ active, toggle }" class="mr-3">
        <v-btn
          class="text-transform--initial"
          depressed
          large
          :text="!active"
          :color="active ? 'greyLight' : ''"
          @click.native="toggle"
        >
          Stake
        </v-btn>
      </v-item>
      <v-item v-slot="{ active, toggle }">
        <v-btn
          class="text-transform--initial"
          depressed
          large
          :text="!active"
          :color="active ? 'greyLight' : ''"
          @click.native="toggle"
        >
          Compound
        </v-btn>
      </v-item>
    </v-item-group>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <stake-eth />
      </v-tab-item>
      <v-tab-item> <compound /> </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import StakeEth from './ModuleSubStakeEth';
import Compound from './ModuleSubCompound';
import { mapState } from 'vuex';
export default {
  name: 'ModuleEthBlocksMint',
  components: { StakeEth, Compound },
  data() {
    return {
      tab: 'stake'
    };
  },
  computed: {
    ...mapState('wallet', ['blockNumber'])
  }
};
</script>

<style lang="scss" scoped></style>
