<template>
  <div class="light-blue darken-4">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <v-img src="@/assets/images/common/logo-light.png" max-width="130" />

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-menu open-on-hover bottom offset-y transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn text dark class="mx-3" v-on="on">
                How it works
              </v-btn>
            </template>
          </v-menu>
          <v-menu open-on-hover bottom offset-y transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text dark v-on="on">
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
                  <v-list-item-subtitle
                    >Let us show you why you should use
                    MEW.</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>MEWtopia</v-list-item-title>
                  <v-list-item-subtitle>
                    Get help from other enthusiastic users.
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-menu>
          <v-menu open-on-hover bottom offset-y transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text dark v-on="on">
                Tools<MenuOpenArrow
              /></v-btn>
            </template>
            <div class="white pa-5">
              <v-row>
                <v-col>
                  <div class="font-weight-bold text-uppercase">Popular</div>
                  <v-divider></v-divider>
                  <div>
                    <v-list>
                      <v-list-item-group v-model="item" color="primary">
                        <v-list-item>
                          <v-list-item-icon>
                            <v-img :src="icons.wallet" />
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              >View wallet info</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </div>
                </v-col>
                <v-col>
                  <div class="font-weight-bold text-uppercase">Advanced</div>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </div>
          </v-menu>
          <v-menu open-on-hover bottom offset-y transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text dark v-on="on">
                Support
              </v-btn>
            </template>
          </v-menu>
        </v-toolbar-items>

        <v-spacer></v-spacer>

        <v-btn class="white--text" large depressed outlined>
          <v-img
            src="@/assets/images/common/icons/buy-eth.svg"
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

import wallet from '@/assets/images/common/icons/iconset1/wallet.svg';
import eth from '@/assets/images/common/icons/iconset1/eth.svg';

export default {
  name: 'HeaderDesktop',
  components: {
    MenuOpenArrow
  },
  data: () => ({
    icons: {
      wallet: wallet,
      eth: eth
    },
    menuItems: [
      {
        title: 'How it works'
      },
      {
        title: 'About'
      },
      {
        title: 'Tools'
      },
      {
        title: 'Support'
      }
    ]
  })
};
</script>

<style lang="scss" scoped>
.theme--dark.v-btn:hover::before {
  opacity: 0;
}
</style>
