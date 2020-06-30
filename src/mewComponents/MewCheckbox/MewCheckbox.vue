<template>
  <div class="d-flex align-center"> 
    <v-checkbox
      class="titlePrimary--text"
      v-model="isChecked"
    />
    <span
      @click="onToggle()"
      class="titlePrimary--text mr-2 cursor-pointer"
    >{{ label }}
      <a
        v-if="link.url && link.title"
        :href="link.url"
      >{{ link.title }}</a>
    </span>
  </div>
</template>

<script>

export default {
  name: 'MewCheckbox',
  data() {
    return {
      isChecked: false
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    link: {
      type: Object,
      default: function() {
        return { title: '', url: ''};
      }
    }
  },
  methods: {
    onToggle() {
      this.isChecked = !this.isChecked;
    }
  }
}
</script>