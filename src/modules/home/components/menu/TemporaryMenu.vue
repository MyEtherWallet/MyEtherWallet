<template>
  <div class="d-flex align-center">
    <ul :key="menuResetKey" class="pl-0 d-flex">
      <li
        v-for="(m, key) in menus"
        :key="key"
        class="list-style-type--none d-flex align-center"
      >
        <div v-if="m.sub" class="menu-block">
          <div class="white--text d-flex align-center">
            <div>{{ m.label }}</div>
            <v-icon class="closed title">mdi-chevron-down</v-icon>
            <v-icon class="opened title">mdi-chevron-up</v-icon>
          </div>
          <div class="sub-menu">
            <ul class="px-0 py-4">
              <li
                v-for="(sm, skey) in m.sub"
                :key="skey"
                class="list-style-type--none"
                @click="menuResetKey++"
              >
                <div class="sub-menu-title font-weight-bold py-1 px-6">
                  {{ sm.label }}
                </div>

                <ul class="pl-0">
                  <li v-for="(ssm, sskey) in sm.sub" :key="sskey">
                    <router-link class="py-1 px-6" :to="ssm.to">
                      {{ ssm.label }}
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    menuResetKey: 1,
    menus: [
      {
        label: 'Wallet actions',
        sub: [
          {
            label: 'Popular actions',
            sub: [
              {
                label: 'Send transaction',
                to: { name: 'SendTX', query: {} }
              },
              {
                label: 'Explore Dapps',
                to: { name: 'DappsCenter', query: {} }
              },
              {
                label: 'Swap tokens',
                to: { name: 'Swap', query: {} }
              },
              {
                label: 'Sign message',
                to: { name: 'SignMessage', query: {} }
              }
            ]
          },
          {
            label: 'More actions',
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
      }
    ]
  }),
  methods: {}
};
</script>

<style lang="scss" scoped>
.menu-block {
  position: relative;
  .closed {
    display: block;
    color: white;
  }
  .opened {
    display: none;
    color: white;
  }
  &:hover {
    .sub-menu {
      opacity: 1;
      pointer-events: all;
    }
    .closed {
      display: none;
    }
    .opened {
      display: block;
    }
  }
}
.sub-menu {
  pointer-events: none;
  transition: all 0.2s ease;
  opacity: 0;
  position: absolute;
  padding-top: 20px;
  top: 21px;
  left: 0;
  z-index: 9;
  > ul {
    list-style-type: none;
    position: relative;
    background-color: white;
    border-radius: 5px;
    min-width: 210px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    &::before {
      position: absolute;
      top: -7px;
      left: 40px;
      content: '';
      width: 0px;
      height: 0px;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid white;
    }

    li {
      list-style-type: none;
    }

    > li:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .sub-menu-title {
    font-size: 16px;
  }
  a {
    display: block;
    color: var(--v-text_default-base);
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
}
</style>
