<template>
  <b-modal ref="verification" hide-footer centered class="bootstrap-modal-wide verification nopadding" title="Verification">
    <div class="content-block">
      <p class="block-title">Please enter and fill out the empty boxes below to verify your mnemonic phrase key.</p>
      <div class="phrases">
        <ul>
          <li class="word" v-for="(value, index) in mnemonicValues" v-bind:key="index" v-bind:data-index="index + 1">
            {{index + 1}}.<span>{{value}}</span>
            <input class="hidden" type="text" name="" autocomplete="off" />
          </li>
        </ul>
      </div>
      <div class="button-container">
        <div v-on:click="mnemonicDoneModalOpen" class="verify-button large-round-button-green-filled">
          Verify
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
// import Web3 from 'web3'

export default {
  props: ['mnemonicValues', 'mnemonicDoneModalOpen'],
  data () {
    return {
      mnemonicVerificationItems: [
        [
          { value: '', correctItem: false },
          { value: '', correctItem: false },
          { value: '', correctItem: false }
        ],
        [
          { value: '', correctItem: false },
          { value: '', correctItem: false },
          { value: '', correctItem: false }
        ],
        [
          { value: '', correctItem: false },
          { value: '', correctItem: false },
          { value: '', correctItem: false }
        ]
      ]
    }
  },
  methods: {

  },
  watch: {
    mnemonicValues: function (mnemonicVal) {
      // When mnemonic value changes, we pick 3 mnemonic values to verification.

      var mnemonicCount = mnemonicVal.length

      var ranItems = []
      while (ranItems.length < 3) {
        var randomnumber = Math.floor(Math.random() * mnemonicCount) + 1
        if (ranItems.indexOf(randomnumber) > -1) continue
        ranItems[ranItems.length] = randomnumber
      }
      console.log(ranItems)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "VerificationModal.scss";
</style>
