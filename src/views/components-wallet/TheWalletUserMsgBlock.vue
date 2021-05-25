<template>
  <v-sheet color="tableHeader" class="pa-5 border-radius--5px">
    <div v-if="message.title !== ''" class="d-flex align-center mb-2">
      <v-icon color="titlePrimary" class="mr-1 ml-n1">
        mdi-alert-circle-outline
      </v-icon>
      <div class="titlePrimary--text font-weight-bold">{{ message.title }}</div>
    </div>
    <div v-if="message.subtitle !== ''" class="textPrimaryModule--text">
      {{ message.subtitle }}
    </div>
    <slot></slot>
    <slot name="expansion"></slot>
  </v-sheet>
</template>

<script>
export default {
  name: 'WalletUserMsgBlock',
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
