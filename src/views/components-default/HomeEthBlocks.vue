<template>
  <div class="mew-component--home--eth-blocks backgroundGrey py-15">
    <v-container>
      <v-row>
        <v-col class="pa-0" cols="12" md="6">
          <div style="max-width: 520px; margin: 0 auto">
            <img
              class="d-lg-none d-md-none d-inline"
              width="100%"
              :src="three"
            />
            <img
              class="d-lg-inline d-md-inline d-none"
              width="100%"
              :src="six"
            />
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="d-flex align-center justify-center"
          :class="$vuetify.breakpoint.smAndDown ? 'mt-8' : ''"
        >
          <div style="max-width: 370px">
            <div class="mew-subtitle mb-7">Home of ETH Block NFTs!</div>
            <div>
              ETH Blocks is an NFT series representing mined Ethereum blocks and
              their properties. Whether it's a special block number, the block
              of your first transaction, or a block that contains a transaction
              with a special message. Own a part of history with ETH Blocks by
              MEW.
            </div>
            <mew-button
              :has-full-width="$vuetify.breakpoint.smAndDown"
              class="mt-8"
              btn-size="xlarge"
              title="Access your wallet to Mint"
              @click.native="
                $router.push({
                  name: 'EthBlocks',
                  params: {}
                })
              "
            ></mew-button>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ethBlocksThree from '@/assets/images/icons/eth-blocks-3.png';
import ethBlocksSix from '@/assets/images/icons/eth-blocks-6.png';
export default {
  name: 'HomeEthBlocks',
  components: {},
  data() {
    return {
      three: ethBlocksThree,
      six: ethBlocksSix
    };
  }
};
</script>

<style lang="scss" scoped>
.block-card-container {
  &:nth-child(even) .block-card {
    box-shadow: 0 15px 30px #cecece;
  }
  &:nth-child(odd) .block-card {
    box-shadow: 0 5px 18px #e4e4e4;
  }
}
.block-card {
  border-radius: 20px;
}
.filled-block {
  background-color: #ededed;
  margin-top: 4px;
  height: 10px;
  width: 100%;
  border-radius: 5px;
}
</style>
