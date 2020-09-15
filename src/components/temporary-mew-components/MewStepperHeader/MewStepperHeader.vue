<template>
  <div>
    <div class="steppers d-flex align-stretch">
      <div
        v-for="(s, key) in tabs"
        ref="tab"
        :key="key"
        class="tab position--relative"
      >
        <div class="desktop-content d-none d-md-block py-3">
          <div class="d-flex align-center justify-center">
            <div>STEP {{ key + 1 }}.</div>
            <div>{{ s.label }}</div>
          </div>
          <img
            class="right-arrow"
            src="@/assets/images/icons/icon-right-arrow-white.svg"
          />
        </div>
        <div class="mobile-content d-block d-md-none">
          <div
            class="d-flex flex-column align-center justify-center text-center py-2 px-4"
          >
            <div>STEP {{ key + 1 }}.</div>
            <div>{{ s.label }}</div>
          </div>
          <img
            class="right-arrow"
            src="@/assets/images/icons/icon-right-arrow-white.svg"
          />
        </div>
      </div>
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
  watch: {
    activeTab() {
      this.colorTabs();
    }
  },
  mounted() {
    this.colorTabs();
  },
  methods: {
    colorTabs() {
      let activeTabMarked = false;

      for (let c = 0; this.$refs['tab'].length > c; c++) {
        if (c == this.activeTab - 1) {
          this.$refs['tab'][c].classList.remove(
            'tab-active',
            'tab-undone',
            'tab-done'
          );
          this.$refs['tab'][c].classList.add('tab-active');
          activeTabMarked = true;
        } else {
          if (activeTabMarked) {
            this.$refs['tab'][c].classList.remove(
              'tab-active',
              'tab-undone',
              'tab-done'
            );
            this.$refs['tab'][c].classList.add('tab-undone');
          } else {
            this.$refs['tab'][c].classList.remove(
              'tab-active',
              'tab-undone',
              'tab-done'
            );
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
  user-select: none;
  border-radius: 7px;
  overflow: hidden;
  > div {
    width: 100%;
  }
}
.desktop-content {
  .right-arrow {
    position: absolute;
    top: -36px;
    right: -8px;
    height: 117px;
    z-index: 1;
  }
}
.mobile-content {
  .right-arrow {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    right: -15px;
    height: 192px;
    z-index: 1;
  }
}
.tab:last-child {
  .right-arrow {
    display: none;
  }
}
.tab-active {
  background-color: #184f90;
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
