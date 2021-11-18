<template>
  <div class="mew-component--home--eth-blocks backgroundGrey py-15">
    <v-container>
      <v-row>
        <v-col class="pa-0" cols="12" md="6">
          <v-row style="max-width: 520px; margin: 0 auto">
            <v-col
              v-for="(b, key) in blocksFiltered"
              :key="key"
              style="padding: 14px"
              cols="6"
              sm="4"
              class="block-card-container"
            >
              <div class="pa-4 block-card white">
                <img :src="b.img" alt="Eth Block" style="width: 100%" />
                <div class="mt-3 font-weight-bold mew-label">{{ b.title }}</div>
                <div class="filled-block"></div>
                <div class="filled-block"></div>
              </div>
            </v-col>
          </v-row>
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
export default {
  name: 'HomeEthBlocks',
  components: {},
  data: () => ({
    blocks: [
      {
        title: 'Block #42',
        img: require('@/assets/images/icons/nft/eth-block/block-2.jpeg')
      },
      {
        title: 'Block #2,734,221',
        img: require('@/assets/images/icons/nft/eth-block/block-1.jpeg')
      },
      {
        title: 'Block #7,351',
        img: require('@/assets/images/icons/nft/eth-block/block-3.jpeg')
      },
      {
        title: 'Block #745',
        img: require('@/assets/images/icons/nft/eth-block/block-6.jpeg')
      },
      {
        title: 'Block #453,551',
        img: require('@/assets/images/icons/nft/eth-block/block-5.jpeg')
      },
      {
        title: 'Block #1,000',
        img: require('@/assets/images/icons/nft/eth-block/block-4.jpeg')
      }
    ]
  }),
  computed: {
    blocksFiltered() {
      if (this.$vuetify.breakpoint.xs) return this.blocks.slice(0, 2);
      if (this.$vuetify.breakpoint.sm) return this.blocks.slice(0, 3);
      return this.blocks;
    }
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
