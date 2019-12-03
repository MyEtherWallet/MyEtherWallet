<template>
  <div>
    <v-btn color="red lighten-2" @click="dialog = true">
      QRCode
    </v-btn>

    <v-dialog v-model="dialog" :width="width">
      <div class="white">
        <div class="d-flex align-center py-3">
          <div class="pl-6 title font-weight-black">
            {{ title }}
          </div>

          <v-spacer />

          <div class="pr-3">
            <v-btn icon @click="dialog = false">
              <ModalCloseButton />
            </v-btn>
          </div>
        </div>

        <v-divider></v-divider>

        <div class="pa-7">
          <slot />
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import ModalCloseButton from '@/components/Common/ModalCloseButton';

export default {
  components: { ModalCloseButton },
  props: {
    width: { default: '', type: String },
    title: { default: '', type: String }
  },
  data: () => ({
    dialog: true
  })
};
</script>

<style lang="scss" scoped></style>
