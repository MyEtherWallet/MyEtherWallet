<template>
  <div class="mobile-menu">
    <settings-modal
      v-if="wallet !== null"
      ref="settings"
      :gas-price="localGasPrice"
      :address="account.address"
    />
    <logout-modal ref="logout" />
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
            <div class="menu-link-block" @click="openSettings">
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
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import MobileMenuButton from './components/MobileMenuButton';
import MobileAddressBlock from './components/MobileAddressBlock';
import MobileBalanceBlock from './components/MobileBalanceBlock';
import MobileNetworkBlock from './components/MobileNetworkBlock';
import SettingsModal from '@/components/SettingsModal';
import LogoutModal from '@/components/LogoutModal';
import MobileLanguageSelector from './components/MobileLanguageSelector';

export default {
  components: {
    'logout-modal': LogoutModal,
    'mobile-menu-button': MobileMenuButton,
    'mobile-address-block': MobileAddressBlock,
    'mobile-balance-block': MobileBalanceBlock,
    'mobile-network-block': MobileNetworkBlock,
    'settings-modal': SettingsModal,
    'mobile-language-selector': MobileLanguageSelector
  },
  data() {
    return {
      localGasPrice: '10',
      balance: 0,
      blockNumber: 0,
      pollNetwork: '',
      pollAddress: '',
      pollBlock: '',
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
      network: 'network',
      wallet: 'wallet',
      online: 'online',
      web3: 'web3',
      account: 'account',
      gasPrice: 'gasPrice'
    })
  },
  watch: {
    ['account.address']() {
      this.setupOnlineEnvironment();
    },
    gasPrice(val) {
      this.localGasPrice = new BigNumber(val).toString();
    },
    $route(newVal) {
      if (newVal.path.includes('interface')) {
        this.isHomePage = false;
      } else {
        this.isHomePage = true;
      }
    },
    ['account.balance']() {
      this.getBalance();
    },
    ['network']() {
      this.setupOnlineEnvironment();
      // this.getBalance();
    }
  },
  mounted() {
    // On load, if page is not on top, apply small menu and show scroll top button
    //this.onPageScroll();
    // this.setupOnlineEnvironment();
    // On scroll,  if page is not on top, apply small menu and show scroll top button
    window.onscroll = () => {
      this.onPageScroll();
    };
  },
  destroyed() {
    this.clearIntervals();
  },
  methods: {
    langChange(data) {
      this.currentLang = data;
    },
    flagChange(data) {
      this.currentFlag = data;
    },
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
    },
    clearIntervals() {
      clearInterval(this.pollNetwork);
      clearInterval(this.pollBlock);
      clearInterval(this.pollAddress);
    },
    setupOnlineEnvironment() {
      this.clearIntervals();
      if (this.online === true) {
        if (this.account.address) {
          this.getBlock();
          this.pollBlock = setInterval(this.getBlock, 14000);
          this.getBalance();
        }
      }
    },
    getBlock() {
      this.web3.eth
        .getBlockNumber()
        .then(res => {
          this.blockNumber = res;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    },
    getBalance() {
      if (this.account.address) {
        this.web3.eth
          .getBalance(this.account.address.toLowerCase())
          .then(res => {
            this.balance = this.web3.utils.fromWei(res, 'ether');
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileMenu.scss';
</style>
