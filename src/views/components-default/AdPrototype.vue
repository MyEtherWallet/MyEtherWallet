<template>
  <div class="px-12 py-10">
    <v-row>
      <v-col cols="12" class="px-7 pb-5">
        <div
          class="d-flex flex-column flex-md-row align-center justify-space-between"
        >
          <div class="pa-6 ma-5 ad-component elevation-4">
            <div class="mew-subtitle">3 million</div>
            <div>Monthly active MyEtherWallet users</div>
          </div>
          <div class="pa-6 ma-5 ad-component elevation-4">
            <div class="mew-subtitle">Original ETH users</div>
            <div>Our users date back to 2015, the launch of Ethereum</div>
          </div>
          <div class="pa-6 ma-5 ad-component elevation-4">
            <div class="mew-subtitle">26,000</div>
            <div>Daily crypto veteran users</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="pb-10 d-flex align-center justify-center">
        <div class="mew-title font-weight-regular text-center">
          Get in front of some of Ethereum's <br class="d-none d-md-inline" />
          oldest and most savvy users.
        </div>
      </v-col>
      <v-col cols="12" md="10" offset-md="2" class="d-flex justify-center">
        <img
          src="@/assets/images/backgrounds/ad-prototype.png"
          width="100%"
          class="ad-prototype-img"
        />
      </v-col>
      <v-col
        cols="10"
        offset="1"
        class="d-flex flex-column flex-md-row align-center justify-space-between pt-10"
      >
        <div class="ad-prototype-buttons ma-5 elevation-3 px-3 py-6">
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
        <div class="ad-prototype-buttons ma-5 elevation-3 px-3 py-6">
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
        <div class="ad-prototype-buttons ma-5 elevation-3 px-3 py-6">
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
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.ad-component {
  height: 138px;
  width: 350px;
  border-radius: 5px;
}

.ad-prototype-img {
  max-width: 900px;
}

.ad-prototype-buttons {
  width: 330px;
  height: 460px;
  border-radius: 5px;
}
</style>
