<template>
  <div class="px-sm-3 py-10 prototype-container">
    <v-row no-gutters>
      <!-- <v-col cols="12" class="pb-5">
        <div class="d-flex flex-column flex-md-row align-center justify-center">
          <div class="py-6 pl-6 ma-5 ad-component">
            <div class="mew-subtitle">3 million</div>
            <div>Monthly active MyEtherWallet users</div>
          </div>
          <div class="py-6 pl-6 ma-5 ad-component">
            <div class="mew-subtitle">Original ETH users</div>
            <div>Our users date back to 2015, the launch of Ethereum</div>
          </div>
          <div class="py-6 pl-6 ma-5 ad-component">
            <div class="mew-subtitle">26,000</div>
            <div>Daily crypto veteran users</div>
          </div>
        </div>
      </v-col> -->
      <v-col
        cols="12"
        class="pb-md-16 mb-md-10 d-flex align-center justify-center"
      >
        <div
          :class="[
            $vuetify.breakpoint.mdAndDown ? 'mew-subtitle' : 'mew-title',
            'font-weight-regular text-center pb-5 pb-lg-10'
          ]"
        >
          Ad opportunities <br class="d-md-none" />
          with MEW web
        </div>
      </v-col>
      <v-col
        cols="12"
        md="12"
        class="d-flex justify-center px-sm-5 pb-12 pb-sm-16 mb-sm-10"
      >
        <img
          src="@/assets/images/backgrounds/ad-prototype.png"
          width="100%"
          class="ad-prototype-img"
        />
      </v-col>
      <!-- <v-col
        cols="12"
        class="d-flex flex-column flex-md-row align-center justify-center py-sm-10 pb-12 pb-sm-16 mb-sm-10"
      >
        <div class="ad-prototype-buttons ma-5 px-3 py-6">
          <div class="mb-3 text-center font-weight-bold">Small Buttons</div>
          <ul>
            <li>Target users through natively integrated CTA buttons.</li>
            <li class="mt-5">Top of page placement on all pages.</li>
            <li class="mt-5">
              Displays more information on your brand on hover, and opens your
              URL in a new page on click.
            </li>
          </ul>
        </div>
        <div class="ad-prototype-buttons ma-5 px-3 py-6">
          <div class="mb-3 text-center font-weight-bold">Square Banners</div>
          <ul>
            <li>Your custom asset for the advertising campaign.</li>
            <li class="mt-5">Above the fold placement on all pages.</li>
            <li class="mt-5">Responsive design for mobile and desktop.</li>
            <li class="mt-5">
              Displays more information on your brand on hover, and opens your
              URL in a new page on click.
            </li>
            <li class="mt-5">Not present on Apps Pages.</li>
          </ul>
        </div>
        <div class="ad-prototype-buttons ma-5 px-3 py-6">
          <div class="mb-3 text-center font-weight-bold">Rectangle Banners</div>
          <ul>
            <li>Your custom asset for the biggest splash on the website.</li>
            <li class="mt-5">Image anchors each page.</li>
            <li class="mt-5">Responsive design for mobile and desktop.</li>
            <li class="mt-5">
              Displays more information on your brand on hover, and opens your
              URL in a new page on click.
            </li>
          </ul>
        </div>
      </v-col> -->
      <v-col cols="12" class="pt-10 pb-2 d-flex align-center justify-center">
        <div
          :class="[
            $vuetify.breakpoint.mdAndDown ? 'mew-subtitle' : 'mew-title',
            'font-weight-regular text-center pb-5 pb-md-10'
          ]"
        >
          Ad opportunities with <br class="d-md-none" />
          MEW mobile app
        </div>
      </v-col>
      <v-col
        cols="12"
        md="12"
        class="d-flex justify-center px-16 px-sm-5 pb-12 pb-sm-16 mb-sm-10"
      >
        <img
          src="@/assets/images/backgrounds/ad-mew-wallet.png"
          width="100%"
          class="ad-mew-wallet-img"
        />
      </v-col>
      <v-col cols="12" class="pb-3 d-flex align-center justify-center">
        <div
          :class="[
            $vuetify.breakpoint.mdAndDown ? 'mew-subtitle' : 'mew-title',
            'font-weight-regular text-center pb-5 pb-md-10'
          ]"
        >
          Ad opportunities with <br class="d-md-none" />
          MEW's block explorer:<br class="d-md-none" />
          EthVM
        </div>
      </v-col>
      <v-col
        cols="12"
        md="12"
        class="d-flex justify-center px-sm-5 pb-16 mb-16"
      >
        <img
          src="@/assets/images/backgrounds/ad-ethvm.png"
          width="100%"
          class="ad-prototype-img"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
%default-shadow-and-border {
  border-radius: 12px;
  box-shadow: 0px 6px 20px 0px #182b4b1f;
  border: 1px solid #c2c7ce;
  background: white;
}
.ad-component {
  height: 138px;
  width: 350px;
  @extend %default-shadow-and-border;

  @media screen and (max-width: 1224px) {
    height: 175px;
  }

  @media screen and (max-width: 959px) {
    width: 330px;
  }
}
.ad-prototype-img {
  max-width: 900px;
}

.ad-prototype-buttons {
  width: 330px;
  height: 460px;
  @extend %default-shadow-and-border;
}

.ad-mew-wallet-img {
  max-width: 600px;
}
</style>
