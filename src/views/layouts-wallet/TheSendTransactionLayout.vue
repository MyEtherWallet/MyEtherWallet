<template>
  <v-row>
    <v-col cols="9">
      <module-send />
    </v-col>
    <v-spacer cols="1" />
    <v-col cols="3">
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
