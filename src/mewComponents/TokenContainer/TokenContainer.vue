<template>
  <img
    :height="getSize()"
    :src="icon ? icon : placeholder"
    alt="icon"
  >
</template>



<script>
import placeholder from '@/assets/images/icons/footer/eth.png';

export default {
  data() {
    return {
      placeholder: placeholder,
      sizeOptions: {
        small: 'small',
        medium: 'medium',
        large: 'large'
      }
    }
  },
  props: {
    /**
     * Accepts small, medium or large sizes. 
     */
    size: {
      type: String,
      default: 'small'
    },
    /**
     * Icon url
     */
    icon: {
      type: [ String, Array],
      default: ''
    }
  },
  methods: {
    getSize() {
      if (this.size.toLowerCase() === this.sizeOptions.small) {
        return 30;
      }

      if (this.size.toLowerCase() === this.sizeOptions.medium) {
        return 40; 
      }

      if (this.size.toLowerCase() === this.sizeOptions.medium) {
        return 50; 
      }
    }
  }
}

</script>