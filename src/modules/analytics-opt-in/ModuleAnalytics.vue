<template>
  <!-- =================================================== -->
  <!-- Analytics Opt-in Dialog -->
  <!-- =================================================== -->
  <v-dialog
    :value="!shouldDisplayTrackingPopup"
    max-width="320"
    overlay-opacity="0"
    :content-class="
      $vuetify.breakpoint.smAndUp
        ? 'position-right matomo-analytics-dialog ma-0'
        : 'matomo-analytics-dialog ma-0'
    "
    scrollable
    @click:outside="onClick(false, true)"
  >
    <div class="inner-container pa-5">
      <div class="mew-heading-3 mb-3">Help improve MEW?</div>
      <div>
        MEW would like to gather basic usage data and will never collect
        personal information.
      </div>

      <v-expansion-panels flat>
        <v-expansion-panel>
          <v-expansion-panel-header
            class="pa-0 font-weight-medium mew-body"
            style="min-height: 55px"
          >
            What we collect
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div
              v-for="(item, key) in whatWeCollect"
              :key="key"
              class="d-flex align-start mb-6 titleSecondary--text"
            >
              <div class="mr-4">
                <v-icon v-if="item.yes" color="greenPrimary">mdi-check</v-icon>
                <v-icon v-else color="redPrimary">mdi-close</v-icon>
              </div>
              <div>{{ item.text }}</div>
            </div>
            <div class="text-center">
              <a
                href="https://www.myetherwallet.com/privacy-policy"
                target="_blank"
                class="greenPrimary--text"
              >
                View our full tracking policy
                <v-icon size="15px" color="greenPrimary" class="ml-1">
                  mdi-open-in-new
                </v-icon>
              </a>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="d-flex align-center">
        <mew-button
          btn-size="medium"
          class="flex-grow-1"
          color-theme="text-dark"
          btn-style="light"
          @click.native="onClick(false)"
        >
          Decline
        </mew-button>
        <div style="width: 8px"></div>
        <mew-button
          btn-size="medium"
          class="flex-grow-1"
          @click.native="onClick(true)"
        >
          Accept
        </mew-button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { useAmplitude } from '@/core/composables/amplitude';
import { popups as usePopupsStore } from '@/core/store/index.js';

// injections/use
const { setTrackingConsent, $amplitude } = useAmplitude();
const { neverShowPopup } = usePopupsStore();

// data
const whatWeCollect = [
  {
    yes: true,
    text: 'We will only collect basic usage data like event clicks and page-views'
  },
  { yes: true, text: 'You can opt-in and out anytime' },
  {
    yes: false,
    text: 'We will never collect your full IP address or exact location'
  },
  {
    yes: false,
    text: 'We cannot access any personal data: No private keys, nor passwords'
  }
];

// methods
/**
 * Sets the tracking consent and
 * then never displays the dialog again
 */
const onClick = (val, showAgain) => {
  $amplitude.setOptOut(!val);
  const prom = setTrackingConsent(val);
  if (!showAgain) {
    prom.then(neverShowPopup);
  }
};
</script>

<style lang="scss">
.matomo-analytics-dialog {
  &.position-right {
    position: absolute !important;
    top: 16px !important;
    right: 16px !important;
  }

  .v-expansion-panel-content__wrap {
    padding: 0 0 32px 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.inner-container {
  background-color: white;
  border-top: 8px solid var(--v-greenPrimary-base);
}
</style>
