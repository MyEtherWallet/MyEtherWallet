<template>
  <v-sheet color="tableHeader" class="pa-5 border-radius--10px">
    <div class="d-flex align-center mb-2">
      <v-icon color="titlePrimary" class="mr-1">
        mdi-alert-circle-outline
      </v-icon>
      <div class="titlePrimary--text font-weight-bold">{{ title }}</div>
    </div>
    <div class="textPrimaryModule--text">{{ text }}</div>
    <slot></slot>
  </v-sheet>
</template>

<script>
export default {
  name: 'WalletUserMsgBlock',
  props: {
    title: { default: '', type: String },
    text: { default: '', type: String }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
