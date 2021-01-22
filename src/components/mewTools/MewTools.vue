<template>
  <div class="mew-component--mew-tools">
    <v-menu offset-y bottom left>
      <template #activator="{ on, attrs }">
        <!--
        =============================================================
        Desktop MEW tools button
        =============================================================
        -->
        <v-btn
          class="d-none d-lg-block btn px-3"
          color="white"
          outlined
          v-bind="attrs"
          x-large
          v-on="on"
        >
          <div class="d-flex align-center">
            <img
              src="@/assets/images/icons/icon-grid-dot.png"
              alt="Mew Tools"
              height="18"
              class="mr-2"
            />
            <div>MEW tools</div>
          </div>
        </v-btn>

        <!--
        =============================================================
        Mobile MEW tools button
        =============================================================
        -->
        <v-btn
          style="height: 36px; min-width: 36px; padding: 0"
          color="white"
          outlined
          class="d-lg-none"
          v-bind="attrs"
          v-on="on"
        >
          <img
            src="@/assets/images/icons/icon-grid-dot.png"
            alt="Mew Tools"
            height="20"
          />
        </v-btn>
      </template>

      <!--
      =============================================================
      MEW tools menu
      =============================================================
      -->
      <div
        class="pa-3 white mew-tools-menu"
        :class="$vuetify.breakpoint.mdAndDown ? 'mobile' : ''"
      >
        <v-row>
          <v-col
            v-for="(t, key) in tools"
            :key="key"
            cols="12"
            sm="12"
            md="12"
            lg="4"
            class="text-center"
          >
            <!-- Button with url link -->
            <a v-if="t.link" :href="t.link" target="_blank">
              <div class="tools-btn">
                <img :src="t.img" :alt="t.label" height="40" />
                <h6 class="mt-1 btn-lable basic--text">{{ t.label }}</h6>
              </div>
            </a>
          </v-col>
        </v-row>
      </div>
    </v-menu>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      dialog: false,
      tools: [
        /*
        {
          label: 'MEW web',
          img: require('@/assets/images/icons/icon-mew-logo.png')
        },
        */
        {
          label: 'EthVM',
          img: require('@/assets/images/icons/icon-ethvm.png'),
          link: 'https://www.ethvm.com/'
        },
        {
          label: 'MEW CX',
          img: require('@/assets/images/icons/icon-mew-cx.png'),
          link:
            'https://chrome.google.com/webstore/detail/mew-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en'
        },
        {
          label: 'MEW wallet App',
          img: require('@/assets/images/icons/icon-mew-wallet.png'),
          link: 'https://www.mewwallet.com/'
        },
        {
          label: 'MEW connect protocol',
          img: require('@/assets/images/icons/icon-mew-connect.png'),
          link: 'https://mewconnect.myetherwallet.com/'
        },
        {
          label: 'MEW topia',
          img: require('@/assets/images/icons/icon-puppy-mew.svg'),
          link: 'https://www.mewtopia.com/'
        },
        {
          label: 'Support center',
          img: require('@/assets/images/icons/icon-customer-support.svg'),
          link: 'https://kb.myetherwallet.com/'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.mew-tools-menu {
  width: 300px;
  border-radius: 6px;
  margin-top: 20px;
  position: relative;

  &:after {
    position: absolute;
    top: -7px;
    right: 55px;
    content: '';
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid white;
  }

  &.mobile {
    width: 130px;
    &:after {
      position: absolute;
      top: -7px;
      right: 10px;
      content: '';
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid white;
    }
  }

  .tools-btn:hover {
    * {
      font-weight: 600;
    }
  }
}
</style>

<style lang="scss">
.v-menu__content {
  border: 0 !important;
}
</style>
