<template>
  <div class="mew-component--block-header">
    <div class="top-strip" />
    <v-container
      class="contents"
      :style="{ backgroundImage: `url(${bannerImg})` }"
    >
      <v-row>
        <v-col cols="3">
          <span
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
        <v-col cols="6" class="py-6">
          <div class="d-flex align-center justify-center">
            <img
              src="@/assets/images/icons/icon-colorful-eth.svg"
              height="40"
              alt="Eth"
              class="mr-3"
            />
            <div class="white--text mew-subtitle font-weight-bold">
              {{ textObj.title }}
            </div>
          </div>
          <div
            style="max-width: 450px"
            class="textPrimary--text text-center mt-1 mx-auto"
          >
            {{ textObj.subtext }}
          </div>

          <!--
            ===================================
            Body slot contents
            ===================================
          -->
          <slot name="body" />
        </v-col>
        <v-col cols="3">3</v-col>
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
        return { title: '', subtext: '', exit: '' };
      }
    },
    /**
     * Banner image url.
     */
    bannerImg: {
      type: [String, Array],
      default: ''
    }
  },
  data: () => ({}),
  computed: {
    hasBodySlot() {
      return !!this.$slots.body;
    }
  },
  methods: {
    closeBanner() {
      this.$emit('closeBanner');
    }
  }
};
</script>

<style lang="scss" scoped>
.contents {
  background-size: cover;
  background-position: center center;
}

.top-strip {
  height: 8px;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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
