<template>
  <mew-menu-popup
    class="mew-component--mew-tools"
    :icon="$vuetify.breakpoint.smAndDown"
    :btn-icon="require('@/assets/images/icons/icon-grid-dot-green.svg')"
    :btn-icon-size="$vuetify.breakpoint.mdAndUp ? '18px' : '20px'"
    :btn-title="$vuetify.breakpoint.mdAndUp ? 'MEW Hub' : ''"
    btn-font-size="12px"
    :btn-size="$vuetify.breakpoint.mdAndUp ? 'x-large' : ''"
    color="primary"
    outlined
  >
    <!-- ======================================================================================== -->
    <!-- Menu content -->
    <!-- ======================================================================================== -->
    <div
      class="pa-6 white mew-tools-menu"
      :class="[
        $vuetify.breakpoint.md ? 'md' : '',
        $vuetify.breakpoint.sm ? 'sm' : '',
        $vuetify.breakpoint.xs ? 'xs' : ''
      ]"
    >
      <v-row>
        <v-col
          v-for="(t, key) in tools"
          :key="key"
          cols="6"
          sm="4"
          class="text-center"
        >
          <!-- Button with url link -->
          <a v-if="t.link" :href="t.link" target="_blank">
            <div class="tools-btn">
              <img :src="t.img" :alt="t.label" height="50" />
              <h6 class="mt-1 btn-lable basic--text">{{ t.label }}</h6>
            </div>
          </a>
        </v-col>
      </v-row>
    </div>
  </mew-menu-popup>
</template>

<script>
import MewMenuPopup from '@/components/mew-menu-popup/MewMenuPopup';

export default {
  components: { MewMenuPopup },
  data() {
    return {
      tools: [
        {
          label: 'MEW wallet app',
          img: require('@/assets/images/icons/icon-mew-wallet.png'),
          link: 'https://www.mewwallet.com/'
        },
        {
          label: 'EthVM',
          img: require('@/assets/images/icons/icon-ethvm.png'),
          link: 'https://www.ethvm.com/'
        },
        {
          label: 'MEWtopia',
          img: require('@/assets/images/icons/icon-puppy-mew.svg'),
          link: 'https://www.mewtopia.com/'
        },
        {
          label: 'Help center',
          img: require('@/assets/images/icons/icon-customer-support.svg'),
          link: 'https://help.myetherwallet.com/en/'
        },
        {
          label: 'MEWconnect protocol',
          img: require('@/assets/images/icons/icon-mew-connect.png'),
          link: 'https://mewconnect.myetherwallet.com/'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.mew-tools-menu {
  width: 300px;

  &.xs {
    width: 250px;
  }
}
.tools-btn {
  opacity: 0.9;
  &:hover {
    opacity: 1;
    * {
      font-weight: 500;
    }
  }
}
</style>
