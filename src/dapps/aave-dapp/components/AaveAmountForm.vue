<template>
  <v-sheet
    class="pa-12 text-center"
    rounded
    color="white"
    elevation="1"
    width="650"
  >
    <v-row justify="space-around">
      <v-col cols="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          subtitle="Aave Deposit Balance"
          title="59.38592 DAI"
          caption="$ 60.12"
        />
      </v-col>
      <v-col cols="6">
        <mew-module
          color-type="overlayBg"
          :has-body-padding="true"
          subtitle="Aave Wallet Balance"
          title="28.125 DAI"
          caption="$ 29.52"
        />
      </v-col>
    </v-row>
    <div class="px-12 mt-5">
      <p class="mew-heading-3 text-left">How much would you like to deposit?</p>
      <p class="mew-body pt-1 text-left">
        Here you can set the amount you want to deposit. You can manually enter
        a specific amount or use the percentage buttons below
      </p>
    </div>
  </v-sheet>
</template>

<script>
export default {
  namme: 'AaveAmountForm'
};
</script>

<style></style>
