<template>
  <div class="d-flex">
    <div v-if="icon" class="mr-3 pt-1">
      <img :src="icon" width="35" />
    </div>
    <div>
      <div v-if="text1" class="text-uppercase font-weight-bold">
        {{ text1 }}
      </div>
      <div v-if="text2" class="display-1 font-weight-bold">
        {{ text2 }}
        <span v-if="currency" class="body-2 font-weight-regular">
          {{ currency }}
        </span>
      </div>
      <div v-if="text3" class="gray1--text font-weight-bold">
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
    text3: { default: '', type: String },
    currency: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>
