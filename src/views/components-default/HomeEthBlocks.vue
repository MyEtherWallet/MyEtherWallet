<template>
  <div class="mew-component--home--eth-blocks backgroundGrey py-15">
    <v-container>
      <v-row>
        <v-col class="pa-0" cols="12" md="6">
          <div style="max-width: 520px; margin: 0 auto">
            <img
              v-lazy="three"
              class="d-lg-none d-md-none d-inline"
              width="100%"
            />
            <img
              v-lazy="six"
              class="d-lg-inline d-md-inline d-none"
              width="100%"
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
            <div class="mew-subtitle mb-7">
              {{
                $t('home.eth-blocks.title') | lokalise('home.eth-blocks.title')
              }}
            </div>
            <div>
              {{
                $t('home.eth-blocks.description')
                  | lokalise('home.eth-blocks.description')
              }}
            </div>
            <mew-button
              :has-full-width="$vuetify.breakpoint.smAndDown"
              class="mt-8"
              btn-size="xlarge"
              :title="
                $t('home.eth-blocks.btn-text')
                  | lokalise('home.eth-blocks.btn-text')
              "
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
import ethBlocksThree from '@/assets/images/icons/eth-blocks-3.jpg';
import ethBlocksSix from '@/assets/images/icons/eth-blocks-6.jpg';
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
