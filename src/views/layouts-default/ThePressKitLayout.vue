<template>
  <div class="wrap">
    <v-container>
      <div class="page-container">
        <div class="page-title text-center">
          <h1>{{ $t('footer.press-kit.header') }}</h1>
          <i18n
            path="footer.press-kit.subtext"
            tag="div"
            class="h5 text-center mt-3"
          >
            <a
              slot="mediumlink"
              href="https://medium.com/myetherwallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              Medium blog
            </a>
            <a
              slot="hyperlink"
              href="mailto:mew@dittopr.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              mew@dittopr.co
            </a>
          </i18n>
        </div>

        <div class="row" style="margin-top: 70px">
          <div
            v-for="(p, key) in pressAssets"
            :key="key"
            class="col-sm-6 col-md-4 mb-5"
          >
            <div class="press-item">
              <div class="img-asset" :class="p.color">
                <img :src="p.png" alt="Image Asset" :style="p.style" />
              </div>
              <div class="py-5 d-flex align-center justify-center">
                <a :href="p.png" target="_blank">
                  <v-btn outlined medium fab color="greenPrimary"> PNG </v-btn>
                </a>
                <div class="px-2"></div>
                <a :href="p.svg" target="_blank">
                  <v-btn outlined medium fab color="greenPrimary"> SVG </v-btn>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      pressAssets: [
        {
          color: '',
          style: '',
          png: require('@/assets/images/presskit/logo-dark.png'),
          svg: require('@/assets/images/presskit/logo-dark.svg')
        },
        {
          color: 'light',
          style: '',
          png: require('@/assets/images/presskit/logo-light.png'),
          svg: require('@/assets/images/presskit/logo-light.svg')
        },
        {
          color: '',
          style: 'width: 110px; height: 110px;',
          png: require('@/assets/images/presskit/logo-simple.png'),
          svg: require('@/assets/images/presskit/logo-simple.svg')
        },
        {
          color: 'light',
          style: 'width: 110px; height: 110px;',
          png: require('@/assets/images/presskit/logo-simple.png'),
          svg: require('@/assets/images/presskit/logo-simple.svg')
        },
        {
          color: '',
          style: 'width: 120px; height: 120px;',
          png: require('@/assets/images/presskit/logo-kid.png'),
          svg: require('@/assets/images/presskit/logo-kid.svg')
        },
        {
          color: 'light',
          style: 'width: 120px; height: 120px;',
          png: require('@/assets/images/presskit/logo-kid.png'),
          svg: require('@/assets/images/presskit/logo-kid.svg')
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
$background-color: #f2f4fa;
$tablet-width: 700px;
$mobile-width: 500px;

.wrap {
  background-color: $background-color;
  background-image: url('~@/assets/images/backgrounds/bg-right-bubble.png'),
    url('~@/assets/images/backgrounds/bg-left-bubble.png');
  background-repeat: no-repeat, no-repeat;
}

// Desktop
@media all and (min-width: calc(#{$tablet-width} + 1px)) {
  .wrap {
    padding: 100px 0;
    background-position: right top, left 80px;
  }
}

// Tablet
@media all and (min-width: calc(#{$mobile-width} + 1px)) and (max-width: $tablet-width) {
  .wrap {
    padding: 50px 0;
    background-position: calc(100% + 35px) -70px, -60px 80px;
    background-size: 100px, 200px;
  }
}

// Mobile
@media all and (max-width: $mobile-width) {
  .wrap {
    padding: 50px 0;
    background-position: calc(100% + 35px) -70px, -60px 80px;
    background-size: 100px, 170px;
  }
}

.subtitle {
  max-width: 550px;
  margin: 20px auto 0 auto;
  line-height: 25px;
}

.press-item {
  background-color: white;
  border-radius: 5px;
  overflow: hidden;

  .img-asset {
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.light {
      background-color: #184f90;
    }

    > img {
      width: 70%;
    }
  }
}

.btn {
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 11px 26px !important;
}
</style>
