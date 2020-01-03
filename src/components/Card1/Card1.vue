<template>
  <div class="card">
    <div v-if="loading" class="loading-sign">
      <b-spinner
        style="width: 4rem; height: 4rem;"
        variant="primary"
      ></b-spinner>
      <div class="font-weight-bolder mt-3">
        {{ loadingMsg }}
      </div>
    </div>
    <b-card
      :title="title"
      class="the-card"
      :class="loading ? 'card-disabled' : ''"
    >
      <b-card-text class="mb-3">
        {{ text }}
      </b-card-text>
      <div class="flex-grow-1" />
      <b-button
        class="font-weight-bold"
        variant="primary"
        block
        @click="click"
        >{{ button }}</b-button
      >
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: ''
    },
    click: {
      type: Function,
      default: function() {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingMsg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '~@/scss/GlobalVariables';

.btn {
  background-color: $mew-green;
  border-color: $mew-green;
}

.card {
  position: relative;
  height: 100%;
}

.the-card {
  height: 100%;
}

.card-disabled {
  opacity: 0.2;
  pointer-events: none;
  user-select: none;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 21px;
  font-weight: 500;
  line-height: 27px;
}

.loading-sign {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
}
</style>
