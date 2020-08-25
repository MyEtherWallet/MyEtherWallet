<template>
  <div class="position--relative bg_overlay border-radius--5px">
    <div class="right-arrow d-flex align-center justify-center">
      <v-icon class="gray_text--text">mdi-arrow-right-thick</v-icon>
    </div>
    <v-row>
      <v-col cols="6" class="text-center px-10 py-6">
        <div class="blockie mb-3">
          <blockie width="36px" height="36px" :address="from" />
        </div>
        <h6 class="font-weight-bold text-uppercase gray_text--text">
          From address
        </h6>
        <div class="d-flex align-center">
          <div class="text-uppercase monospace address">{{ from }}</div>
          <div class="text-uppercase monospace">
            {{ from.substr(to.length - 5) }}
          </div>
        </div>
      </v-col>
      <v-col cols="6" class="text-center px-10 py-6">
        <div class="blockie mb-3">
          <blockie width="36px" height="36px" :address="to" />
        </div>
        <h6 class="font-weight-bold text-uppercase gray_text--text">
          To address
        </h6>
        <div class="d-flex align-center">
          <div class="text-uppercase monospace address">{{ to }}</div>
          <div class="text-uppercase monospace">
            {{ to.substr(to.length - 5) }}
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    from: { default: '', type: String },
    to: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.address {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.blockie {
  border: 2px solid white;
  border-radius: 100%;
  height: 40px;
  width: 40px;
  margin: 0 auto;
}
.right-arrow {
  background-color: var(--v-bg_white_sheet-base);
  border-radius: 100%;
  height: 40px;
  width: 40px;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
}
</style>
