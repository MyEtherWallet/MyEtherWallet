<template>
  <div>
    <v-dialog
      :value="!displayedTrackingPopup"
      width="350"
      max-width="350"
      overlay-opacity="0"
      content-class="matomo-dialog"
    >
      <v-sheet>
        <!-- change depending on when something is opened -->
        <div v-if="!expanded" class="pa-4">
          <h2 class="ma-0 mew-heading-2 font-weight-regular">
            Help us make MEW better by allowing us to measure a few things?
          </h2>
        </div>
        <div v-else class="pa-4 cursor--pointer" @click="backToOverview">
          <h2 class="ma-0 mew-heading-2 font-weight-regular">
            <v-icon size="xlarge"> mdi-chevron-left </v-icon> Back to overview
          </h2>
        </div>
        <!-- Contains scrollable content -->
        <v-virtual-scroll
          v-show="!expanded"
          height="325"
          item-height="125"
          :items="options"
        >
          <template #default="{ item }">
            <div
              :class="item.clickable ? 'cursor--pointer' : ''"
              @click="item.clickFn"
            >
              <v-divider />
              <v-row :key="item.title + item.text" class="py-2 px-3">
                <v-col v-if="item.iconLeft !== ''" class="pt-10" cols="2">
                  <v-icon :class="item.color">
                    {{ item.iconLeft }}
                  </v-icon>
                </v-col>
                <v-col cols="8" :class="[item.additionalClass, item.color]">
                  <p class="mew-body font-weight-bold">
                    {{ item.title }}
                  </p>
                  <p v-if="item.text" class="mew-label ma-0">
                    {{ item.text }}
                  </p>
                  <a
                    :href="item.link"
                    rel="noopener noreferrer"
                    target="_blank"
                    :class="item.linkClass"
                    @click.stop="() => {}"
                    >{{ item.linkText }}
                    <v-icon
                      v-if="item.linkIcon !== ''"
                      size="small"
                      color="primary"
                    >
                      {{ item.linkIcon }}</v-icon
                    ></a
                  >
                </v-col>
                <v-col v-if="item.iconRight !== ''" class="pt-10" cols="2">
                  <v-icon :class="item.color">
                    {{ item.iconRight }}
                  </v-icon>
                </v-col>
              </v-row>
            </div>
          </template>
        </v-virtual-scroll>

        <!-- Displayable contents -->
        <div v-show="expanded" class="displayable-content-container">
          <v-divider />
          <div v-if="selectedOption === 'whatWeCollect'" class="py-4 px-5">
            <p class="ma-0 font-weight-bold">What we collect</p>
            <ul class="what-we-collect-ul pl-5">
              <li class="pb-1">What features do people use the most?</li>
              <li class="pb-1">
                What parts of the product do users run into the most trouble
                with?
              </li>
              <li class="pb-1">
                Where do users drop off when completing certain actions?
              </li>
              <li class="pb-1">
                General location (We will never know your exact location and
                your IP address will be partially anonymized.)
              </li>
            </ul>
          </div>
          <v-divider />
          <div class="pa-3 pt-5 text-center">
            <a rel="noopener noreferrer" target="_blank">
              View our full tracking policy
              <v-icon size="small" color="primary"> mdi-open-in-new</v-icon>
            </a>
          </div>
        </div>

        <!-- fixed buttons -->
        <v-divider />
        <div
          class="pa-3 d-flex flex-column additionalClass-center justify-center"
        >
          <mew-button
            has-full-width
            title="Allow MEW to measure analytics"
            btn-size="xlarge"
            @click.native="allow"
          />
          <p
            class="text-center secondary--text mt-2 cursor--pointer"
            @click="dontAllow"
          >
            Don't allow
          </p>
        </div>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  data() {
    return {
      expanded: false,
      options: [
        {
          title: 'What we collect',
          iconLeft: 'mdi-chart-box-outline',
          iconRight: 'mdi-chevron-right',
          text: 'We will only collect data on how users are using the product',
          linkText: 'What we collect',
          link: '', // ask russ where this goes
          linkIcon: '',
          linkClass: '',
          additionalClass: '',
          color: '',
          clickable: true,
          clickFn: () => {
            this.selectedOption = 'whatWeCollect';
            this.expanded = true;
          }
        },
        {
          title: 'Anonymity',
          iconLeft: 'mdi-incognito-circle',
          iconRight: '',
          text: "We will never collect user's full IP address or exact location so you can remain anonymous.",
          linkText: '',
          link: '',
          linkIcon: '',
          linkClass: '',
          additionalClass: '',
          color: '',
          clickable: false,
          clickFn: () => {}
        },
        {
          title: 'Privacy',
          iconLeft: 'mdi-lock-outline',
          iconRight: '',
          text: 'We cannot access any personal data: No seed words, no private keys, no public address nor passwords.',
          linkText: '',
          link: '',
          linkIcon: '',
          linkClass: '',
          additionalClass: '',
          color: '',
          clickable: false,
          clickFn: () => {}
        },
        {
          title: '',
          iconLeft: 'mdi-toggle-switch',
          iconRight: '',
          text: 'You can opt out anytime by clicking the toggle switch in the side bar menu.',
          linkText: 'View our full tracking policy',
          link: '', // ask russ where this goes
          linkIcon: 'mdi-open-in-new',
          linkClass: 'pt-3',
          additionalClass: 'text-center',
          color: 'searchText--text',
          clickable: false,
          clickFn: () => {}
        }
      ],
      selectedOption: ''
    };
  },
  computed: {
    ...mapState('global', ['displayedTrackingPopup'])
  },
  methods: {
    ...mapMutations('global', ['NEVER_SHOW_TRACKING']),
    ...mapActions('global', ['setTrackingConsent']),
    // setSelected(selected) {
    //   this.selectedOption = selected;
    //   this.expanded = true;
    // },
    backToOverview() {
      this.selectedOption = '';
      this.expanded = false;
    },
    allow() {
      this.setTrackingConsent(true).then(this.NEVER_SHOW_TRACKING);
    },
    dontAllow() {
      this.setTrackingConsent(false).then(this.NEVER_SHOW_TRACKING);
    }
  }
};
</script>

<style>
.matomo-dialog {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
}
</style>

<style lang="scss" scoped>
.displayable-content-container {
  height: 325px;
}

.what-we-collect-ul {
  list-style-type: disc;
}
</style>
