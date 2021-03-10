<template>
  <div class="mew-component--landing-page-menu-mobile">
    <mew-button
      class="mobile-menu-button ml-n3"
      color-theme="white"
      btn-style="transparent"
      icon="mdi-text"
      icon-type="mdi"
      icon-align="left"
      style="border-radius: 100% !important; padding: 0"
      @click.native="isOpen = true"
    />

    <v-navigation-drawer
      v-model="isOpen"
      height="100%"
      width="100%"
      absolute
      temporary
      color="expandHeader"
    >
      <v-card>
        <v-toolbar flat color="expandHeader" dark>
          <v-btn class="exit" x-large icon @click="isOpen = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>

          <v-img
            src="@/assets/images/icons/logo-mew.png"
            max-height="36"
            max-width="130"
          />
        </v-toolbar>

        <v-list color="expandHeader" dark>
          <template v-for="(item, index) in menu">
            <v-list-item :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-group
              v-if="item.sub"
              :key="item + '2'"
              prepend-icon=""
              color="expandHeader"
            >
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title
                    class="white--text font-weight-regular mew-body"
                    v-text="item.label"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="child in item.sub"
                :key="child.label"
                dense
                class="pl-4"
                :to="child.to"
              >
                <v-list-item-content>
                  <v-list-item-title
                    class="pl-13 white--text font-weight-regular mew-body"
                    v-text="child.label"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list>
      </v-card>
    </v-navigation-drawer>

    <ul v-if="false" class="menu-content">
      <li v-for="(m, k) in menu" :key="k">
        <div class="menu-divider"></div>

        <h2 v-if="!m.to" class="text-center font-weight-bold">
          {{ m.label }}
        </h2>
        <h2
          v-else
          class="click-effect text-center font-weight-bold"
          @click="pushRoute(m.to)"
        >
          {{ m.label }}
        </h2>

        <ul>
          <li v-for="(s, sk) in m.sub" :key="sk" class="my-4">
            <h5
              class="click-effect text-center font-weight-bold"
              @click="pushRoute(s.to)"
            >
              {{ s.label }}
            </h5>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MobileMenu',
  components: {},
  props: {
    value: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    isOpen: false,
    menu: [
      { label: 'How it works', to: { name: 'HowItWorks' } },
      {
        label: 'Popular',
        sub: [
          {
            label: 'Send transaction',
            to: { name: 'SendTX' }
          },
          {
            label: 'Explore Dapps',
            to: { name: 'Dapps' }
          },
          {
            label: 'Swap tokens',
            to: { name: 'Swap' }
          },
          {
            label: 'Sign message',
            to: { name: 'SignMessage' }
          }
        ]
      },
      {
        label: 'More',
        sub: [
          {
            label: 'Watch only address',
            to: { name: 'Tools', query: { tab: '1' } }
          },
          {
            label: 'Send offline helper',
            to: { name: 'Tools', query: { tab: '2' } }
          },
          {
            label: 'Verify message',
            to: { name: 'Tools', query: { tab: '3' } }
          },
          {
            label: 'Convery units',
            to: { name: 'Tools', query: { tab: '4' } }
          }
        ]
      }
    ]
  }),
  methods: {
    pushRoute(to) {
      if (this.$route.name !== to.name) {
        this.$router.push(to).catch(() => true);
      }
      this.$emit('input');
    }
  }
};
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.mew-component--landing-page-menu-mobile {
  .mobile-menu-button .v-icon.v-icon {
    font-size: 37px;
  }
  .v-list-group__header,
  .v-list-item {
    border-top: 0 !important;
  }
}
</style>
