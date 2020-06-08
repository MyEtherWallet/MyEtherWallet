<template>
  <BaseDialog :show="show" width="450px">
    <template v-slot:opener>
      <slot />
    </template>
    <template v-slot:content>
      <div class="text-center py-8">
        <div class="mb-5 font-weight-bold title">
          Are you sure you want to log out?
        </div>
        <div class="d-flex align-center justify-center">
          <mew6-std-btn
            color="dark_sacramento"
            outlined
            size="x-large"
            class="mr-2"
            @click.native="show = false"
            >Cancel</mew6-std-btn
          >
          <mew6-std-btn color="light_red" size="x-large">Logout</mew6-std-btn>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/Dialogs/BaseDialog';

export default {
  components: { BaseDialog },
  props: {},
  data() {
    return { show: true };
  }
};
</script>

<style lang="scss" scoped></style>
