<template>
  <v-sheet color="tableHeader" class="pa-6 border-radius--5px">
    <div v-if="title !== ''" class="d-flex align-center mb-2">
      <v-icon color="titlePrimary" class="mr-1">
        mdi-alert-circle-outline
      </v-icon>
      <div class="titlePrimary--text font-weight-bold">{{ title }}</div>
    </div>
    <div v-if="text !== ''" class="textPrimaryModule--text">{{ text }}</div>
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
