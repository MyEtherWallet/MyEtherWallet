<template>
  <!--
    ===================================================
   Analytics Opt-in Dialog
    ===================================================
    -->
  <div>
    <v-dialog
      :value="!displayedTrackingPopup"
      width="360"
      max-width="360"
      overlay-opacity="0"
      :content-class="
        $vuetify.breakpoint.smAndUp
          ? 'position-right matomo-analytics-dialog ma-0'
          : 'matomo-analytics-dialog ma-0'
      "
      scrollable
    >
      <v-card>
        <!--
    ===================================================
   Titles
    ===================================================
    -->
        <v-card-text class="pa-0">
          <div
            class="
              titlePrimary--text
              mew-heading-2
              font-weight-regular
              pa-8
              pb-4
            "
          >
            <span v-if="!onWhatWeCollect" class="break-word"
              >Help us make MEW better by allowing us to measure a few
              things?</span
            >
            <span v-else class="cursor-pointer" @click="backToOverview"
              ><v-icon class="mb-1" color="titleSecondary" size="30px">
                mdi-chevron-left
              </v-icon>
              Back to overview</span
            >
          </div>
          <!--
    ===================================================
   Content (on mount)
    ===================================================
    -->
          <div v-if="!onWhatWeCollect">
            <div
              v-for="(option, idx) in options"
              :key="idx"
              :class="option.clickFn ? 'cursor--pointer clickable-content' : ''"
              @click="option.clickFn ? options.clickFn : () => {}"
            >
              <v-divider />
              <v-row class="ma-0">
                <v-col v-if="option.iconLeft" class="py-13 pl-9" cols="2">
                  <v-icon :color="option.color">
                    {{ option.iconLeft }}
                  </v-icon>
                </v-col>
                <v-col cols="8" :class="['py-4 pl-6', option.color + '--text']">
                  <p
                    v-if="option.title"
                    class="font-weight-bold mb-2 titlePrimary--text"
                  >
                    {{ option.title }}
                  </p>
                  <p v-if="option.text" class="mb-0">
                    {{ option.text }}
                  </p>
                  <div :class="option.linkClass">
                    <a
                      :href="option.link"
                      rel="noopener noreferrer"
                      target="_blank"
                      >{{ option.linkText }}
                      <v-icon
                        v-if="option.linkIcon"
                        size="small"
                        color="primary"
                      >
                        {{ option.linkIcon }}</v-icon
                      ></a
                    >
                  </div>
                </v-col>
                <v-col v-if="option.iconRight" class="py-13 pr-7" cols="2">
                  <v-icon :color="option.color">
                    {{ option.iconRight }}
                  </v-icon>
                </v-col>
              </v-row>
            </div>
          </div>
          <!--
    ===================================================
   Content (expanded on: What we collect)
    ===================================================
    -->
          <div v-show="onWhatWeCollect">
            <v-divider />
            <div class="py-4 px-8">
              <p class="font-weight-bold titlePrimary--text mb-2">
                What we collect
              </p>
              <ul class="what-we-collect-ul titleSecondary--text pl-5">
                <li
                  v-for="(item, idx) in whatWeCollectItems"
                  :key="item + idx"
                  class="pb-1"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
            <v-divider />
            <div class="pa-8 text-center">
              <a rel="noopener noreferrer" target="_blank">
                View our full tracking policy
                <v-icon size="small" color="primary"> mdi-open-in-new</v-icon>
              </a>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <!--
    ===================================================
   Buttons
    ===================================================
    -->
        <v-card-actions class="px-8 py-6 d-flex flex-column justify-center">
          <mew-button
            has-full-width
            title="Allow MEW to measure analytics"
            btn-size="xlarge"
            @click.native="onClick(true)"
          />
          <p
            class="text-center secondary--text mt-3 mb-0 cursor--pointer"
            @click="onClick(false)"
          >
            Don't allow
          </p>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import handlerAnalytics from './handlers/handlerAnalytics.mixin';

export default {
  mixins: [handlerAnalytics],
  data() {
    return {
      onWhatWeCollect: false,
      whatWeCollectItems: [
        'What features do people use the most?',
        'What parts of the product do users run into the most trouble with?',
        'Where do users drop off when completing certain actions?',
        'General location (We will never know your exact location and your IP address will be partially anonymized.)'
      ],
      options: [
        {
          title: 'What we collect',
          iconLeft: 'mdi-chart-box-outline',
          iconRight: 'mdi-chevron-right',
          text: 'We will only collect data on how users are using the product.',
          link: '', // TODO: ask russ for link
          linkText: 'What we collect',
          linkClass: 'font-weight-medium',
          color: 'titleSecondary', //TODO: add this color to mew components
          clickFn: () => {
            this.onWhatWeCollect = true;
          }
        },
        {
          title: 'Anonymity',
          iconLeft: 'mdi-incognito-circle',
          text: "We will never collect user's full IP address or exact location so you can remain anonymous.",
          color: 'titleSecondary' //TODO: add this color to mew components
        },
        {
          title: 'Privacy',
          iconLeft: 'mdi-lock-outline',
          text: 'We cannot access any personal data: No seed words, no private keys, no public address nor passwords.',
          color: 'titleSecondary' //TODO: add this color to mew components
        },
        {
          iconLeft: 'mdi-toggle-switch',
          text: 'You can opt out anytime by clicking the toggle switch in the side bar menu.',
          linkText: 'View our full tracking policy',
          link: '', // TODO: ask russ for link
          linkIcon: 'mdi-open-in-new',
          linkClass: 'mt-4',
          color: 'searchText'
        }
      ]
    };
  },
  computed: {
    ...mapState('global', ['displayedTrackingPopup'])
  },
  methods: {
    ...mapMutations('global', ['NEVER_SHOW_TRACKING']),
    ...mapActions('global', ['setTrackingConsent']),
    /**
     * Returns back to home page
     */
    backToOverview() {
      this.onWhatWeCollect = false;
    },
    /**
     * Sets the tracking consent and
     * then never display this dialog again
     */
    onClick(val) {
      this.setTrackingConsent(val).then(this.NEVER_SHOW_TRACKING);
    }
  }
};
</script>

<style lang="scss">
.matomo-analytics-dialog {
  height: 600px;
  &.position-right {
    position: absolute !important;
    top: 16px !important;
    right: 16px !important;
  }
}
</style>

<style lang="scss" scoped>
.clickable-content:hover {
  background-color: var(--v-tableHeader-base);
}
.what-we-collect-ul {
  list-style-type: disc;
}
</style>
