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
      { label: 'Dashboard', to: { name: 'Dashboard' } },
      {
        label: 'Send',
        sub: [
          {
            label: 'Send transaction',
            to: { name: 'SendTX' }
          },
          {
            label: 'SendTX',
            to: { name: 'SendOffline' }
          },
          {
            label: 'NFT Manager',
            to: { name: 'NFTManager' }
          }
        ]
      },
      { label: 'Swap', to: { name: 'Swap' } },
      {
        label: 'Dapps',
        sub: [
          {
            label: 'Dapps Center',
            to: { name: 'DappsCenter' }
          },
          {
            label: 'ENS manager',
            to: { name: 'NameManager' }
          },
          {
            label: 'MakerDAO',
            to: { name: 'MakerDAO' }
          },
          {
            label: 'Aave',
            to: { name: 'Aave' }
          },
          {
            label: 'Ambrpay',
            to: { name: 'Ambrpay' }
          },
          {
            label: 'Unstoppable Domain',
            to: { name: 'UnstoppableDomain' }
          }
        ]
      },
      {
        label: 'Contract',
        sub: [
          {
            label: 'Interact with contract',
            to: { name: 'InteractWithContract' }
          },
          {
            label: 'Deploy contract',
            to: { name: 'DeployContract' }
          }
        ]
      },
      { label: 'Sign Message', to: { name: 'SignMessage' } }
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
