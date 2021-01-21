<template>
  <div class="mew-component--wallet-menu-mobile">
    <v-overlay :value="value" opacity="0.95">
      <div style="overflow-y: auto">
        <v-btn class="exit" x-large icon @click="$emit('input')">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>

        <ul class="menu-content">
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
    </v-overlay>
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
            to: { name: 'DappsCenter' }
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

<style scoped lang="scss">
.exit {
  position: fixed;
  top: 10px;
  right: 10px;
}

.menu-content {
  li:first-child {
    .menu-divider {
      display: none;
    }
  }
}

.menu-divider {
  width: 60px;
  margin: 30px auto;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
}

h2.click-effect:active {
  font-size: 30px;
  color: yellow;
  transition: all 0.1s ease;
}

h5.click-effect:active {
  font-size: 20px;
  color: yellow;
  transition: all 0.1s ease;
}
</style>

<style lang="scss">
.mew-component--wallet-menu-mobile .v-overlay__content {
  padding: 100px 0;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
}
</style>
