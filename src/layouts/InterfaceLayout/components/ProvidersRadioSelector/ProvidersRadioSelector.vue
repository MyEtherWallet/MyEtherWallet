<template>
  <div class="providers-radio-selector">
    <div class="radio-button-container">
      <ul>
        <li v-for="provider in providers" v-bind:key="provider.key">
          <div class="mew-custom-form__radio-button">
            <input type="radio" name="provider" :id="provider.name">
            <label :for="provider.name"></label>
          </div>
          <div class="provider-image">
            <img :src="provider.image">
          </div>
          <div>
            {{provider.swapValue1}}
          </div>
          <div>
            {{provider.swapValue2}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import KyberNetwork from '@/assets/images/etc/kybernetowrk.png'
import Bity from '@/assets/images/etc/bity.png'

export default {
  props: [],
  components: {

  },
  methods: {

  },
  data () {
    return {
      providers: [
        {
          name: 'kybernetwork',
          image: KyberNetwork,
          swapValue1: '1 BTC = 21.43572 ETH',
          swapValue2: '1 BTC = 493.34285 REP'
        },
        {
          name: 'bity',
          image: Bity,
          swapValue1: '1 ETH = 0.35636 BTC',
          swapValue2: '1 ETH = 16.34285 REP'
        }
      ]
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
  @import "ProvidersRadioSelector.scss";
</style>
