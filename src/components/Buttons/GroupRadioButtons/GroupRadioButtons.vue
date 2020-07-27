<template>
  <div>
    <v-radio-group v-model="radioGroup">
      <div v-for="(group, key) in buttons" :key="key">
        <h5 class="font-weight-bold">{{ group.groupName }}</h5>
        <v-row>
          <v-col
            v-for="(btn, btnKey) in group.btns"
            :key="btnKey"
            class="ma-0 py-1"
            cols="6"
          >
            <v-radio :label="btn.label" :value="btn.value" />
          </v-col>
        </v-row>
      </div>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    buttons: { default: () => [], type: Array }
  },
  data() {
    return {
      radioGroup: ''
    };
  }
};
</script>

<style lang="scss" scoped></style>
