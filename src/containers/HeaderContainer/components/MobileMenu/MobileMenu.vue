<template>
  <div class="mobile-menu">
    <settings-modal
      v-if="wallet !== null"
      ref="settings"
      :gas-price="gasPrice"
    />
    <logout-modal ref="logout" />

    <!-- Mobile menu header ************************************ -->
    <div
      :class="!isOnTop && !isMenuOpen ? 'small-menu' : ''"
      class="mobile-menu-header"
    >
      <router-link
        to="/"
        @click.native="
          scrollTop();
          isMobileMenuOpen = false;
        "
      >
        <div
          :class="!isOnTop && !isMenuOpen ? 'small-menu' : ''"
          class="logo-image--container"
        >
          <img class="logo" src="~@/assets/images/short-hand-logo.png" />
          <img class="beta" src="~@/assets/images/beta.png" />
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
        <div v-if="account.address" class="mobile-address-block--container">
          <mobile-address-block />
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
            <a
              href="https://kb.myetherwallet.com"
              target="_blank"
              @click="isMenuOpen = false"
            >
              <div class="menu-link-block">
                <div>{{ $t('common.faqs') }}</div>
                <i class="fa fa-angle-right" aria-hidden="true"></i></div
            ></a>
          </li>
          <li>
            <div class="menu-link-block">
              <div>Language</div>
              <i class="fa fa-angle-right" aria-hidden="true"></i>
              <mobile-language-selector />
            </div>
          </li>
          <li v-if="account.address">
            <div class="menu-link-block" @click="openSettings">
              <div>Settings</div>
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </div>
          </li>
        </ul>
        <div v-if="account.address" class="logout-button" @click="logout">
          <button>Logout</button>
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
import SettingsModal from '@/components/SettingsModal';
import LogoutModal from '@/components/LogoutModal';
import MobileLanguageSelector from './components/MobileLanguageSelector';

export default {
  components: {
    'logout-modal': LogoutModal,
    'mobile-menu-button': MobileMenuButton,
    'mobile-address-block': MobileAddressBlock,
    'settings-modal': SettingsModal,
    'mobile-language-selector': MobileLanguageSelector
  },
  data() {
    return {
      isOnTop: true,
      isMenuOpen: false,
      isHomePage: true
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet',
      online: 'online',
      web3: 'web3',
      account: 'account'
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
    // On load, if page is not on top, apply small menu and show scroll top button
    //this.onPageScroll();

    // On scroll,  if page is not on top, apply small menu and show scroll top button
    window.onscroll = () => {
      console.log('Mobile Menu scroll detected !!!');
      this.onPageScroll();
    };
  },
  created() {},
  methods: {
    openSettings() {
      this.$refs.settings.$refs.settings.$on('hidden', () => {
        this.isMenuOpen = false;
      });
      this.$refs.settings.$refs.settings.show();
    },
    scrollTop() {
      window.scrollTo(0, 0);
    },
    logout() {
      this.$refs.logout.$refs.logout.show();
      this.$refs.logout.$refs.logout.$on('hidden', () => {
        this.isMenuOpen = false;
      });
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
