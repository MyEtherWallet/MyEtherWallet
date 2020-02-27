<template>
  <div class="light-blue darken-4">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <router-link :to="{ name: 'Home', query: {} }">
          <v-img src="@/assets/images/icons/mew/logo-mew.png" max-width="130" />
        </router-link>
        <v-spacer></v-spacer>

        <div>
          <v-btn
            class="mx-3 white--text"
            depressed
            text
            :ripple="false"
            to="/how-it-works"
            >How it works</v-btn
          >
          <v-menu open-on-hover bottom offset-y transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text :ripple="false" v-on="on">
                About us
                <MenuOpenArrow />
              </v-btn>
            </template>
            <v-list min-width="200px" class="pa-5">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="subtitle-2 font-weight-regular">
                    <router-link
                      class="text-decoration--none"
                      to="/about-us/company"
                      >Company</router-link
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="subtitle-2 font-weight-regular">
                    <router-link
                      class="text-decoration--none"
                      to="/about-us/team"
                      >Team</router-link
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="subtitle-2 font-weight-regular">
                    <a
                      class="text-decoration--none"
                      href="https://www.mewtopia.com/"
                      target="_blank"
                      >MEWtopia</a
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="false" class="caption"
                    >Get help from our support team!</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu open-on-hover bottom offset-y transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text :ripple="false" v-on="on">
                Tools
                <MenuOpenArrow />
              </v-btn>
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
                          :src="icons.ensDebugger"
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
          <v-btn class="mx-3" text :ripple="false">Support</v-btn>
        </div>

        <v-spacer></v-spacer>

        <v-btn class="white--text" large depressed outlined>
          <v-img
            src="@/assets/images/icons/light/white/icon-buy-eth-white.svg"
            class="mr-1 ml-n1"
          />Buy ETH
        </v-btn>
      </v-app-bar>
    </v-container>
  </div>
</template>

<script>
import MenuOpenArrow from '@/components/Common/MenuOpenArrow';

import wallet from '@/assets/images/icons/light/grey/icon-wallet-grey.svg';
import send from '@/assets/images/icons/light/grey/icon-send-grey.svg';
import message from '@/assets/images/icons/light/grey/icon-message-grey.svg';
import eth from '@/assets/images/currencies/eth/icon-eth-grey.svg';

import grabber from '@/assets/images/icons/light/grey/icon-grabber-grey.svg';
import privatekey from '@/assets/images/icons/light/grey/icon-private-key-grey.svg';
import ensDebugger from '@/assets/images/icons/light/grey/icon-ens-debugger-grey.svg';
import sha3 from '@/assets/images/icons/light/grey/icon-sha3-grey.svg';
import convert from '@/assets/images/icons/light/grey/icon-convert-grey.svg';

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
      ensDebugger: ensDebugger,
      sha3: sha3,
      convert: convert
    }
  })
};
</script>

<style lang="scss" scoped>
.theme--dark.v-btn:hover::before,
.theme--dark.v-btn::before {
  opacity: 0;
}
</style>
