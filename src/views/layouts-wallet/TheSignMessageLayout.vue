<template>
  <v-row>
    <v-col cols="9">
      <module-message />
    </v-col>
    <v-spacer cols="1" />
    <v-col cols="3">
      <module-network />
    </v-col>
  </v-row>
</template>

<script>
import ModuleMessage from '@/modules/message/ModuleMessageSign';
import ModuleNetwork from '@/modules/network/ModuleNetwork';

export default {
  components: {
    ModuleMessage,
    ModuleNetwork
  }
};
</script>

<style lang="scss"></style>
