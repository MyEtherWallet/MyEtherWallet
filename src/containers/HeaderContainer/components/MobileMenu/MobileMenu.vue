<template>
  <div class="mobile-menu">
    <mobile-language-selector
      :open="langSelectorOpen"
      @isopen="langSelectorOpen = false"
      @currentlang="langChange"
      @currentflag="flagChange"
    />

    <!-- Mobile menu header ************************************ -->
    <div
      :class="!isOnTop && !isMenuOpen ? 'small-menu' : ''"
      class="mobile-menu-header"
    >
      <router-link
        to="/"
        @click.native="
          scrollTop();
          isMenuOpen = false;
        "
      >
        <div
          :class="!isOnTop && !isMenuOpen ? 'small-menu' : ''"
          class="logo-image--container"
        >
          <img class="logo" src="~@/assets/images/short-hand-logo.png" />
        </div>
      </router-link>
      <div class="mobile-menu-button--container">
        <mobile-menu-button
          :ismenuopen="isMenuOpen"
          @click.native="isMenuOpen = !isMenuOpen"
        />
      </div>
    </div>
    <!-- Mobile menu header ************************************ -->
    <!-- Mobile menu shadow backdrop ************************************ -->
    <div
      :class="isMenuOpen ? 'menu-open' : ''"
      class="mobile-menu-shadow-backdrop"
    ></div>
    <!-- Mobile menu shadow backdrop ************************************ -->
    <!-- Mobile menu content ************************************ -->
    <div
      :class="isMenuOpen ? 'menu-open' : ''"
      class="mobile-menu-content--container"
    >
      <div class="mobile-menu-content">
        <div v-if="account.address" class="block--container">
          <mobile-balance-block />
          <mobile-network-block :block-number="blockNumber" />
        </div>
        <ul>
          <li>
            <router-link
              to="/"
              @click.native="
                scrollTop();
                isMenuOpen = false;
              "
            >
              <div class="menu-link-block">
                <div>{{ $t('header.home') }}</div>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
              </div>
            </router-link>
          </li>
          <li v-if="isHomePage">
            <router-link to="/#about-mew" @click.native="isMenuOpen = false">
              <div class="menu-link-block">
                <div>{{ $t('header.about') }}</div>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
              </div>
            </router-link>
          </li>
          <li>
            <router-link to="/#faqs" @click.native="isMenuOpen = false">
              <div class="menu-link-block">
                <div>{{ $t('common.faqs') }}</div>
                <i class="fa fa-angle-right" aria-hidden="true"></i>
              </div>
            </router-link>
          </li>
          <li>
            <div
              class="menu-link-block"
              @click="langSelectorOpen = !langSelectorOpen"
            >
              <div>{{ $t('common.language') }}</div>
              <div class="selected-lang">
                <div>{{ currentLang }}</div>
                <img
                  :src="require(`@/assets/images/flags/${currentFlag}.svg`)"
                />
              </div>
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </div>
          </li>
          <li v-if="account.address">
            <div class="menu-link-block" @click="opensettings">
              <div>{{ $t('common.settings') }}</div>
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </div>
          </li>
        </ul>
        <div v-if="account.address" class="logout-button" @click="logout">
          <button>{{ $t('common.logout') }}</button>
        </div>
      </div>
    </div>
    <!-- Mobile menu content ************************************ -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MobileMenuButton from './components/MobileMenuButton';
import MobileAddressBlock from './components/MobileAddressBlock';
import MobileBalanceBlock from './components/MobileBalanceBlock';
import MobileNetworkBlock from './components/MobileNetworkBlock';
import MobileLanguageSelector from './components/MobileLanguageSelector';

export default {
  components: {
    'mobile-menu-button': MobileMenuButton,
    'mobile-address-block': MobileAddressBlock,
    'mobile-balance-block': MobileBalanceBlock,
    'mobile-network-block': MobileNetworkBlock,
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
    }
  },
  data() {
    return {
      localGasPrice: '10',
      balance: 0,
      isOnTop: true,
      isMenuOpen: false,
      isHomePage: true,
      langSelectorOpen: false,
      currentLang: 'English',
      currentFlag: 'en'
    };
  },
  computed: {
    ...mapGetters({
      account: 'account',
      blockNumber: 'blockNumber'
    })
  },
  watch: {
    $route(newVal) {
      if (newVal.path.includes('interface')) {
        this.isHomePage = false;
      } else {
        this.isHomePage = true;
      }
    }
  },
  mounted() {
    window.onscroll = () => {
      this.onPageScroll();
    };
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileMenu.scss';
</style>
