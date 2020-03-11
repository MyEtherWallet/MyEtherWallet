<template>
  <div class="account-to-print">
    <div class="top-container">
      <div class="left-section">
        <div class="blockie-contianer">
          <div>
            <blockie
              :address="address"
              class="blockie"
              width="50px"
              height="50px"
            />
          </div>
          <div class="text-container">
            <h3>{{ $t('interface.account-content.header') }}</h3>
            <span> {{ $t('interface.account-content.subheader') }} </span>
          </div>
        </div>
        <div>
          <i18n
            tag="h4"
            path="interface.account-content.warning"
            class="left-text"
          >
            <span slot="safe">{{ $t('interface.account-content.safe') }}</span>
            <span slot="do-not">{{
              $t('interface.account-content.do-not')
            }}</span>
          </i18n>
        </div>
        <div class="link-container">
          <p>
            <img
              :alt="$t('common.support.string')"
              height="15px"
              src="~@/assets/images/icons/support.svg"
            />
            {{ $t('common.support-email') }}
          </p>
          <p>
            <img
              height="15px"
              src="~@/assets/images/icons/web-solution-white.svg"
              alt
            />
            {{ $t('interface.account-content.link2') }}
          </p>
        </div>
      </div>
      <div class="right-section">
        <div class="header-text">
          <b>
            <img
              src="~@/assets/images/short-hand-logo-white.png"
              height="30px"
              alt
            />
            {{ $t('common.mew') }}
          </b>
          <span class="header-line" />
          <span> {{ $t('interface.account-content.paper') }} </span>
        </div>

        <div class="qr-code-container">
          <qrcode :value="address" :options="{ size: 100 }" />
          <div class="text-container">
            <h4 class="uppercase">{{ $t('common.my-addr') }}</h4>
            <span>
              {{ address }}
            </span>
          </div>
        </div>
      </div>
      <img
        src="~@/assets/images/background/404bg.jpg"
        width="100%"
        class="floating-img"
        alt
      />
      <img
        :alt="$t('common.spaceman')"
        src="~@/assets/images/etc/access-spaceman.png"
        width="100%"
        class="floating-spaceman"
      />
    </div>
    <div class="between">
      <div class="text">
        <img height="15px" src="~@/assets/images/icons/scissor.svg" alt />
        {{ $t('common.print-modal.cut') }}
      </div>
      <div class="dash"></div>
    </div>
    <div class="bottom-container">
      <div class="header-container">
        <blockie :address="address" width="55px" height="55px" />
        <div class="header-content">
          <h3 class="uppercase">{{ $t('common.my-addr') }}</h3>
          <p>{{ $t('interface.account-content.subheader') }}</p>
        </div>
      </div>
      <div class="body-container">
        <i18n tag="h3" path="interface.account-content.warning">
          <span slot="safe">{{ $t('interface.account-content.safe') }}</span>
          <span slot="do-not">{{
            $t('interface.account-content.do-not')
          }}</span>
        </i18n>
      </div>
      <div class="my-address-container">
        <div class="text-container">
          <h3 class="uppercase">{{ $t('common.my-addr') }}</h3>
          <p>{{ address }}</p>
        </div>
        <div class="my-address-qrcode">
          <qrcode :value="address" :options="{ size: 120 }" />
        </div>
      </div>
      <div v-if="!!wallet && !wallet.isPubOnly" class="my-priv-container">
        <div class="text-container">
          <h3>{{ $t('interface.account-content.my-priv') }}</h3>
          <p>{{ wallet.getPrivateKeyString() }}</p>
        </div>
        <qrcode
          :value="wallet.getPrivateKeyString()"
          :options="{ size: 120 }"
        />
      </div>
    </div>
    <div class="footer-container">
      <div class="link-container">
        <p>
          <img
            :alt="$t('common.support.string')"
            height="17px"
            src="~@/assets/images/icons/support.svg"
          />
          {{ $t('common.support-email') }}
        </p>
        <p>
          <img
            height="15px"
            src="~@/assets/images/icons/web-solution.svg"
            alt
          />
          {{ $t('interface.account-content.link2') }}
        </p>
      </div>
      <div class="logo-container">
        <img
          :src="require(`@/assets/images/short-hand-logo-${buildType}.png`)"
          height="25px"
          alt
        />
        <p class="border-line"></p>
        <p>{{ $t('interface.account-content.paper') }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import Blockie from '@/components/Blockie';
import { mapState } from 'vuex';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      buildType: BUILD_TYPE
    };
  },
  computed: {
    ...mapState('main', ['wallet'])
  }
};
</script>
<style lang="scss" scoped>
@import 'AccountContentToPrint.scss';
</style>
