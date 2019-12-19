<template>
  <div class="dapp-container">
    <div>
      <router-link to="/dapps">
        {{ $t('mewcx.dapps') }}
      </router-link>
      >
      <span>
        {{ dapp.name }}
      </span>
    </div>

    <div class="dapp-info-container">
      <div class="dapp-info-header">
        <div class="header-img">
          <img :src="dapp.iconSmallUrl" />
        </div>
        {{ dapp.name }} - {{ dapp.teaser }}
      </div>
      <div class="dapp-info-body">
        <div class="description">
          {{ dapp.description }}
        </div>
        <div class="more-info">
          <img :src="dapp.logoUrl" />
          <div class="dapp-links">
            <a
              v-for="(item, idx) in siteKeys"
              v-show="dapp.sites[item] !== ''"
              :key="idx"
              :href="dapp.sites[item]"
              class="website-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ getText(item) }}
            </a>
          </div>
          <div class="dapp-socials">
            <a
              v-for="(item, idx) in socials"
              v-show="item.url !== ''"
              :key="idx"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i :class="[getFontIcon(item.platform), 'fa fa-lg']" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dapp: {},
      siteKeys: [],
      socials: []
    };
  },
  mounted() {
    this.fetchDapp();
  },
  methods: {
    async fetchDapp() {
      const slug = this.$route.params.slug;
      const dapp = await fetch(
        `https://swap.mewapi.io/proxy?url=https://api.stateofthedapps.com/dapps/${slug}`
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          // eslint-disable-next-line
        console.error(e);
        });
      this.dapp = Object.assign({}, dapp.item);
      this.siteKeys = Object.keys(dapp.item.sites);
      this.socials = dapp.item.socials.map(item => item);
    },
    getText(key) {
      switch (key) {
        case 'androidUrl':
          return 'Open in Android';
        case 'dappUrl':
          return 'Launch DApp';
        case 'iosUrl':
          return 'Open in IOS';
        case 'websiteUrl':
          return 'Open website';
      }
    },
    getFontIcon(key) {
      switch (key) {
        case 'chat':
          return 'fa-comment';
        case 'blog':
          return 'fa-rss';
        default:
          return `fa-${key}`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionDappContainer.scss';
</style>
