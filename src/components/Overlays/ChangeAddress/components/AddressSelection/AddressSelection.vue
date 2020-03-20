<template>
  <div>
    <div class="pa-3">
      <div
        class="d-flex align-center theme--light-text--white border-radius--5px network-block pl-5 pr-2 py-1 mb-3"
      >
        <div class="font-weight-medium subtitle-1">Network</div>
        <div class="ml-auto d-flex align-center">
          <div>ETH - myetherapi.com</div>
          <v-btn icon class="ml-1" dark>
            <v-icon
              class="theme--light-text--white theme--dark-text--blue"
              size="20px"
              >mdi-pencil-outline</v-icon
            >
          </v-btn>
        </div>
      </div>
      <div
        class="d-flex align-center theme--light-text--white theme--dark-text--white border-radius--5px address-block pl-5 pr-2 py-1"
      >
        <div class="font-weight-medium subtitle-1">
          Address to interact with
        </div>
        <div class="ml-auto">
          <v-btn icon dark>
            <v-icon class="theme--light-text--white" size="20px"
              >mdi-pencil-outline</v-icon
            >
          </v-btn>
        </div>
      </div>
      <Table />
    </div>
  </div>
</template>

<script>
import Table from './components/Table';

export default {
  components: {
    Table
  },
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.network-block {
  background-color: $dark-space;
}

.address-block {
  background-color: #184f90;
}
</style>
