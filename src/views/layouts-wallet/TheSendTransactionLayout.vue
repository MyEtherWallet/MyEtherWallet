<template>
  <div class="d-flex">
    <module-send />
    <div class="ml-4">
      <module-network />
    </div>
  </div>
</template>

<script>
import ModuleSend from '@/modules/send/ModuleSend';
import ModuleNetwork from '@/modules/network/ModuleNetwork';

export default {
  components: {
    ModuleSend,
    ModuleNetwork
  }
};
</script>

<style lang="scss"></style>
