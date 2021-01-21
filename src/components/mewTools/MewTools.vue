<template>
  <div class="mew-component--mew-tools">
    <mew-button
      class="desktop-tools-button px-2 d-none d-lg-block"
      title="MEW tools"
      color-theme="white"
      :has-full-width="false"
      button-size="large"
      btn-style="outline"
      icon="mdi-view-module"
      icon-type="mdi"
      icon-align="left"
      @click.native="mewTools = true"
    />

    <mew-button
      class="mobile-tools-button d-block d-lg-none"
      color-theme="white"
      btn-style="outline"
      :icon="require('@/assets/images/icons/icon-grid-dot.png')"
      icon-type="img"
      icon-align="left"
    />

    <div class="outside-container">
      <div class="pa-3 white mew-tools-menu">
        <v-row>
          <v-col
            v-for="(t, key) in tools"
            :key="key"
            cols="6"
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
    </div>
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
.mew-component--mew-tools {
  position: relative;

  .outside-container {
    z-index: 9;
    position: absolute;
    min-width: 300px;
    right: 0;
    top: 0;
    opacity: 0;
    padding: 70px 0 0 0;
    pointer-events: none;
    transition: opacity 0.1s ease-in-out;
  }

  &:hover .outside-container {
    opacity: 1;
    pointer-events: all;
  }

  .mew-tools-menu {
    border-radius: 5px;
    box-shadow: 0px 5px 15px rgb(0 0 0 / 20%);
    position: relative;

    &:before {
      position: absolute;
      right: 30px;
      top: -7px;
      content: '';
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid white;
    }
  }
}

.tools-btn {
  padding: 3px;

  &:hover .btn-lable {
    font-weight: 600;
  }
}

.desktop-tools-button {
  height: 50px !important;
  width: 140px !important;
}

$mobile-tools-button-size: 35px;
.mobile-tools-button {
  height: $mobile-tools-button-size !important;
  min-height: $mobile-tools-button-size !important;
  width: $mobile-tools-button-size !important;
  min-width: $mobile-tools-button-size !important;
  padding: 0 !important;
  margin: 0 !important;
  img {
    height: 20px !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
