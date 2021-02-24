<template>
  <v-row>
    <v-col cols="12" md="8">
      <module-send />
    </v-col>
    <v-col cols="12" md="4">
      <module-network />
    </v-col>
  </v-row>
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
