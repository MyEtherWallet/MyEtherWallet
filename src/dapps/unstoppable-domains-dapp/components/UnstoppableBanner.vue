<template>
  <v-container>
    <v-row class="ml-4" align="center" justify="center">
      <v-col lg="1">
        <v-img
          src="@/assets/images/icons/icons-dapp-unstoppable.svg"
          max-width="88px"
        />
      </v-col>
      <v-col lg="11">
        <div>
          <div class="bluePrimary--text">Dapps</div>
          <h2 class="my-1">Unstoppable Domain</h2>
          <div class="textLight--text">
            Replace your crypto addres with a human readable name
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'UnstoppableBanner'
};
</script>

<style lang="scss" scoped>
// ==================================================================================================
// Replace with mew-components color variables when mew-components is updated.
// ==================================================================================================
$greyMedium: #d7dae3;
$bluePrimary: #4b83e8;

.bluePrimary--text {
  font-size: 12px;
  color: $bluePrimary;
}

.textLight--text {
  font-size: 14px;
  color: #939fb9;
}
// ==================================================================================================

.mew-component--domain-table {
  border: 1px solid $greyMedium;
  border-radius: 12px;
}

.table-border-bottom {
  border-bottom: 1px solid $greyMedium;
}

.table-border-top {
  border-top: 1px solid $greyMedium;
}
</style>
