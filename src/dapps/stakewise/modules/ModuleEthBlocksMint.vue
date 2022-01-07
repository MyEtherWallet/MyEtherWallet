<template>
  <div class="pt-5 pb-13 px-3 pa-sm-15">
    <v-row>
      <v-col cols="12" md="8">
        <stake-eth />
      </v-col>
      <v-col cols="12" md="4"> aaa </v-col>
    </v-row>
  </div>
</template>

<script>
import StakeEth from './ModuleSubStakeEth';
import { mapState } from 'vuex';
export default {
  name: 'ModuleEthBlocksMint',
  components: { StakeEth },
  data() {
    return {};
  },
  computed: {
    ...mapState('wallet', ['blockNumber'])
  }
};
</script>

<style lang="scss" scoped></style>
