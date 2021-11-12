<template>
  <v-sheet color="greyLight" class="border-radius--5px">
    <div v-if="isAlert" class="pa-5">
      <div v-if="message.title !== ''" class="d-flex align-center mb-2">
        <v-icon color="textDark" class="mr-1 ml-n1">
          mdi-alert-circle-outline
        </v-icon>
        <div class="textDark--text font-weight-bold">
          {{ message.title }}
        </div>
      </div>
      <div v-if="message.subtitle !== ''" class="textLight--text">
        {{ message.subtitle }}
      </div>
      <slot></slot>
      <slot name="expansion"></slot>
    </div>
    <div v-else :class="['text-center textLight--text', containerPadding]">
      <div class="mew-heading-3 pb-1">{{ message.title }}</div>
      <div class="mew-body">
        {{ message.subtitle }}
        <span class="redPrimary--text">{{ message.subtitleError }}</span>
      </div>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: 'WalletUserMsgBlock',
  props: {
    message: {
      type: Object,
      default: () => {}
    },
    isAlert: {
      type: Boolean,
      default: true
    },
    containerPadding: {
      type: String,
      default: 'pa-4'
    }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
