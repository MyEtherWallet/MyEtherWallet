<template>
  <div class="superPrimary border-radius--5px pa-5">
    <v-row>
      <v-col class="pt-0">
        <h5 class="font-weight-bold">Balance Remaining</h5>
      </v-col>
      <v-col class="text-right pt-0">
        <h5 class="font-weight-bold">$24,321.32</h5>
        <div>31.23423 ETH</div>
      </v-col>
    </v-row>

    <mew-progress-bar :balance-obj="progressBar" />

    <div class="mt-5">
      <v-row class="py-0">
        <v-col class="d-flex align-center py-1 my-0 text-uppercase" cols="4">
          <v-icon color="titlePrimary">mdi-circle-medium</v-icon>
          <h6 class="searchText--text font-weight-medium">Send</h6>
          <img
            class="ml-1"
            src="@/assets/images/currencies/icon-eth-blue.svg"
            height="17"
          />
        </v-col>
        <v-col class="py-0 my-0 text-right" cols="4"
          >-0.02314
          <span class="searchText--text font-weight-medium">ETH</span></v-col
        >
        <v-col class="py-0 my-0 text-right" cols="4">-$53.32</v-col>
      </v-row>

      <v-row class="py-0">
        <v-col class="d-flex align-center py-1 my-0 text-uppercase" cols="4">
          <v-icon color="#f5a623">mdi-circle-medium</v-icon>
          <h6 class="searchText--text font-weight-medium">Transaction Fee</h6>
        </v-col>
        <v-col class="py-0 my-0 text-right" cols="4"
          >-0.02314
          <span class="searchText--text font-weight-medium">ETH</span></v-col
        >
        <v-col class="py-0 my-0 text-right" cols="4">-$53.32</v-col>
      </v-row>

      <v-row class="py-0">
        <v-col class="d-flex align-center py-1 my-0 text-uppercase" cols="4">
          <v-icon color="transparent">mdi-circle-medium</v-icon>
          <h6 class="searchText--text font-weight-medium">Total Pay</h6>
        </v-col>
        <v-col class="py-0 my-0 text-right font-weight-medium" cols="4"
          >8435094
          <span class="searchText--text font-weight-medium">ETH</span></v-col
        >
        <v-col class="py-0 my-0 text-right font-weight-medium" cols="4">
          $564.32
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progressBar: {
        total: 20.32,
        data: [
          {
            title: 'sendBal',
            color: 'titlePrimary',
            amount: 5.3,
            tooltip: 'Send: 5.3',
            percentage: '26.08'
          },
          {
            title: 'feeBal',
            color: 'warning darken-1',
            amount: 3.2,
            tooltip: 'Fee: 3.2',
            percentage: '15.75'
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped></style>
