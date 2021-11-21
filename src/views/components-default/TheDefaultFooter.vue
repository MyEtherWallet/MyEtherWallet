<template>
  <div class="mew-component--home-footer titlePrimary--text">
    <div class="desktop-content d-none d-lg-block">
      <v-sheet color="titlePrimary" class="py-2">
        <v-container>
          <div class="d-flex align-center">
            <v-spacer />
            <p class="teal--text text--lighten-1 ma-0">
              ©2021 Impact Ledger. All rights reserved. Pricing taken from
              <a
                class="cyan--text text--lighten-3"
                href="https://www.coingecko.com/en"
                target="_blank"
                >CoinGecko</a
              >.
            </p>
            <v-spacer />
            <v-sheet width="150" color="transparent">
              <!-- <v-select
                v-model="select"
                append-icon="mdi-chevron-down"
                :items="languages"
                item-text="name"
                item-value="value"
                return-object
                single-line
                dark
              ></v-select> -->
            </v-sheet>
          </div>
        </v-container>
      </v-sheet>
    </div>

    <div class="mobile-content d-block d-lg-none">
      <v-expansion-panels accordion>
        <v-expansion-panel v-for="(mf, mfkey) in footers" :key="mfkey">
          <v-expansion-panel-header>
            <v-container>
              <v-sheet color="transparent" max-width="500px" class="mx-auto">
                <h3>{{ mf.title }}</h3>
              </v-sheet>
            </v-container>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-sheet color="transparent" max-width="500px" class="mx-auto">
                <ul>
                  <li v-for="(md, mdkey) in mf.data" :key="mdkey">
                    <router-link
                      v-if="md.routerLink"
                      :to="{ name: md.routerLink, query: md.query }"
                    >
                      {{ md.label }}
                    </router-link>
                    <a v-if="md.link" :href="md.link" target="_blank">
                      {{ md.label }}
                    </a>
                  </li>
                </ul>
              </v-sheet>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-container class="py-12">
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <div
            class="social-icons d-flex align-center justify-space-between mt-12"
          >
            <a
              v-for="(i, key) in socialIcons"
              :key="key"
              :href="i.link"
              target="_blank"
            >
              <mew-icon :img-height="23" :icon-name="i.icon" />
            </a>
          </div>

          <div class="d-flex mt-10">
            <div class="d-flex align-center line-height-small mx-auto">
              <div class="px-2 px-lg-6 border-right">
                <a
                  class="color--inherit"
                  href="mailto:support@myetherwallet.com"
                  target="_blank"
                >
                  Feedback
                </a>
              </div>
              <div class="px-2 px-lg-6 border-right">
                <a
                  class="color--inherit"
                  href="https://www.myetherwallet.com/privacy-policy"
                  >Privacy</a
                >
              </div>
              <div class="px-2 px-lg-6">
                <a
                  class="color--inherit"
                  href="https://www.myetherwallet.com/terms-and-conditions"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </v-sheet>
      </v-container>

      <v-sheet color="titlePrimary" class="py-9">
        <v-container>
          <v-sheet color="transparent" max-width="500px" class="mx-auto">
            <div class="d-flex align-center justify-space-between">
              <v-sheet width="150" color="transparent">
                <!-- <v-select
                  v-model="select"
                  append-icon="mdi-chevron-down"
                  :items="languages"
                  item-text="name"
                  item-value="value"
                  return-object
                  single-line
                  dark
                ></v-select> -->
              </v-sheet>
            </div>
            <v-sheet color="transparent" max-width="300px" class="mx-auto">
              <p class="teal--text text--lighten-1 mt-6 mb-0 text-center">
                ©2021 Impact Ledger. All rights reserved. Pricing taken from
                <a
                  class="cyan--text text--lighten-3"
                  href="https://www.coingecko.com/en"
                  target="_blank"
                  >Coingecko</a
                >.
              </p>
            </v-sheet>
          </v-sheet>
        </v-container>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'TheDefaultFooter',
  mixins: [handlerAnalytics],
  data: () => ({
    footers: [],
    socialIcons: []
  })
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.v-list-item {
  min-height: 35px;
}
.border-right {
  border-right: 1px solid black;
}
.line-height-small {
  > div {
    line-height: 11px;
  }
}
</style>

<style lang="scss">
.mew-component--home-footer {
  a {
    color: var(--v-titlePrimary-base) !important;
  }
  .v-select__selection {
    color: #80deea !important;
    width: 100%;
    text-align: right;
  }

  .v-text-field > .v-input__control > .v-input__slot:before,
  .v-text-field > .v-input__control > .v-input__slot:after,
  .v-select.v-text-field input,
  .v-text-field__details {
    display: none;
  }

  .v-text-field .v-input__append-inner {
    margin-left: -15px;
  }

  .v-text-field,
  .v-input__slot {
    margin: 0;
    padding: 0;
  }
  .v-select .v-icon {
    color: #80deea !important;
  }

  .mobile-content {
    ul {
      li {
        padding: 0.8rem 0;
        user-select: none;
      }
    }

    .v-item-group {
      border-bottom: 1px solid rgb(224 224 224);
    }

    .v-expansion-panel-header {
      padding: 25px 0rem !important;
      //padding: 23px 24px !important;
    }

    .v-sheet,
    .v-expansion-panel:before {
      box-shadow: none !important;
    }
    .v-expansion-panel-header__icon {
      //display: none !important;
      position: absolute;
      right: 20px;
      top: 0;
      bottom: 0;
    }
  }
}
</style>
