<template>
  <mew-overlay :show-overlay="open" :title="title" right-btn-text="Cancel">
    <template v-slot:mewOverlayBody>
      <div>
        <v-sheet color="transparent" max-width="650px" class="mx-auto px-5">
          <v-row>
            <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
              <mew-super-button
                :title="btn.label"
                :subtitle="btn.description"
                :right-icon="btn.icon"
                icon-type="img"
                color-theme="basic"
              />
            </v-col>
          </v-row>
        </v-sheet>
        <div class="spacer-y-medium" />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
const TITLES = {
  0: 'Software',
  1: 'Keystore',
  2: 'Mnemonic Phrase',
  3: 'Private Key'
};

const TYPES = ['keystore', 'mnemonic', 'privateKey'];

export default {
  name: 'AccessWalletSoftware',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      titles: TITLES,
      buttons: [
        {
          label: 'Keystore',
          description: 'Access via Keystore',
          icon: require('@/assets/images/icons/icon-keystore-file.svg')
        },
        {
          label: 'Mnemonic Phrase',
          description: 'Access via Mnemonic PHrase',
          icon: require('@/assets/images/icons/icon-mnemonic.svg')
        },
        {
          label: 'Private Key',
          description: 'Access via Private Key',
          icon: require('@/assets/images/icons/icon-private-key-grey.svg')
        }
      ],
      type: '',
      step: 0
    };
  },
  computed: {
    title() {
      return this.titles[this.step];
    }
  },
  methods: {
    btnCall(str, num) {
      if (TYPES.includes(this.types)) {
        this.type = str;
      } else {
        throw new Error('Not a valid type!');
      }
      this.step = num;
    }
  }
};
</script>

<style lang="scss" scoped></style>
