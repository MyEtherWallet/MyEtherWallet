<template>
  <div class="d-flex">
    <div v-if="icon" class="mr-3 pt-1">
      <img :src="icon" width="32" />
    </div>
    <div>
      <div v-if="text1" class="text-uppercase font-weight-bold">
        {{ text1 }}
      </div>
      <div v-if="text2" class="display-1">{{ text2 }}</div>
      <div v-if="text3" class="text-color--mew-green font-weight-bold">
        {{ text3 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: { default: '', type: String },
    text1: { default: '', type: String },
    text2: { default: '', type: String },
    text3: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>
