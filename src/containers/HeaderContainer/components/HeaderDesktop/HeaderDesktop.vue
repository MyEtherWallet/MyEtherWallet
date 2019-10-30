<template>
  <div class="light-blue darken-4">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <v-img src="@/assets/images/common/logo-light.png" max-width="130" />

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-menu open-on-hover bottom offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text dark class="mx-3" v-on="on">
                How it works
              </v-btn>
            </template>
          </v-menu>
          <v-menu open-on-hover bottom offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text dark v-on="on">
                About<MenuOpenArrow
              /></v-btn>
            </template>
            <div class="white">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Single-line item</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Two-line item</v-list-item-title>
                  <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
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
          <v-menu open-on-hover bottom offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-3" text dark v-on="on">
                Tools<MenuOpenArrow
              /></v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>aaaa</v-list-item-title>
                <v-list-item-title>bbbb</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu open-on-hover bottom offset-y>
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

export default {
  name: 'HeaderDesktop',
  components: {
    MenuOpenArrow
  },
  data: () => ({
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

<style lang="scss" scoped></style>
