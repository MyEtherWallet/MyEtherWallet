<template>
  <div class="mew-component--why-mew">
    <div class="desktop-content d-none d-lg-block">
      <div class="py-6" />
      <v-container>
        <v-sheet color="transparent" max-width="400px">
          <div class="mew-heading-3 text-uppercase textLight--text mb-1">
            {{
              $t('home.about-mew.subheading')
                | lokalise('home.about-mew.subheading')
            }}
          </div>
          <h1 class="mb-9">
            {{
              $t('home.about-mew.heading') | lokalise('home.about-mew.heading')
            }}
          </h1>
        </v-sheet>

        <div class="d-flex">
          <mew-info-card
            class="d-flex align-end block-box-shadow"
            :title="$t('home.about-mew.card-one.title')"
            :desc="$t('home.about-mew.card-one.text')"
            :icon="require('@/assets/images/icons/icon-faces-mew.svg')"
          />
          <div class="pa-4"></div>

          <div class="d-flex flex-column">
            <mew-info-card
              class="full-height"
              max-width="600"
              :title="$t('home.about-mew.card-two.title')"
              :desc="$t('home.about-mew.card-two.text')"
            />
            <div class="pa-4"></div>
            <mew-info-card
              class="full-height"
              max-width="600"
              :title="$t('home.about-mew.card-three.title')"
              :desc="$t('home.about-mew.card-three.text')"
            />
          </div>

          <div class="pa-4"></div>
          <mew-info-card
            :title="$t('home.about-mew.card-four.title')"
            :desc="$t('home.about-mew.card-four.text')"
            :link="{
              title: $t('home.about-mew.card-four.link'),
              url: 'https://www.mewwallet.com/'
            }"
          >
            <template #titleIconContainer>
              <img
                src="@/assets/images/icons/icon-appstore-apple-dark.svg"
                alt="Apple app store"
                class="ml-2 mr-1"
              />
              <img
                src="@/assets/images/icons/icon-appstore-android-dark.svg"
                alt="Android store"
              />
            </template>
            <template #cardImg>
              <img
                class="card-img"
                width="200"
                src="@/assets/images/snippets/bg-mew-wallet.png"
                alt="MEW wallet"
              />
            </template>
          </mew-info-card>
        </div>
      </v-container>
      <div class="py-12" />
    </div>
    <div class="mobile-content d-block d-lg-none">
      <div class="py-7" />
      <v-container>
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <v-sheet color="transparent" max-width="400px" class="mb-9">
            <h5 class="font-weight-bold text-uppercase textLight--text mb-2">
              {{ $t('home.about-mew.subheading') }}
            </h5>
            <h1>{{ $t('home.about-mew.heading') }}</h1>
          </v-sheet>

          <mew-info-card
            class="d-flex align-end block-box-shadow mx-auto mb-6"
            :title="$t('home.about-mew.card-one.title')"
            :desc="$t('home.about-mew.card-one.text')"
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
            :icon="require('@/assets/images/icons/icon-faces-mew.svg')"
          />

          <mew-info-card
            class="full-height mx-auto mb-6"
            :title="$t('home.about-mew.card-two.title')"
            :desc="$t('home.about-mew.card-two.text')"
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
          />

          <mew-info-card
            class="full-height mx-auto mb-6"
            :title="$t('home.about-mew.card-three.title')"
            :desc="$t('home.about-mew.card-three.text')"
            :link="{
              title: 'Learn more',
              url: 'www.myetherwallet.com'
            }"
          />

          <mew-info-card
            class="mx-auto"
            :title="$t('home.about-mew.card-four.title')"
            :desc="$t('home.about-mew.card-four.text')"
            :link="{
              title: $t('home.about-mew.card-four.link'),
              url: 'www.myetherwallet.com'
            }"
          >
            <template #titleIconContainer>
              <div class="ml-2">
                <img
                  src="@/assets/images/icons/icon-appstore-apple-dark.svg"
                  alt="Apple app store"
                  class="mr-1"
                />
                <img
                  src="@/assets/images/icons/icon-appstore-android-dark.svg"
                  alt="Android store"
                />
              </div>
            </template>
            <template #cardImg>
              <img
                class="card-img"
                width="200"
                src="@/assets/images/snippets/bg-mew-wallet.png"
                alt="MEW wallet"
              />
            </template>
          </mew-info-card>
        </v-sheet>
      </v-container>
      <div class="py-7" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeWhyMew',
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.desktop-content {
  .card-img {
    margin-bottom: -5px;
  }
  .info-card {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid var(--v-greyMedium-base) !important;
  }
}

.mobile-content {
  .card-img {
    margin-bottom: -5px;
  }
  .info-card {
    max-width: initial !important;
    width: 100%;
    margin-bottom: 1rem;
  }
  .info-card {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid var(--v-greyMedium-base) !important;
  }
}
</style>

<style lang="scss">
.mew-component--why-mew {
  .v-card__title {
    word-break: initial !important;
    line-height: 1.5rem !important;
  }
}
</style>
