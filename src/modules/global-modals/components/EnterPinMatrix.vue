<template>
  <v-sheet class="border-radius--10px pa-4 pa-md-10">
    <div class="pin-input-block">
      <i18n path="accessWallet.pin.enter" tag="p" class="main-title"
        ><span slot="device"> KeepKey</span></i18n
      >
      <p class="sub-title">
        {{ $t('accessWallet.pin.layout') }}
      </p>
      <div class="input-container">
        <div class="input-headers">
          <p>{{ $t('accessWallet.pin.string') }}</p>
          <span @click="keepKeyClear">{{ $t('common.clear') }}</span>
        </div>
        <input v-model.lazy="pin" type="password" readonly="true" />
      </div>
    </div>
    <div class="button-matrix-block">
      <button
        v-for="(pos, idx) in positions"
        :key="pos + idx"
        @click="pin += pos"
      ></button>
    </div>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      pin: '',
      positions: ['7', '8', '9', '4', '5', '6', '1', '2', '3']
    };
  },
  watch: {
    pin(newVal) {
      this.$emit('password', newVal);
    }
  },
  methods: {
    keepKeyClear() {
      this.pin = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.pin-input-block {
  margin-bottom: 30px;

  .input-container {
    display: flex;
    flex-direction: column;

    .input-headers {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 0 10px 5px;
    }

    p {
      font-weight: bold;
      font-size: 16px;
    }

    input {
      background-color: #f9f9f9;
      border: 1px solid #f9f9f9;
      font-size: 14px;
      height: 55px;
      padding: 0 20px;
      width: 100%;
    }

    span {
      color: #05c0a5;
      cursor: pointer;
    }
  }
}
.button-matrix-block {
  $button-element-size: 70px;
  $grid-width-size: $button-element-size + 2px;

  margin-top: 10px;
  display: grid;
  justify-items: center;
  justify-content: center;
  grid-gap: 10px;
  grid-template-columns: $grid-width-size $grid-width-size $grid-width-size;
  padding-bottom: 20px;
  button {
    cursor: pointer;
    background: #dadada;
    border: 1px solid #dadada;
    height: $button-element-size;
    width: $button-element-size;
    border-radius: 5px;
    position: relative;

    &:active {
      background-color: #05c0a5;
    }

    &::after {
      height: 8px;
      width: 8px;
      background-color: #05c0a5;
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      content: '';
      border-radius: 100%;
    }
  }
}
</style>
