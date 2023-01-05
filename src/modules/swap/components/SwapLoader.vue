<template>
  <div class="modules-swap-loader">
    <!-- =============================================================== -->
    <!-- You Give -->
    <!-- =============================================================== -->
    <app-border-container>
      <div class="monospace input-block-title textMedium--text mb-2">
        YOU GIVE
      </div>
      <div class="d-flex align-center">
        <v-skeleton-loader
          width="170px"
          height="40px"
          type="image"
        ></v-skeleton-loader>
        <v-spacer />
        <v-skeleton-loader
          width="120px"
          height="40px"
          type="image"
        ></v-skeleton-loader>
      </div>
      <div class="d-flex align-center justify-space-between mt-3 mb-2">
        <v-skeleton-loader
          width="140px"
          height="20px"
          type="image"
        ></v-skeleton-loader>
        <v-skeleton-loader
          width="100px"
          height="20px"
          type="image"
        ></v-skeleton-loader>
      </div>
    </app-border-container>

    <div class="d-flex align-center justify-center py-2">
      <v-icon color="textDark" size="30px">mdi-swap-vertical</v-icon>
    </div>

    <!-- =============================================================== -->
    <!-- You Receive -->
    <!-- =============================================================== -->
    <app-border-container>
      <div class="monospace input-block-title textMedium--text mb-2">
        YOU RECEIVE
      </div>
      <div class="d-flex align-center">
        <v-skeleton-loader
          width="170px"
          height="40px"
          type="image"
        ></v-skeleton-loader>
        <v-spacer />
        <v-skeleton-loader
          width="120px"
          height="40px"
          type="image"
        ></v-skeleton-loader>
      </div>
      <div class="d-flex align-center justify-space-between mt-3 mb-2">
        <v-skeleton-loader
          width="140px"
          height="20px"
          type="image"
        ></v-skeleton-loader>
        <v-skeleton-loader
          width="100px"
          height="20px"
          type="image"
        ></v-skeleton-loader>
      </div>
    </app-border-container>
  </div>
</template>

<script>
export default {
  name: 'SwapLoader',
  components: {
    AppBorderContainer: () => import('@/core/components/AppBorderContainer'),
    AppWalletBlock: () => import('@/core/components/AppWalletBlock')
  }
};
</script>

<style lang="scss" scoped>
.input-block-title {
  letter-spacing: 2px;
  font-size: 12px;
}
</style>
