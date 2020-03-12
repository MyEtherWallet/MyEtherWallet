<template>
  <div class="mobile-menu-content">
    <div class="menu-content-header">
      <a
        v-if="false"
        href="https://ccswap.myetherwallet.com/#/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="buy-eth">
          <img src="@/assets/images/icons/buy-eth.svg" alt />
          <div class="font-reset-disabled">
            {{ $t('common.dont-have-eth') }}
          </div>
        </div>
      </a>
      <router-link to="/" @click.native="closeMenu">
        <img src="@/assets/images/short-hand-logo-web.png" width="120" />
      </router-link>

      <mobile-menu-button
        :ismenuopen="true"
        class="ml-auto"
        @click.native="closeMenu"
      />
    </div>
    <div v-if="account.address" class="interface-menu-content-block">
      <mobile-balance-block v-if="false" class="mb-2" />
      <mobile-network-block v-if="false" :block-number="blockNumber" />
      <interface-mobile-menu :close-menu="closeMenu" />
    </div>

    <div v-if="!account.address" class="no-logon-content-block">
      <router-link to="/access-my-wallet" @click.native="closeMenu">
        <b-button variant="outline-primary" class="login-button">
          <div class="font-reset-disabled">{{ $t('common.wallet.login') }}</div>
        </b-button>
      </router-link>

      <div class="get-wallet font-reset-disabled">
        {{ $t('common.wallet.no-wallet') }}
        <router-link
          class="font-reset-disabled"
          to="/create-wallet"
          @click.native="closeMenu"
        >
          {{ $t('common.wallet.free-wallet') }}</router-link
        >
      </div>
    </div>

    <div class="all-menu-content-block">
      <div class="font-reset-disabled mb-5">
        <customer-support mobile-menu />
      </div>
      <div
        v-if="account.address"
        class="font-reset-disabled mb-5"
        @click="opensettings"
      >
        <div>{{ $t('common.settings') }}</div>
      </div>
      <div class="font-reset-disabled mb-5" @click="languageMenu">
        <div>{{ $t('common.language') }}</div>
      </div>
      <div
        v-if="account.address"
        class="font-reset-disabled logout"
        @click="
          logout();
          closeMenu();
        "
      >
        <div>{{ $t('common.logout') }}</div>
      </div>
    </div>
    <div class="space-buffer"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MobileMenuButton from '../MobileMenuButton';
import InterfaceMobileMenu from '@/layouts/InterfaceLayout/components/InterfaceMobileMenuComponent';
import MobileBalanceBlock from '../MobileBalanceBlock';
import MobileNetworkBlock from '../MobileNetworkBlock';
import CustomerSupport from '@/components/CustomerSupport';

export default {
  components: {
    'mobile-menu-button': MobileMenuButton,
    'interface-mobile-menu': InterfaceMobileMenu,
    'mobile-balance-block': MobileBalanceBlock,
    'mobile-network-block': MobileNetworkBlock,
    'customer-support': CustomerSupport
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
    closeMenu: {
      type: Function,
      default: function() {}
    },
    languageMenu: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('main', ['account', 'blockNumber'])
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MobileMenuContent.scss';
</style>
