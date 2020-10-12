<template>
  <div class="convert-units">
    <div class="wrap">
      <div class="page-container">
        <div class="page-title">
          <page-title :options="pageTitle" />
          <i18n
            path="footer.press-kit.subtext"
            tag="div"
            class="subtitle text-center"
            ><a
              slot="mediumlink"
              href="https://medium.com/myetherwallet"
              target="_blank"
              rel="noopener noreferrer"
              >Medium blog</a
            >
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
              <div
                class="py-5 d-flex align-items-center justify-content-center"
              >
                <a :href="p.png" target="_blank">
                  <button
                    type="button"
                    class="btn btn-outline-dark btn-lg mx-2"
                  >
                    PNG
                  </button>
                </a>
                <a :href="p.svg" target="_blank">
                  <button
                    type="button"
                    class="btn btn-outline-dark btn-lg mx-2"
                  >
                    SVG
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitleComponent from '@/components/PageTitleComponent';

export default {
  components: {
    'page-title': PageTitleComponent
  },
  data() {
    return {
      pageTitle: {
        title: 'footer.press-kit.header',
        boldSubTitle: '',
        textContent: []
      },
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
@import 'PressKit.scss';
</style>
