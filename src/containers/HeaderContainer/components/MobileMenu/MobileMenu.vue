<template>
  <div class="mobile-menu">
    <mobile-language-selector
      v-show="!isMewCx"
      :open="langSelectorOpen"
      @isopen="langSelectorOpen = false"
      @currentlang="langChange"
      @currentflag="flagChange"
    />

    <!-- Mobile menu header (STARTS) -->
    <div
      :class="!isOnTop && !isMenuOpen ? 'small-menu' : ''"
      class="mobile-menu-header"
    >
      <router-link
        to="/"
        aria-label="Home"
        @click.native="
          scrollTop();
          isMenuOpen = false;
        "
      >
        <div
          :class="!isOnTop && !isMenuOpen ? 'small-menu' : ''"
          class="logo-image--container"
        >
          <img
            :src="require(`@/assets/images/short-hand-logo-${buildType}.png`)"
            class="logo"
            alt
          />
        </div>
      </router-link>
      <div class="mobile-menu-button--container">
        <a
          href="https://ccswap.myetherwallet.com/#/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="buy-eth">
            <img src="@/assets/images/icons/buy-eth.svg" alt />
            <p>{{ $t('common.buy-eth') }}</p>
          </div>
        </a>
        <mobile-menu-button :ismenuopen="false" @click.native="openMenu" />
      </div>
    </div>
    <!-- Mobile menu header (ENDS) -->

    <div
      :class="isMenuOpen ? 'menu-open' : ''"
      class="mobile-menu-shadow-backdrop"
    ></div>

    <div
      class="mobile-menu-content-container"
      :class="isMenuOpen ? 'menu-open' : ''"
    >
      <mobile-menu-content
        :close-menu="closeMenu"
        :logout="logout"
        :opensettings="opensettings"
        :language-menu="languageMenuOpen"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MobileMenuContent from './components/MobileMenuContent';
import MobileMenuButton from './components/MobileMenuButton';
import MobileLanguageSelector from './components/MobileLanguageSelector';
import { Misc } from '@/helpers';
import supportedLang from '../../supportedLang';

export default {
  components: {
    'mobile-menu-content': MobileMenuContent,
    'mobile-menu-button': MobileMenuButton,
    'mobile-language-selector': MobileLanguageSelector
  },
  props: {
    opensettings: {
      type: Function,
      default: function() {}
    },
    logout: {
      type: Function,
      default: function() {}
    },
    buildType: {
      type: String,
      default: 'web'
    }
  },
  data() {
    const isMewCx = Misc.isMewCx();
    return {
      localGasPrice: '10',
      balance: 0,
      isOnTop: true,
      isMenuOpen: false,
      isHomePage: true,
      langSelectorOpen: false,
      currentLang: 'English',
      currentFlag: 'en',
      isMewCx: isMewCx,
      supportedLanguages: supportedLang
    };
  },
  computed: {
    ...mapState(['account', 'blockNumber', 'locale'])
  },
  watch: {
    $route(newVal) {
      if (newVal.path.includes('interface')) {
        this.isHomePage = false;
      } else {
        this.isHomePage = true;
      }
    },
    locale() {
      this.getCurrentLang();
    }
  },
  mounted() {
    this.getCurrentLang();

    window.onscroll = () => {
      this.onPageScroll();
    };
  },
  methods: {
    languageMenuOpen() {
      this.langSelectorOpen = !this.langSelectorOpen;
    },
    getCurrentLang() {
      const storedLocale = this.supportedLanguages.find(item => {
        return item.langCode === this.locale;
      });

      this._i18n.locale = this.locale;
      this.currentFlag = storedLocale.flag;
      this.currentLang = storedLocale.name;
    },

    langChange(data) {
      this.currentLang = data;
    },
    flagChange(data) {
      this.currentFlag = data;
    },
    scrollTop() {
      window.scrollTo(0, 0);
    },
    onPageScroll() {
      const topPos = this.$root.$el.getBoundingClientRect().top;
      this.isPageOnTop = !(topPos < -150);
      if (topPos < -150) {
        this.isOnTop = false;
      } else {
        this.isOnTop = true;
      }
    },
    openMenu() {
      this.isMenuOpen = true;
      const x = document.getElementsByTagName('BODY')[0];
      x.classList.add('overflow--hidden');

      const y = document.querySelector('.mobile-menu-content-container');
      y.scrollTo(0, 0);
    },
    closeMenu() {
      this.isMenuOpen = false;
      const x = document.getElementsByTagName('BODY')[0];
      x.classList.remove('overflow--hidden');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileMenu.scss';
</style>
