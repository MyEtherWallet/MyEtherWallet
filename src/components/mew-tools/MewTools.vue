<template>
  <div class="mew-component--mew-tools">
    <v-menu offset-y close-on-click bottom left>
      <template #activator="{ on, attrs }">
        <!--
        =============================================================
        Desktop MEW tools button
        =============================================================
        -->
        <v-btn
          class="d-none d-lg-block btn-remove-style"
          outlined
          x-large
          v-bind="attrs"
          :ripple="false"
          @click="menuOpen()"
          v-on="on"
        >
          <mew-button
            class="px-2"
            :title="$vuetify.breakpoint.mdAndUp ? 'MEW Hub' : ''"
            color-theme="primary"
            :has-full-width="false"
            btn-size="large"
            btn-style="outline"
            :icon="require('@/assets/images/icons/icon-grid-dot.png')"
            :icon-type="'img'"
            icon-align="left"
          />
        </v-btn>

        <!--
        =============================================================
        Mobile MEW tools button
        =============================================================
        -->
        <v-btn
          style="height: 36px; min-width: 36px; padding: 0"
          color="primary"
          outlined
          class="d-lg-none"
          v-bind="attrs"
          v-on="on"
          @click="menuOpen()"
        >
          <img
            src="@/assets/images/icons/icon-grid-dot.png"
            alt="Mew Hub"
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
    </v-menu>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      top: undefined,
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
          link: 'https://kb.myetherwallet.com/'
        },
        {
          label: 'MEWconnect protocol',
          img: require('@/assets/images/icons/icon-mew-connect.png'),
          link: 'https://mewconnect.myetherwallet.com/'
        }
      ]
    };
  },
  methods: {
    menuOpen() {
      const checkExist = setInterval(() => {
        const menu = document.querySelector('.v-menu__content');
        if (menu !== null) {
          clearInterval(checkExist);
          if (this.top === undefined) {
            this.top = parseInt(menu.style.top.replace('px', ''));
          }
          menu.style.top = this.top + 5 + 'px';
          menu.classList.add('mew-tools-menu-container');
        }
      }, 100); // check every 100ms
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--mew-tools {
  display: inline-block;
}
.mew-tools-menu {
  width: 300px;
  position: relative;

  &.md,
  &.sm {
    &:after {
      right: 10px;
    }
  }

  &.xs {
    width: 190px;
    &:after {
      right: 10px;
    }
  }

  .tools-btn:hover {
    * {
      font-weight: 600;
    }
  }
}

.btn-remove-style {
  margin: 0 !important;
  padding: 0 !important;
  border: 0;
  &::before {
    opacity: 0 !important;
  }
}
</style>

<style lang="scss">
.mew-component--mew-tools {
  .mew-button {
    font-weight: 400 !important;
    height: initial !important;
    > span {
      padding: 16px 10px !important;
    }
    img {
      height: 16px !important;
      margin-right: 6px !important;
    }
  }
}

.mew-tools-menu-container {
  border: 0 !important;
  border-radius: 6px !important;
}
</style>
