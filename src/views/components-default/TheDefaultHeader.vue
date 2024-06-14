<template>
  <div class="header" :style="{ top: `${topOffset}px` }">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div
            :class="[
              inAccessOrCreate ? 'fixed' : '',
              'header__wrapper d-flex align-items-center justify-content-between js-header'
            ]"
          >
            <a href="/" class="header__logo">
              <logo-component v-if="showDark" />
              <img
                v-else
                src="@/assets/images/icons/logo-mew.png"
                width="113px"
                height="32px"
              />
            </a>
            <div class="header__menu">
              <a
                href="https://ccswap.myetherwallet.com/"
                target="_blank"
                class="header__menu-link"
                >Buy Crypto</a
              >
              <a
                href="https://www.myetherwallet.com/how-it-works#swap"
                class="header__menu-link"
                >Swap Tokens</a
              >
              <!-- <a href="#" class="header__menu-link">Earn</a> -->
              <div class="header__menu-link header__menu-link--dropdown">
                More features
                <div class="header__menu-dropdown">
                  <div class="header__menu-dropdown-wrap">
                    <!-- <a href="#" class="header__menu-dropdown-link">Bridge</a> -->
                    <a
                      href="https://www.myetherwallet.com/how-it-works#nft"
                      class="header__menu-dropdown-link"
                      >NFT</a
                    >
                    <!-- <a href="#" class="header__menu-dropdown-link">Networks</a> -->
                    <a
                      href="https://www.myetherwallet.com/how-it-works#dapps"
                      class="header__menu-dropdown-link"
                      >DApps</a
                    >
                  </div>
                </div>
              </div>
              <div class="header__menu-link header__menu-link--dropdown">
                Resources
                <div class="header__menu-dropdown">
                  <div class="header__menu-dropdown-wrap">
                    <a
                      href="https://www.myetherwallet.com/blog"
                      target="_blank"
                      class="header__menu-dropdown-link"
                      >Blog</a
                    >
                    <a
                      href="https://help.myetherwallet.com/en/"
                      target="_blank"
                      class="header__menu-dropdown-link"
                      >Help Center</a
                    >
                    <a
                      href="mailto:support@myetherwallet.com"
                      rel="noopener noreferrer"
                      target="_blank"
                      class="header__menu-dropdown-link"
                      >Customer Support</a
                    >
                  </div>
                </div>
              </div>
              <div class="header__menu-link header__menu-link--dropdown">
                Products
                <div class="header__menu-dropdown">
                  <div class="header__menu-dropdown-wrap">
                    <div class="header__menu-products">
                      <a
                        href="https://www.mewwallet.com/"
                        target="_blank"
                        class="header__menu-products-item header__menu-products-item--bg"
                      >
                        <img
                          src="@/assets/images/icons/mewwallet-logo.svg"
                          alt=""
                        />
                        <div>
                          <h6>MEW Mobile App</h6>
                          <p>Mobile wallet</p>
                        </div>
                      </a>
                      <a
                        href="https://www.myetherwallet.com/wallet/access"
                        target="_blank"
                        class="header__menu-products-item header__menu-products-item--bg"
                      >
                        <img src="@/assets/images/icons/mew-logo.svg" alt="" />
                        <div>
                          <h6>MEW Portfolio Manager</h6>
                          <p>Web portfolio interface</p>
                        </div>
                      </a>
                    </div>
                    <div class="header__menu-products">
                      <a
                        href="https://www.enkrypt.com/"
                        target="_blank"
                        class="header__menu-products-item"
                      >
                        <img
                          src="@/assets/images/icons/enkrypt-logo.png"
                          alt=""
                        />
                        <div>
                          <h6>Enkrypt</h6>
                          <p>Browser extension wallet</p>
                        </div>
                      </a>
                      <a
                        href="https://www.ethvm.com/"
                        target="_blank"
                        class="header__menu-products-item"
                      >
                        <img
                          src="@/assets/images/icons/ethvm-logo.svg"
                          alt=""
                        />
                        <div>
                          <h6>ethVM</h6>
                          <p>Blockchain explorer</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a
              href="https://www.myetherwallet.com/wallet/access"
              target="_blank"
              class="header__access-button"
              :style="showAccess"
            >
              Access my wallet
            </a>
            <a
              href="javascript:void(0)"
              class="header__mobile-menu-open"
              @click="openMobileMenu"
            >
              <open-menu />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ScrollMagic from 'scrollmagic';
import { useRoute } from 'vue-router/composables';

import LogoComponent from '@/assets/images/icons/logo-component.vue';
import OpenMenu from '@/assets/images/icons/open-menu.vue';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import { useVuetify } from '@/core/composables/vuetify';

// emits
const emit = defineEmits(['openMobileMenu']);

// injections
const route = useRoute();
const vuetify = useVuetify();

// data
const topOffset = ref(12);

// computed
const showAccess = computed(() =>
  route.value.name === ROUTES_HOME.ACCESS_WALLET.NAME
    ? 'visibility: hidden'
    : ''
);
const offset = computed(() => (vuetify.breakpoint.mdAndDown ? 24 : 12));
const showDark = computed(
  () => topOffset.value !== 12 || inAccessOrCreate.value
);
const inAccessOrCreate = computed(
  () =>
    route.value.path.includes('/access') ||
    route.value.path.includes('/buy-hardware') ||
    route.value.path.includes('/create')
);

// onMounted
onMounted(() => {
  if (!inAccessOrCreate.value) {
    const controller = new ScrollMagic.Controller();
    topOffset.value = inAccessOrCreate.value ? 0 : offset.value;
    new ScrollMagic.Scene({
      triggerElement: '.js-body',
      duration: 52,
      triggerHook: 'onLeave'
    })
      .on('progress', e => {
        topOffset.value = Math.max(
          0,
          offset.value - offset.value * e.progress.toFixed(3)
        );
      })
      .addTo(controller);

    new ScrollMagic.Scene({
      triggerElement: '.js-body',
      offset: offset.value,
      triggerHook: 'onLeave'
    })
      .setClassToggle('.js-header', 'fixed')
      .addTo(controller);
  } else {
    topOffset.value = 0;
  }
});

// methods
const openMobileMenu = () => {
  emit('openMobileMenu');
};
</script>

<style lang="less" scoped>
@import '@/assets/styles/headerStyles/theme.less';

.header {
  height: 75px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 6;

  .container {
    padding-top: 0 !important;
  }
  .col-12 {
    .screen-mobile({
      padding-top: 0 !important;
    });
  }

  .screen-tablet-header({
    height: 80px;
  });

  &__wrapper {
    height: 75px;
    position: relative;

    .screen-tablet-header({
      height: 80px;
    });

    &::after {
      content: '';
      border-radius: 52px;
      background: rgba(255, 255, 255, 0.7);
      box-shadow: 0px 3px 12px -6px rgba(0, 0, 0, 0.32);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      width: calc(~'100% + 32px');
      height: 64px;
      position: absolute;
      left: -16px;
      top: 5px;
      opacity: 0;
      z-index: -1;
      .transition(@property: opacity, @time: 0.3s);

      .screen-tablet-header({
        width: calc(~'100% + 40px');
        height: 72px;
        left: -20px;
        top: 0;
        border-radius: 0;
      });
    }

    &.fixed {
      &::after {
        opacity: 1;
      }
    }
  }

  &__logo {
    display: block;
  }

  &__menu {
    .screen-tablet-header({
      display: none;
    });

    &-link {
      font-weight: 500;
      font-size: 18px;
      line-height: 64px;
      color: @black !important;
      text-decoration: none;
      .transition(@property: color, @time: 0.3s);
      margin-left: 32px;
      display: inline-block;
      position: relative;
      cursor: pointer;

      .screen-desktop-min({
        font-size: 16px;
        margin-left: 20px; 
      });

      &:first-child {
        margin-left: 0;
      }

      &:hover {
        color: rgba(0, 0, 0, 0.5);
      }

      &--dropdown {
        padding-right: 16px;

        &::after {
          content: '';
          width: 11px;
          height: 7px;
          background-image: url("data:image/svg+xml,%3csvg width='11' height='7' viewBox='0 0 11 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.5 0.308105L4.79094 6.43801H6.10171L10.3926 0.308105H8.43959L5.44632 4.5842L2.45305 0.308105H0.5Z' fill='black'/%3e%3c/svg%3e");
          position: absolute;
          right: 0px;
          top: 50%;
          margin-top: -3.5px;
          .transition(@property: opacity, @time: 0.3s);
        }

        &:hover {
          .header__menu-dropdown {
            display: block;
          }

          &::after {
            opacity: 0.5;
          }
        }
      }
    }

    &-dropdown {
      position: absolute;
      display: none;
      padding-top: 2px;
      opacity: 1;
      margin-left: -20px;
      .transition(@property: opacity, @time: 0.3s);

      &.visible {
        display: block;
      }

      &-wrap {
        min-width: 240px;
        padding: 16px 20px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0px 8px 16px -6px rgba(0, 0, 0, 0.32);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
      }

      &-link {
        display: block;
        color: @black !important;
        font-variant-numeric: stacked-fractions;
        font-feature-settings: 'case' on;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        .transition(@property: opacity, @time: 0.3s);
        text-decoration: none;
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          opacity: 0.5;
        }

        .screen-desktop-min({
          font-size: 16px;
        });
      }
    }

    &-products {
      padding: 4px 0 4px 0;
      display: flex;
      justify-content: space-between;
      width: 584px;

      .screen-desktop-large({
        width: 290px;
        display: block;
      });

      &-item {
        width: calc(~'50% - 4px');
        height: 66px;
        padding: 8px;
        display: flex;
        align-items: center;
        text-decoration: none;
        .transition(@property: background-color, @time: 0.3s);
        border-radius: 16px;

        .screen-desktop-large({
          width: calc(~'100%');
        });

        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        img {
          width: 50px;
          border-radius: 16px;
          margin-right: 16px;
        }

        &--bg {
          img {
            background: #fff;
            box-shadow: 0 1.35px 5.4px 0 rgba(0, 0, 0, 0.1);
          }
        }

        h6 {
          color: @black !important;
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          margin: 0 0 4px 0;

          .screen-desktop-min({
            font-size: 16px;
          });
        }

        p {
          color: rgba(0, 0, 0, 0.64);
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          margin: 0;
        }
      }
    }
  }

  &__access-button {
    display: block;
    text-decoration: none;
    padding: 8px 18px 8px 16px;
    border-radius: 24px;
    background-color: @black !important;
    color: @white !important;
    height: 40px;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.6px;
    .transition(@property: opacity, @time: 0.3s);

    &:hover {
      opacity: 0.5;
    }

    .screen-tablet-header({
      display: none;
    });

    .screen-desktop-min({
      font-size: 16px;
    });
  }

  &__mobile-menu {
    &-open {
      display: none;
      text-decoration: none;

      .screen-tablet-header({
        display: block;
      });
    }
  }
}
</style>
