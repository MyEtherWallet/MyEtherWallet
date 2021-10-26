<template>
  <v-sheet color="transparent" max-width="450px" width="100%">
    <mew-super-button
      class="mb-4"
      btn-mode="small-right-image"
      title="Bitbox"
      :cols-num="6"
      color-theme="basic"
      :right-icon-height="45"
      :right-icon="
        require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
      "
      @click.native="setSelectedBitbox(0)"
    />
    <mew-super-button
      btn-mode="small-right-image"
      title="Bitbox 2"
      :cols-num="6"
      color-theme="basic"
      :right-icon-height="45"
      :right-icon="
        require('@/assets/images/icons/hardware-wallets/icon-bitbox.svg')
      "
      @click.native="setSelectedBitbox(1)"
    />
  </v-sheet>
</template>

<script>
export default {
  props: {
    setSelectedBitbox: {
      default: function () {
        return {};
      },
      type: Function
    }
  }
};
</script>
