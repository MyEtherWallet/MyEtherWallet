<template>
  <div>
    <v-overlay :value="value" opacity="0.8">
      <v-btn class="exit" x-large icon @click="$emit('input')">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>

      <ul>
        <li v-for="(m, k) in menu" :key="k" class="my-8">
          <h2 v-if="!m.to" class="text-center">{{ m.label }}</h2>
          <h2 v-else class="text-center" @click="pushRoute(m.to)">
            {{ m.label }}
          </h2>

          <ul>
            <li v-for="(s, sk) in m.sub" :key="sk" class="my-3">
              <h3 class="text-center font-weight-bold" @click="pushRoute(s.to)">
                {{ s.label }}
              </h3>
            </li>
          </ul>
        </li>
      </ul>
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
</style>
