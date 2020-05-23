<template>
  <div>
    <v-btn
      depressed
      color="success"
      x-small
      class="mr-1"
      @click="openTxConfirmation = true"
    >
      Open TX confirmation window
    </v-btn>

    <WhiteSheet>
      <TxConfirmation :open="openTxConfirmation" :close="closeTxConfirmation" />
      <InterfaceWrap title="NFT Manager">
        <v-tabs vertical>
          <v-tab>
            <div class="text-transform--initial">Cryptokitties (3)</div>
          </v-tab>
          <v-tab>
            <div class="text-transform--initial">Gods Unchained (2)</div>
          </v-tab>
          <v-tab>
            <div class="text-transform--initial">CryptoFlowers (0)</div>
          </v-tab>
          <v-tab>
            <div class="text-transform--initial">MyCryptoHeroes (1)</div>
          </v-tab>

          <v-tab-item>
            <v-card flat>
              <div class="px-3 mb-5 d-flex align-center justify-space-between">
                <div class="font-weight-bold">CryptoKitties</div>
                <div>Total 3</div>
              </div>
              <div>
                <v-card
                  v-for="(kitty, key) in CryptoKitties"
                  :key="key"
                  flat
                  color="superPrimary"
                >
                  <div
                    class="d-flex align-center mb-2 px-4 justify-space-between"
                  >
                    <div class="d-flex align-center">
                      <img class="mr-5" :src="kitty.image" height="90" />
                      <div>#{{ kitty.number }}</div>
                    </div>
                    <mew-button
                      :has-full-width="false"
                      btn-style="outline"
                      title="Send"
                      button-size="large"
                    />
                  </div>
                </v-card>
              </div>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p>
                  Sed aliquam ultrices mauris. Donec posuere vulputate arcu.
                  Morbi ac felis. Etiam feugiat lorem non metus. Sed a libero.
                </p>

                <p>
                  Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel,
                  lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis
                  non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non
                  nisl sit amet velit hendrerit rutrum.
                </p>

                <p class="mb-0">
                  Phasellus dolor. Fusce neque. Fusce fermentum odio nec arcu.
                  Pellentesque libero tortor, tincidunt et, tincidunt eget,
                  semper nec, quam. Phasellus blandit leo ut odio.
                </p>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p>
                  Sed aliquam ultrices mauris. Donec posuere vulputate arcu.
                  Morbi ac felis. Etiam feugiat lorem non metus. Sed a libero.
                </p>

                <p>
                  Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel,
                  lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis
                  non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non
                  nisl sit amet velit hendrerit rutrum.
                </p>

                <p class="mb-0">
                  Phasellus dolor. Fusce neque. Fusce fermentum odio nec arcu.
                  Pellentesque libero tortor, tincidunt et, tincidunt eget,
                  semper nec, quam. Phasellus blandit leo ut odio.
                </p>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p>
                  Sed aliquam ultrices mauris. Donec posuere vulputate arcu.
                  Morbi ac felis. Etiam feugiat lorem non metus. Sed a libero.
                </p>

                <p>
                  Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel,
                  lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis
                  non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non
                  nisl sit amet velit hendrerit rutrum.
                </p>

                <p class="mb-0">
                  Phasellus dolor. Fusce neque. Fusce fermentum odio nec arcu.
                  Pellentesque libero tortor, tincidunt et, tincidunt eget,
                  semper nec, quam. Phasellus blandit leo ut odio.
                </p>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </InterfaceWrap>
    </WhiteSheet>
  </div>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';
import TxConfirmation from '@/components/Overlays/TxConfirmation';
import Kitty1 from '@/assets/images/temp/cryptokitties1.svg';
import Kitty2 from '@/assets/images/temp/cryptokitties2.svg';
import Kitty3 from '@/assets/images/temp/cryptokitties3.svg';

export default {
  components: { WhiteSheet, InterfaceWrap, TxConfirmation },
  data() {
    return {
      openTxConfirmation: false,
      CryptoKitties: [
        { image: Kitty1, number: '4534' },
        { image: Kitty2, number: '4537' },
        { image: Kitty3, number: '4589' }
      ]
    };
  },
  methods: {
    closeTxConfirmation() {
      this.openTxConfirmation = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-tab {
  justify-content: flex-start;
}
</style>
