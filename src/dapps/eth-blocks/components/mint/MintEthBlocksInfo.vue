<template>
  <!--
    ===================================================
    Eth Blocks Info:
                      ---------
                      |       |
                      |  img  |
                      |       |
                      ---------

                       Title
                     Description
    ===================================================
    -->
  <div class="text-center">
    <v-img src="../../assets/eth-blocks-qrs.svg" height="129" contain />
    <div class="mt-5 mb-2 mew-heading-1">ETH Blocks</div>
    <h4 class="mb-6 textMedium--text">
      Generated a unique QR art-piecebased on your favorite block on the
      blockchain. From block 0 to the latest block, and expanding into the
      future. Let all those nosey people spying on your wallet collectibles
      wonder why you like a specific block!
    </h4>
  </div>
</template>

<script>
export default {
  name: 'MinEthBlocksInfo'
};
</script>
