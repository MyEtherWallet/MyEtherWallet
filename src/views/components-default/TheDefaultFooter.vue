<template>
  <div class="footer pt-7">
    <div class="container">
      <div class="row">
        <div class="col-3">
          <div class="footer__links">
            <a href="https://www.myetherwallet.com/about" @click="trackAboutUs"
              >About us</a
            >
            <a
              href="https://www.myetherwallet.com/careers"
              @click="trackCareers"
              >Careers</a
            >
            <a
              href="https://www.myetherwallet.com/how-it-works"
              @click="trackHowItWorks"
              >How it works</a
            >
            <a href="https://www.myetherwallet.com/team" @click="trackTeam"
              >Team</a
            >
            <a
              href="https://www.myetherwallet.com/advertise-with-us"
              @click="trackAdvertiseWithUs"
              >Advertise With Us</a
            >
          </div>

          <div class="footer__links">
            <a
              href="https://www.myetherwallet.com/privacy-policy"
              @click="trackPrivacy"
              >Privacy</a
            >
            <a
              href="https://www.myetherwallet.com/terms-of-service"
              @click="trackTerms"
              >Terms</a
            >
            <a
              href="https://hackenproof.com/myetherwallet/myetherwallet"
              target="_blank"
              @click="trackBugBounty"
              >Bug Bounty</a
            >
          </div>
        </div>
        <div class="col-3">
          <div class="footer__links">
            <a
              href="https://www.mewwallet.com/"
              target="_blank"
              @click="trackMobile"
              >MEW Mobile App</a
            >
            <a
              href="https://www.enkrypt.com/"
              target="_blank"
              @click="trackEnkrypt"
              >Enkrypt</a
            >
            <a
              href="https://www.myetherwallet.com/wallet/access"
              target="_blank"
              @click="trackPortfolio"
              >MEW Portfolio Manager</a
            >
            <a href="https://www.ethvm.com/" target="_blank" @click="trackEthvm"
              >ethVM</a
            >
          </div>

          <div class="footer__links">
            <a
              href="https://www.myetherwallet.com/blog"
              target="_blank"
              @click="trackMewtopia"
              >Blog</a
            >

            <a
              href="https://www.myetherwallet.com/presskit"
              @click="trackPressKit"
              >Press Kit</a
            >
          </div>
        </div>
        <div class="col-3">
          <div class="footer__links">
            <a
              href="https://help.myetherwallet.com/en/"
              target="_blank"
              @click="trackHelpCenter"
              >Help Center</a
            >
            <a
              href="mailto:support@myetherwallet.com"
              rel="noopener noreferrer"
              target="_blank"
              @click="trackCustomerSupport"
              >Customer Support</a
            >
            <a
              href="https://www.myetherwallet.com/security-policy"
              @click="trackSecurityPolicy"
              >Security Policy</a
            >
            <a
              href="https://www.myetherwallet.com/tools?tool=verify"
              @click="trackVerifyMessage"
              >Verify Message</a
            >
            <a
              href="https://www.myetherwallet.com/tools?tool=convert"
              @click="trackConvertUnits"
              >Convert Units</a
            >
            <a
              href="https://www.myetherwallet.com/tools?tool=offline"
              @click="trackSendOfflineHelper"
              >Send Offline Helper</a
            >
          </div>
        </div>
        <div class="col-3">
          <div class="footer__info">
            <p>
              Help us keep MEW free and open-source, your donations go a long
              way towards making that possible.
            </p>
            <a
              href="https://www.ethvm.com/address/0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
              target="_blank"
              class="footer__info-donation"
              @click="trackEthDonation"
            >
              <donate-eth />
              Ethereum Donation
            </a>
            <a
              href="https://www.blockchain.com/explorer/addresses/btc/1DECAF2uSpFTP4L1fAHR8GCLrPqdwdLse9"
              target="_blank"
              class="footer__info-donation"
              @click="trackBtcDonation"
            >
              <donate-btc />
              Bitcoin Donation
            </a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="footer__copyright">
            <p>© {{ year }} MyEtherWallet. All rights reserved.</p>
            <p>
              Pricing taken from
              <a
                href="https://www.coingecko.com/"
                target="_blank"
                @click="trackCoinGecko"
                >CoinGecko</a
              >.
            </p>
            <v-switch
              class="d-none d-md-block"
              :input-value="consentToTrack"
              inset
              :label="`Data Tracking ${consentToTrack ? 'On' : 'Off'}`"
              color="#05C0A5"
              off-icon="mdi-alert-circle"
              @change="setConsent"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="footer__social">
            <h5>Join MEW Community</h5>
            <div class="footer__social-links">
              <a
                href="https://www.facebook.com/MyEtherWallet"
                target="_blank"
                class="footer__social-link"
                @click="trackJoinMewCommunity('facebook')"
              >
                <facebook />
              </a>
              <a
                href="https://twitter.com/myetherwallet/"
                target="_blank"
                class="footer__social-link"
                @click="trackJoinMewCommunity('twitter')"
              >
                <twitter />
              </a>
              <a
                href="https://www.instagram.com/myetherwallet/"
                target="_blank"
                class="footer__social-link"
                @click="trackJoinMewCommunity('instagram')"
              >
                <instagram />
              </a>
              <a
                href="https://www.linkedin.com/company/myetherwallet/"
                target="_blank"
                class="footer__social-link"
                @click="trackJoinMewCommunity('linkedin')"
              >
                <linkedin />
              </a>
              <a
                href="https://github.com/myetherwallet"
                target="_blank"
                class="footer__social-link"
                @click="trackJoinMewCommunity('github')"
              >
                <github />
              </a>
              <a
                href="https://www.reddit.com/r/MyEtherWallet/"
                target="_blank"
                class="footer__social-link"
                @click="trackJoinMewCommunity('reddit')"
              >
                <reddit />
              </a>
              <a
                href="https://medium.com/@myetherwallet"
                target="_blank"
                class="footer__social-link"
                @click="trackJoinMewCommunity('medium')"
              >
                <medium />
              </a>
              <a
                href="https://t.me/myetherwallet"
                target="_blank"
                class="footer__social-link"
                @click="trackJoinMewCommunity('telegram')"
              >
                <telegram />
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 footer__copyright d-none d-md-block">
          <p>
            <a
              :href="`https://github.com/MyEtherWallet/MyEtherWallet/releases/tag/v${packageVersion}`"
              >Version: v{{ packageVersion }}</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Facebook from '@/assets/images/icons/social/facebook-logo.vue';
import Twitter from '@/assets/images/icons/social/twitter-logo.vue';
import Instagram from '@/assets/images/icons/social/instagram-logo.vue';
import Linkedin from '@/assets/images/icons/social/linkedin-logo.vue';
import Github from '@/assets/images/icons/social/github-logo.vue';
import Reddit from '@/assets/images/icons/social/reddit-logo.vue';
import Medium from '@/assets/images/icons/social/medium-logo.vue';
import Telegram from '@/assets/images/icons/social/telegram-logo.vue';
import DonateEth from '@/assets/images/icons/social/donate-eth.vue';
import DonateBtc from '@/assets/images/icons/social/donate-btc.vue';

import { FOOTER_EVENTS } from '@/core/configs/commons';

import { useGlobalStore } from '@/core/store/global';
import { useAmplitude } from '@/core/composables/amplitude';
import { usePopupStore } from '@/core/store/popups';

// injections/use
const { $amplitude, setConsent } = useAmplitude();
const { network } = useGlobalStore();
const { consentToTrack } = usePopupStore();

// data
const packageVersion = VERSION;
const year = new Date().getFullYear();

// methods
const trackAboutUs = () => {
  $amplitude.track(FOOTER_EVENTS.footerAboutUs, {
    network: network.value.type.name
  });
};
const trackCareers = () => {
  $amplitude.track(FOOTER_EVENTS.footerCareers, {
    network: network.value.type.name
  });
};
const trackHowItWorks = () => {
  $amplitude.track(FOOTER_EVENTS.footerHowItWorks, {
    network: network.value.type.name
  });
};
const trackTeam = () => {
  $amplitude.track(FOOTER_EVENTS.footerTeam, {
    network: network.value.type.name
  });
};
const trackAdvertiseWithUs = () => {
  $amplitude.track(FOOTER_EVENTS.footerAdvertiseWithUs, {
    network: network.value.type.name
  });
};
const trackPrivacy = () => {
  $amplitude.track(FOOTER_EVENTS.footerPrivacy, {
    network: network.value.type.name
  });
};
const trackTerms = () => {
  $amplitude.track(FOOTER_EVENTS.footerTerms, {
    network: network.value.type.name
  });
};
const trackBugBounty = () => {
  $amplitude.track(FOOTER_EVENTS.footerBugBounty, {
    network: network.value.type.name
  });
};
const trackMobile = () => {
  $amplitude.track(FOOTER_EVENTS.footerMobile, {
    network: network.value.type.name
  });
};
const trackEnkrypt = () => {
  $amplitude.track(FOOTER_EVENTS.footerEnkrypt, {
    network: network.value.type.name
  });
};
const trackPortfolio = () => {
  $amplitude.track(FOOTER_EVENTS.footerPortfolio, {
    network: network.value.type.name
  });
};
const trackEthvm = () => {
  $amplitude.track(FOOTER_EVENTS.footerEthvm, {
    network: network.value.type.name
  });
};
const trackMewtopia = () => {
  $amplitude.track(FOOTER_EVENTS.footerMewtopia, {
    network: network.value.type.name
  });
};
const trackPressKit = () => {
  $amplitude.track(FOOTER_EVENTS.footerPressKit, {
    network: network.value.type.name
  });
};
const trackHelpCenter = () => {
  $amplitude.track(FOOTER_EVENTS.footerHelpCenter, {
    network: network.value.type.name
  });
};
const trackCustomerSupport = () => {
  $amplitude.track(FOOTER_EVENTS.footerCustomerSupport, {
    network: network.value.type.name
  });
};
const trackSecurityPolicy = () => {
  $amplitude.track(FOOTER_EVENTS.footerSecurityPolicy, {
    network: network.value.type.name
  });
};
const trackVerifyMessage = () => {
  $amplitude.track(FOOTER_EVENTS.footerVerifyMessage, {
    network: network.value.type.name
  });
};
const trackConvertUnits = () => {
  $amplitude.track(FOOTER_EVENTS.footerConvertUnits, {
    network: network.value.type.name
  });
};
const trackSendOfflineHelper = () => {
  $amplitude.track(FOOTER_EVENTS.footerSendOfflineHelper, {
    network: network.value.type.name
  });
};
const trackEthDonation = () => {
  $amplitude.track(FOOTER_EVENTS.footerEthDonation, {
    network: network.value.type.name
  });
};
const trackBtcDonation = () => {
  $amplitude.track(FOOTER_EVENTS.footerBtcDonation, {
    network: network.value.type.name
  });
};
const trackCoinGecko = () => {
  $amplitude.track(FOOTER_EVENTS.footerCoinGecko, {
    network: network.value.type.name
  });
};
const trackJoinMewCommunity = item => {
  $amplitude.track(FOOTER_EVENTS.footerJoinMewCommunity, {
    item: item,
    network: network.value.type.name
  });
};
</script>

<style lang="less" scoped>
@import '@/assets/styles/headerStyles/theme.less';
.footer {
  font-family: @font !important;
  overflow: hidden;
  padding-bottom: 104px;
  position: relative;

  .screen-tablet-portaint({
    padding-bottom: 74px;
  });

  .col-3,
  .col-6 {
    .screen-tablet-portaint({
        -webkit-box-flex: 0;
        -ms-flex: 0 0 100%;
        flex: 0 0 100%;
        max-width: 100%;
    });
  }

  &__links {
    margin-bottom: 42px;

    a {
      .footer-text;
      display: block;
      margin-bottom: 10px;
      text-decoration: none;
      .transition(@property: opacity, @time: 0.3s);

      &:hover {
        opacity: 0.5;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__info {
    .screen-tablet-portaint({
      margin-bottom: 42px;
    });

    p {
      color: @black;
      opacity: 0.7;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px; /* 137.5% */
      margin: 0 0 30px 0;
    }

    &-donation {
      .footer-text;
      display: block;
      margin-bottom: 10px;
      text-decoration: none;
      .transition(@property: opacity, @time: 0.3s);
      position: relative;
      padding-left: 28px;

      &:hover {
        opacity: 0.5;
      }

      svg {
        position: absolute;
        left: 0;
        top: 1px;
        border-radius: 20px;
      }
    }
  }

  &__copyright {
    .screen-tablet-portaint({
      position: absolute;
      width: 100%;
      left: 0;
      bottom: -218px;
    });

    p {
      color: @black;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      margin: 0 0 10px 0;
      opacity: 0.65;

      a {
        color: @black;

        &:hover {
          text-decoration: none;
        }
      }

      &:last-child {
        margin: 0;
      }
    }
  }

  &__social {
    .screen-tablet-portaint({
      margin-bottom: 94px;
    });

    h5 {
      color: @black;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      margin: 0 0 12px 0;
    }

    &-links {
      display: flex;

      .screen-tablet-portaint({
        flex-wrap: wrap;
      });
    }

    &-link {
      display: block;
      margin-right: 12px;
      text-decoration: none;
      .transition(@property: opacity, @time: 0.3s);

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        opacity: 0.5;
      }

      .screen-tablet-portaint({
        margin-bottom: 12px;
      });
    }
  }
}
</style>
