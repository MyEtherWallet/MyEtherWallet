<template>
  <div class="mew-component--block-header">
    <div v-if="topStrip" class="top-strip" />
    <v-container
      class="contents"
      :style="{ backgroundImage: `url(${bannerImg})` }"
    >
      <v-row>
        <v-col cols="12" md="3">
          <span
            v-if="!noBackBtn"
            class="
              captionPrimary--text
              mew-heading-3
              font-weight-medium
              cursor-pointer
              pa-1
            "
            @click="closeBanner"
          >
            <v-icon small color="captionPrimary">mdi-arrow-left-thick</v-icon>
            Dapp center
          </span>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="py-6 d-flex align-center justify-center"
          style="min-height: 150px"
        >
          <div>
            <div
              class="d-block d-sm-flex align-center justify-center text-center"
            >
              <img
                v-if="titleIcon"
                :src="titleIcon"
                height="40"
                alt="Icon"
                class="mr-sm-3"
              />
              <div
                class="white--text mew-subtitle font-weight-bold text-center"
              >
                {{ textObj.title }}
              </div>
            </div>
            <div
              v-if="textObj.subtext"
              style="max-width: 450px"
              class="text-center mt-1 mx-auto"
              :class="
                textObj.subtextClass ? textObj.subtextClass : 'white--text'
              "
            >
              {{ textObj.subtext }}
            </div>

            <!--
            ===================================
            Body slot contents
            ===================================
            -->
            <slot name="body" />
          </div>
        </v-col>
        <v-col cols="12" md="3">
          <slot name="right" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'BlockHeader',
  props: {
    /**
     * Text obj contains title, subtext and exit text , i.e. { title: '' , subtext: '', exit: ''}
     */
    textObj: {
      type: Object,
      default: () => {
        return {
          title: '',
          subtext: '',
          subtextClass: '',
          exit: ''
        };
      }
    },
    /**
     * Banner image url.
     */
    bannerImg: {
      type: [String, Array],
      default: ''
    },
    titleIcon: {
      type: String,
      default: ''
    },
    noBackBtn: {
      default: false,
      type: Boolean
    },
    topStrip: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({}),
  methods: {
    closeBanner() {
      this.$emit('closeBanner');
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--block-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
}

.contents {
  background-size: cover;
  background-position: center center;
}

.top-strip {
  height: 8px;
  width: 100%;
  background: rgb(255, 188, 239);
  background: linear-gradient(
    90deg,
    rgba(255, 188, 239, 1) 0%,
    rgba(215, 226, 98, 1) 34%,
    rgba(85, 231, 144, 1) 46%,
    rgba(0, 212, 255, 1) 100%
  );
}
</style>
