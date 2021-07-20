<template>
  <div
    v-if="!hideBanner"
    :class="[
      'white d-flex justify-center align-center text-center full-width footer-banner-container',
      isExpanded ? 'footer-banner-expanded' : 'footer-banner'
    ]"
  >
    <div
      :class="[
        'detail-content cursor-pointer d-flex align-baseline',
        isExpanded ? 'detail-content-expanded' : ''
      ]"
      @click="toggleBanner()"
    >
      <p class="primary--text">
        {{
          isExpanded
            ? $t('home.mew-wallet-modal.less')
            : $t('home.mew-wallet-modal.more')
        }}
      </p>
      <v-icon class="ml-2" color="primary" size="12">{{
        isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
      }}</v-icon>
    </div>
    <div
      :class="[
        isExpanded
          ? 'd-flex flex-column center-content-expanded'
          : 'center-content d-flex align-center'
      ]"
    >
      <div :class="['title-row d-flex', isExpanded ? 'bottom-space' : '']">
        <span class="full-height mew-heading-1">{{
          $t('home.mew-wallet-modal.title')
        }}</span>
      </div>
      <div :class="['btn-container', isExpanded ? 'bottom-space' : 'ml-7']">
        <a
          v-for="(btn, idx) in storeButtons"
          :key="idx"
          target="_blank"
          :href="btn.url"
        >
          <img height="46" class="mr-1" :src="btn.src" alt="App button" />
        </a>
      </div>
      <div v-if="isExpanded" class="mew-body font-weight-medium footer-text">
        <p>{{ $t('home.mew-wallet-modal.footer-text') }}</p>
        <a href="https://www.mewwallet.com/" target="_blank"
          >{{ $t('home.mew-wallet-modal.learn-more') }}...
        </a>
      </div>
    </div>
    <img
      v-if="isExpanded"
      class="mew-connect-image"
      src="@/assets/images/snippets/snippet-mew-wallet-confetti.png"
      :alt="$t('home.mew-wallet-modal.img-desc')"
    />
    <div
      v-if="!isExpanded"
      class="cursor-pointer font-weight-medium close-container"
      @click="setHideBanner()"
    >
      <p>{{ $t('home.mew-wallet-modal.hide') }}</p>
    </div>
  </div>
</template>

<script>
import appStore from '@/assets/images/icons/button-app-store.png';
import googlePlay from '@/assets/images/icons/button-play-store.png';
import store from 'store';
export default {
  data() {
    return {
      hideBanner: false,
      isExpanded: false,
      storeButtons: [
        {
          src: appStore,
          url: 'https://itunes.apple.com/app/id1464614025'
        },
        {
          src: googlePlay,
          url: 'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet'
        }
      ]
    };
  },
  mounted() {
    this.hideBanner = store.get('hideBanner');
  },
  methods: {
    toggleBanner() {
      this.isExpanded = !this.isExpanded;
    },
    setHideBanner() {
      this.hideBanner = true;
      store.set('hideBanner', true);
    }
  }
};
</script>

<style lang="scss">
.close-container {
  position: absolute;
  right: 20px;
  top: 15px;
}

.footer-banner-expanded {
  flex-direction: row;
  min-height: 200px;
}

.footer-banner {
  min-height: 88px;
}

.bottom-space {
  margin-left: 0 !important;
  margin-bottom: 20px;
}

.footer-banner-container {
  box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.12);
  left: 0;
  bottom: 0;
  overflow: hidden;
  position: sticky;
  z-index: 100;

  .center-content-expanded {
    align-items: flex-start;
    margin-right: 40px;
  }

  span {
    height: 28px;
  }

  .footer-text {
    text-align: left;
  }

  .detail-content-expanded {
    top: 15px;
  }

  .mew-connect-image {
    margin-bottom: -74px;
    width: 325px;
  }

  .detail-content {
    left: 20px;
    position: absolute;
    top: 15px;
  }
}

@media screen and (max-width: 1192px) {
  .footer-banner-container {
    .detail-content {
      top: 15px;
    }

    .footer-text {
      text-align: center;
    }
    .center-content {
      flex-direction: column;

      .title-row {
        span {
          margin-top: 20px;
          margin-bottom: 10px;
        }
      }
    }

    .btn-container {
      margin-bottom: 20px;
      margin-left: 0;
      margin-top: 20px;
    }
  }
}

@media screen and (max-width: 1073px) {
  .footer-banner-expanded {
    flex-direction: column;
    min-height: 415px !important;
  }

  .footer-banner-container {
    .center-content-expanded {
      align-items: center;
      margin-right: 0;
    }
  }
}

@media screen and (max-width: 722px) {
  .footer-banner-container {
    min-height: 200px;
    .center-content,
    .center-content-expanded {
      .title-row {
        span {
          font-size: 20px;
        }
      }
    }
  }
}

@media screen and (max-width: 456px) {
  .footer-banner-expanded {
    min-height: 450px !important;
  }

  .bottom-space {
    margin-bottom: 15px;
  }

  .footer-banner-container {
    .btn-container > a {
      img {
        height: 30px;
        margin-right: 5px;
        width: 96px;
      }
    }
  }
}
</style>
