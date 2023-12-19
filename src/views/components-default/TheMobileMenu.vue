<template>
  <div class="mobile-menu" :class="{ visible: isOpen }">
    <div class="mobile-menu__wrap">
      <a
        class="mobile-menu__close"
        href="javascript:void(0)"
        @click="closeMobileMenu"
      >
        <close-icon />
      </a>
      <div class="mobile-menu__menu">
        <a
          href="https://ccswap.myetherwallet.com/"
          target="_blank"
          class="mobile-menu__menu-link"
          >Buy Crypto</a
        >
        <a
          href="https://www.myetherwallet.com/how-it-works#swap"
          class="mobile-menu__menu-link"
          >Swap Tokens</a
        >
        <!-- <a href="#" class="mobile-menu__menu-link">Earn</a> -->
        <div
          class="mobile-menu__menu-link mobile-menu__menu-link--dropdown"
          @click="featuresToggle"
        >
          More features
          <div
            class="mobile-menu__menu-dropdown"
            :class="{ open: isFeaturesOpen }"
          >
            <div class="mobile-menu__menu-dropdown-wrap">
              <!-- <a href="#" class="mobile-menu__menu-dropdown-link">Bridge</a> -->
              <a
                href="/how-it-works#nft"
                class="mobile-menu__menu-dropdown-link"
                >NFT</a
              >
              <!-- <a href="#" class="mobile-menu__menu-dropdown-link">Networks</a> -->
              <a
                href="/how-it-works#dapps"
                class="mobile-menu__menu-dropdown-link"
                >DApps</a
              >
            </div>
          </div>
        </div>
        <div
          class="mobile-menu__menu-link mobile-menu__menu-link--dropdown"
          @click="resourcesToggle"
        >
          Resources
          <div
            class="mobile-menu__menu-dropdown"
            :class="{ open: isResourcesOpen }"
          >
            <div class="mobile-menu__menu-dropdown-wrap">
              <a
                href="https://www.mewtopia.com/"
                target="_blank"
                class="mobile-menu__menu-dropdown-link"
                >MEWtopia</a
              >
              <a
                href="https://help.myetherwallet.com/en/"
                target="_blank"
                class="mobile-menu__menu-dropdown-link"
                >Help Center</a
              >
              <a
                href="mailto:support@myetherwallet.com"
                rel="noopener noreferrer"
                target="_blank"
                class="mobile-menu__menu-dropdown-link"
                >Customer Support</a
              >
            </div>
          </div>
        </div>
        <div
          class="mobile-menu__menu-link mobile-menu__menu-link--dropdown"
          @click="productsToggle"
        >
          Products
          <div
            class="mobile-menu__menu-dropdown"
            :class="{ open: isProductsOpen }"
          >
            <div
              class="mobile-menu__menu-dropdown-wrap mobile-menu__menu-dropdown-wrap--no-padding"
            >
              <div class="mobile-menu__menu-products">
                <a
                  href="https://www.mewwallet.com/"
                  target="_blank"
                  class="mobile-menu__menu-products-item mobile-menu__menu-products-item--bg"
                >
                  <img src="@/assets/images/icons/mewwallet-logo.svg" alt="" />
                  <div>
                    <h6>MEW Mobile App</h6>
                    <p>Mobile wallet</p>
                  </div>
                </a>
                <a
                  href="https://www.myetherwallet.com/wallet/access"
                  target="_blank"
                  class="mobile-menu__menu-products-item mobile-menu__menu-products-item--bg"
                >
                  <img src="@/assets/images/icons/mew-logo.svg" alt="" />
                  <div>
                    <h6>MEW Portfolio Manager</h6>
                    <p>Web portfolio interface</p>
                  </div>
                </a>
              </div>
              <div class="mobile-menu__menu-products">
                <a
                  href="https://www.enkrypt.com/"
                  target="_blank"
                  class="mobile-menu__menu-products-item"
                >
                  <img src="@/assets/images/icons/enkrypt-logo.png" alt="" />
                  <div>
                    <h6>Enkrypt</h6>
                    <p>Browser extension wallet</p>
                  </div>
                </a>
                <a
                  href="https://www.ethvm.com/"
                  target="_blank"
                  class="mobile-menu__menu-products-item"
                >
                  <img src="@/assets/images/icons/ethvm-logo.svg" alt="" />
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
        class="mobile-menu__access-button"
        :style="showAccess"
        >Access my wallet</a
      >
    </div>
  </div>
</template>

<script>
import CloseIcon from '@/assets/images/icons/close-icon.vue';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
  
export default {
  components: {
    CloseIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFeaturesOpen: false,
      isResourcesOpen: false,
      isProductsOpen: false
    };
  },
  showAccess() {
      return this.$route.name === ROUTES_HOME.ACCESS_WALLET.NAME
        ? 'visibility: hidden'
        : '';
  },
  methods: {
    closeMobileMenu() {
      this.$emit('closeMobileMenu');
    },
    featuresToggle() {
      this.isFeaturesOpen = !this.isFeaturesOpen;
    },
    resourcesToggle() {
      this.isResourcesOpen = !this.isResourcesOpen;
    },
    productsToggle() {
      this.isProductsOpen = !this.isProductsOpen;
    }
  }
};
</script>

<style lang="less">
@import '@/assets/styles/headerStyles/theme.less';

.mobile-menu {
  display: none;
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  background: @white;
  z-index: 101;

  &.visible {
    display: none;

    .screen-tablet-header({
      display: block;
    });
  }

  &__wrap {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 60px 32px 60px 32px;
    overflow-y: scroll;
  }

  &__close {
    position: absolute;
    right: 16px;
    top: 16px;
    text-decoration: none;
  }

  &__menu {
    &-link {
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      color: @black !important;
      text-decoration: none;
      .transition(@property: color, @time: 0.3s);
      display: block;
      position: relative;
      cursor: pointer;
      margin-bottom: 32px;

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
          top: 8.5px;
          .transition(@property: opacity, @time: 0.3s);
        }

        &:hover {
          &::after {
            opacity: 0.5;
          }
        }
      }
    }

    &-dropdown {
      display: none;
      padding-top: 25px;

      &.open {
        display: block;
      }

      &-wrap {
        width: 100%;
        padding: 16px 20px;

        &--no-padding {
          padding: 0;
        }
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
      }
    }

    &-products {
      width: 100%;

      &-item {
        width: 100%;
        height: 66px;
        padding: 8px;
        display: flex;
        align-items: center;
        text-decoration: none;
        .transition(@property: background-color, @time: 0.3s);
        border-radius: 16px;

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
    .transition(@property: opacity, @time: 0.3s);
    width: 192px;

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
