<template>
  <div
    class="background-color--transparent steppers d-flex align-center text-center border-radius--5px overflow--hidden user-select--none"
  >
    <div
      v-for="(s, key) in tabs"
      ref="tab"
      :key="key"
      class="tab position--relative pa-3"
    >
      {{ s.label }}
      <img
        class="right-arrow"
        src="@/assets/images/icons/icon-right-arrow-white.svg"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeTab: { default: 1, type: Number },
    tabs: { default: () => [], type: Array }
  },
  data() {
    return {};
  },
  mounted() {
    this.colorTabs();
  },
  methods: {
    colorTabs() {
      let activeTabMarked = false;

      for (let c = 0; this.$refs['tab'].length > c; c++) {
        if (c == this.activeTab - 1) {
          this.$refs['tab'][c].classList.add('tab-active');
          activeTabMarked = true;
        } else {
          if (activeTabMarked) {
            this.$refs['tab'][c].classList.add('tab-undone');
          } else {
            this.$refs['tab'][c].classList.add('tab-done');
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.steppers {
  > div {
    width: 100%;
  }
}
.right-arrow {
  position: absolute;
  top: -36px;
  right: -8px;
  height: 117px;
  z-index: 1;
}
.tab:last-child {
  .right-arrow {
    display: none;
  }
}
.tab-active {
  background-color: var(--v-bg_dark_blue-base);
  color: white;
}
.tab-undone {
  background-color: #e3e3e3;
  color: #a9a9a9;
}
.tab-done {
  background-color: #85939f;
  color: white;
}
</style>
