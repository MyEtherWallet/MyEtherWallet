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
          <StdButton
            color="dark_sacramento"
            outlined
            size="x-large"
            class="mr-2"
            @click.native="show = false"
            >Cancel</StdButton
          >
          <StdButton color="light_red" size="x-large">Logout</StdButton>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/Dialogs/BaseDialog';
import StdButton from '@/web/components/StdButton';

export default {
  components: { BaseDialog, StdButton },
  props: {},
  data() {
    return { show: true };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
