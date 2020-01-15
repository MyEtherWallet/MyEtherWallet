<template>
  <div class="mobile-menu-content">
    <div class="menu-content-header">
      <a
        href="https://ccswap.myetherwallet.com/#/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="buy-eth">
          <img src="@/assets/images/icons/buy-eth.svg" alt />
          <div class="font-reset">
            {{ $t('common.dont-have-eth') }}
          </div>
        </div>
      </a>
      <mobile-menu-button
        :ismenuopen="true"
        class="ml-auto"
        @click.native="closeMenu"
      />
    </div>
    <div v-if="account.address" class="interface-menu-content-block">
      <mobile-balance-block class="mb-2" />
      <mobile-network-block :block-number="blockNumber" />
      <interface-mobile-menu :close-menu="closeMenu" class="px-3" />
    </div>

    <div v-if="!account.address" class="no-logon-content-block">
      <router-link to="/access-my-wallet" @click.native="closeMenu">
        <b-button variant="outline-primary" class="login-button">
          <div class="font-reset">Login to access your wallet!</div>
        </b-button>
      </router-link>

      <div class="get-wallet font-reset">
        Don't have a wallet yet?
        <router-link
          class="font-reset"
          to="/create-wallet"
          @click.native="closeMenu"
          >Get your wallet for free!</router-link
        >
      </div>
    </div>

    <div class="all-menu-content-block">
      <div class="font-reset mb-4" @click="languageMenu">
        <i class="fa fa-language" aria-hidden="true"></i>
        <div>Language</div>
      </div>
      <div v-if="account.address" class="font-reset" @click="opensettings">
        <i class="fa fa-cog" aria-hidden="true"></i>
        <div>Settings</div>
      </div>
      <div
        v-if="account.address"
        class="font-reset logout"
        @click="
          logout();
          closeMenu();
        "
      >
        <i class="fa fa-sign-out" aria-hidden="true"></i>
        <div>Logout</div>
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

export default {
  components: {
    'mobile-menu-button': MobileMenuButton,
    'interface-mobile-menu': InterfaceMobileMenu,
    'mobile-balance-block': MobileBalanceBlock,
    'mobile-network-block': MobileNetworkBlock
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
    ...mapState(['account', 'blockNumber'])
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
