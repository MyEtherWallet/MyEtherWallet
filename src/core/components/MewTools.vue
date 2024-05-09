<template>
  <mew-menu-popup
    class="mew-component--mew-tools"
    :icon="$vuetify.breakpoint.smAndDown"
    :btn-icon="require('@/assets/images/icons/icon-grid-dot-white.svg')"
    :btn-icon-size="$vuetify.breakpoint.mdAndUp ? '18px' : '20px'"
    :btn-title="$vuetify.breakpoint.mdAndUp ? 'MEW Products' : ''"
    btn-font-size="12px"
    color="white"
    outlined
    right
  >
    <v-row
      class="white"
      dense
      :style="isMobile ? 'min-width: 280px' : 'min-width: 700px'"
    >
      <v-col
        v-for="(section, sectionKey) in sections"
        :key="sectionKey"
        cols="12"
        md="6"
        :class="[section.classes, isMobile ? 'px-8 py-6' : 'px-12 py-10']"
      >
        <div
          class="text-center text-uppercase bluePrimary--text font-weight-bold"
          style="font-size: 13px"
        >
          {{ section.title }}
        </div>

        <!-- ============================================================================================== -->
        <!-- Section Items -->
        <!-- ============================================================================================== -->
        <a
          v-for="(item, itemKey) in section.items"
          :key="itemKey"
          :href="item.link"
          target="_blank"
          class="d-flex align-center my-9"
          @click="trackToolLink(item)"
        >
          <img :src="item.img" alt="" height="42" class="mr-5" />
          <div>
            <div class="fw-500 mew-heading-4 mb-1 textDark--text">
              {{ item.label }}
            </div>
            <div
              v-if="item.description"
              class="textLight--text"
              style="line-height: 20px"
            >
              {{ item.description }}
            </div>
            <div v-if="item.imgDescription" class="d-flex align-center">
              <div class="bluePrimary--text fw-500">
                {{ item.imgDescription.label }}
              </div>
            </div>
          </div>
        </a>
      </v-col>
    </v-row>
  </mew-menu-popup>
</template>

<script setup>
import { computed } from 'vue';
import { HEADER } from '@/modules/analytics-opt-in/handlers/configs/events.js';
import { useAmplitude } from '@/core/composables/amplitude';
import { useVuetify } from '@/core/composables/vuetify';

// injections/use
const { trackHeaderAmplitude } = useAmplitude();
const vuetify = useVuetify();

// data
const sections = [
  {
    title: 'Wallets',
    classes: '',
    items: [
      {
        label: 'MEW web',
        description: 'Ethereum desktop wallet',
        img: require('@/assets/images/icons/icon-mew-logo.svg'),
        link: 'https://www.myetherwallet.com/'
      },
      {
        label: 'MEW wallet',
        imgDescription: {
          icons: [
            require('@/assets/images/icons/icon-apple.svg'),
            require('@/assets/images/icons/icon-google.svg')
          ],
          label: 'Get the app'
        },
        img: require('@/assets/images/icons/icon-mew-wallet.png'),
        link: 'https://www.mewwallet.com/'
      },
      {
        label: 'Enkrypt',
        imgDescription: {
          icons: [require('@/assets/images/icons/icon-chrome.svg')],
          label: 'Get the extension'
        },
        img: require('@/assets/images/icons/icon-enkrypt-block.svg'),
        link: 'https://www.enkrypt.com'
      }
    ]
  },
  {
    title: 'Tools',
    classes: 'tools-block',
    items: [
      {
        label: 'EthVM',
        description: 'Blockchain explorer',
        img: require('@/assets/images/icons/icon-ethvm-dark.svg'),
        link: 'https://www.ethvm.com/'
      },
      {
        label: 'Blog',
        description: 'Education Blog',
        img: require('@/assets/images/icons/icon-puppy-mew.svg'),
        link: 'https://www.myetherwallet.com/blog'
      },
      {
        label: 'Help Center',
        description: 'How to use MEW products',
        img: require('@/assets/images/icons/icon-customer-support.svg'),
        link: 'https://help.myetherwallet.com/'
      }
    ]
  }
];

// computed
const isMobile = computed(() => vuetify.breakpoint.smAndDown);

// methods
const trackToolLink = val => {
  const parsedLabel = val.label.replace(' ', '_').toLowerCase();
  trackHeaderAmplitude(HEADER.MEW_PRODUCTS, { name: parsedLabel });
};
</script>

<style lang="scss" scoped>
.tools-block {
  background-color: var(--v-greyLight-base);
}

.fw-500 {
  font-weight: 500 !important;
}
</style>
