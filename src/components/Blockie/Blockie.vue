<template lang="html">
    <div class="addressIdenticon" ref="identicon"></div>
</template>
<script>
import {Blockies} from '@/helpers'
export default {
  props: ['address', 'width', 'height'],
  data () {
    return {}
  },
  methods: {
    setBlockie () {
      const data = Blockies({
        seed: this.address.toLowerCase(),
        size: 8,
        scale: 16
      }).toDataURL()
      this.$refs.identicon.style.width = this.width
      this.$refs.identicon.style.height = this.height
      this.$refs.identicon.style.backgroundImage = `url('${data}')`
    }
  },
  watch: {
    address () {
      this.setBlockie()
    },
    width () {
      this.setBlockie()
    },
    height () {
      this.setBlockie()
    }
  },
  mounted () {
    this.setBlockie()
  }
}
</script>
<style lang="scss" scoped>
@import "Blockie.scss";
</style>
