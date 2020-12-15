<template>
  <v-overlay :value="overlay">
    <div class="sub-menu">
      <ul class="px-0 py-4">
        <li v-for="(sm, skey) in m.sub" :key="skey">
          <div>
            {{ sm.label }}
          </div>

          <ul>
            <li v-for="(ssm, sskey) in sm.sub" :key="sskey">
              <router-link :to="ssm.to">
                {{ ssm.label }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: 'MobileMenu',
  components: {},
  data: () => ({
    menuResetKey: 1,
    mewMenuCompany: {
      name: 'Wallet actions',
      items: [
        {
          title: 'Send transction',
          to: '/wallet/dashboard'
        },
        {
          title: 'Explore Dapps',
          to: '/wallet/dashboard'
        },
        {
          title: 'Swap Tokens',
          to: '/wallet/dashboard'
        },
        {
          title: 'Sign message',
          to: '/wallet/dashboard'
        },
        {
          title: 'Watch only address',
          to: '/tools'
        },
        {
          title: 'Send offline helper',
          to: '/tools'
        },
        {
          title: 'Verify message',
          to: '/tools'
        },
        {
          title: 'Convert units',
          to: '/tools'
        }
      ]
    }
  }),
  methods: {}
};
</script>
