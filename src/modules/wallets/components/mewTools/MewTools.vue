<template>
  <div class="mew-component--mew-tools">
    <v-dialog v-model="dialog" width="320" @input="$emit('input', dialog)">
      <div class="pa-3 white">
        <v-row>
          <v-col
            v-for="(t, key) in tools"
            :key="key"
            cols="4"
            class="text-center cursor--pointer"
          >
            <img :src="t.img" :alt="t.label" height="60" />
            <div>{{ t.label }}</div>
          </v-col>
        </v-row>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      tools: [
        {
          label: 'MEW web',
          img: require('@/assets/images/icons/icon-mew-logo.png')
        },
        {
          label: 'EthVM',
          img: require('@/assets/images/icons/icon-ethvm.png')
        },
        {
          label: 'MEW CX',
          img: require('@/assets/images/icons/icon-mew-cx.png')
        },
        {
          label: 'MEW wallet App',
          img: require('@/assets/images/icons/icon-mew-wallet.png')
        },
        {
          label: 'MEW connect protocol',
          img: require('@/assets/images/icons/icon-mew-connect.png')
        },
        {
          label: 'MEW topia',
          img: require('@/assets/images/icons/icon-puppy-mew.svg')
        },
        {
          label: 'Support center',
          img: require('@/assets/images/icons/icon-customer-support.svg')
        }
      ]
    };
  },
  watch: {
    value(newVal) {
      this.dialog = newVal;
    }
  }
};
</script>

<style lang="scss" scoped></style>
