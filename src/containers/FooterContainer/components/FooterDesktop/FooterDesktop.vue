<template>
  <div class="light-blue darken-4">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <v-img src="@/assets/images/Common/logo-light.png" max-width="130" />

        <v-spacer></v-spacer>

        <div>
          <v-btn class="mx-3" text :ripple="false">
            How it works
          </v-btn>
          <v-menu open-on-hover bottom offset-y transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text :ripple="false" v-on="on">
                About<MenuOpenArrow
              /></v-btn>
            </template>
            <div class="white pa-5">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Company</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Team</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Why MEW</v-list-item-title>
                  <v-list-item-subtitle class="caption"
                    >Let us show you why you should use
                    MEW.</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>MEWtopia</v-list-item-title>
                  <v-list-item-subtitle class="caption">
                    Get help from other enthusiastic users.
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-menu>
          <v-menu open-on-hover bottom offset-y transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text :ripple="false" v-on="on">
                Tools<MenuOpenArrow
              /></v-btn>
            </template>
            <div class="white pa-5">
              <v-row>
                <v-col class="px-6">
                  <div
                    class="font-weight-bold text-uppercase mb-3 mx-2 subtitle-1"
                  >
                    Popular
                  </div>
                  <v-divider></v-divider>
                  <div>
                    <v-list min-width="240" class="px-2">
                      <v-list-item class="px-0">
                        <v-img
                          class="mr-3"
                          :src="icons.wallet"
                          max-width="25"
                        />
                        <div>View wallet info</div>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-img class="mr-3" :src="icons.send" max-width="25" />
                        <div>Send offline helper</div>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-img
                          class="mr-3"
                          :src="icons.message"
                          max-width="25"
                        />
                        <div>Verify message</div>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-img class="mr-3" :src="icons.eth" max-width="25" />
                        <div>Ethereum units</div>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-col>
                <v-col class="px-6">
                  <div
                    class="font-weight-bold text-uppercase mb-3 mx-2 subtitle-1"
                  >
                    Advanced
                  </div>
                  <v-divider></v-divider>
                  <div>
                    <v-list min-width="240" class="px-2">
                      <v-list-item class="px-0">
                        <v-img
                          class="mr-3"
                          :src="icons.grabber"
                          max-width="25"
                        />
                        <div>Data grabber</div>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-img
                          class="mr-3"
                          :src="icons.privatekey"
                          max-width="25"
                        />
                        <div>Mistyped private key</div>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-img
                          class="mr-3"
                          :src="icons.ensdebugger"
                          max-width="25"
                        />
                        <div>ENS debugger</div>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-img class="mr-3" :src="icons.sha3" max-width="25" />
                        <div>SHA3 (Keccak-256)</div>
                      </v-list-item>
                      <v-list-item class="px-0">
                        <v-img
                          class="mr-3"
                          :src="icons.convert"
                          max-width="25"
                        />
                        <div>Convert hex & decimal</div>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-menu>
          <v-btn class="mx-3" text :ripple="false">
            Support
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <v-btn class="white--text" large depressed outlined>
          <v-img
            src="@/assets/images/Common/Icons/buy-eth.svg"
            class="mr-1 ml-n1"
          />
          Buy ETH
        </v-btn>
      </v-app-bar>
    </v-container>
  </div>
</template>

<script>
import MenuOpenArrow from '@/components/Common/MenuOpenArrow';

import wallet from '@/assets/images/Common/Icons/IconSet1/wallet.svg';
import send from '@/assets/images/Common/Icons/IconSet1/send.svg';
import message from '@/assets/images/Common/Icons/IconSet1/message.svg';
import eth from '@/assets/images/Common/Icons/IconSet1/eth.svg';

import grabber from '@/assets/images/Common/Icons/IconSet1/grabber.svg';
import privatekey from '@/assets/images/Common/Icons/IconSet1/privatekey.svg';
import ensdebugger from '@/assets/images/Common/Icons/IconSet1/ensdebugger.svg';
import sha3 from '@/assets/images/Common/Icons/IconSet1/sha3.svg';
import convert from '@/assets/images/Common/Icons/IconSet1/convert.svg';

export default {
  name: 'HeaderDesktop',
  components: {
    MenuOpenArrow
  },
  data: () => ({
    icons: {
      wallet: wallet,
      send: send,
      message: message,
      eth: eth,
      grabber: grabber,
      privatekey: privatekey,
      ensdebugger: ensdebugger,
      sha3: sha3,
      convert: convert
    }
  })
};
</script>

<style lang="scss" scoped>
.theme--dark.v-btn:hover::before {
  opacity: 0;
}
</style>
