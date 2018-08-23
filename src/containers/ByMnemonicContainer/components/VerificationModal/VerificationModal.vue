<template>
  <b-modal ref="verification" hide-footer centered class="bootstrap-modal-wide verification nopadding" title="Verification">
    <div class="content-block">
      <p class="block-title">Please enter and fill out the empty boxes below to verify your mnemonic phrase key.</p>

      <div class="verificationTest">
        <div v-for="verifyItemRow in mnemonicVerificationItems" v-bind:key="verifyItemRow.key">
          <p>{{verifyItemRow.num + 1}}.</p>
          <ul>
            <li v-for="item in verifyItemRow.data" v-bind:key="item.key">
              <label><input type="radio" :name="verifyItemRow.num" :value="item.correctItem">{{item.value}}</label>
            </li>
          </ul>
        </div>
      </div>

      <!-- Old verification form is hidden, so if we can use it later in the future if we need it. -->
      <div class="phrases hidden">
        <ul>
          <li class="word" v-for="(value, index) in mnemonicValues" v-bind:key="index" v-bind:data-index="index + 1">
            {{index + 1}}.<span>{{value}}</span>
            <input class="hidden" type="text" name="" autocomplete="off" />
          </li>
        </ul>
      </div>
      <!-- Old verification is hidden, so if we can use it later in the future if we need it. -->

      <div class="button-container">
        <div v-on:click="checkVerificationPassed" class="verify-button large-round-button-green-filled">
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
      mnemonicVerificationItems: [],
      randTestItems: []
    }
  },
  methods: {
    checkVerificationPassed () {
      var trueCount = 0

      for (let c = 0; c < this.randTestItems.length; c++) {
        var radios = document.getElementsByName(this.randTestItems[c])

        for (var i = 0, length = radios.length; i < length; i++) {
          if (radios[i].checked) {
            // do whatever you want with the checked radio
            if (radios[i].value === 'true') {
              trueCount++
            }

            // only one radio can be logically checked, don't check the rest
            break
          }
        }
      }

      console.log(trueCount)

      if (trueCount === 3) {
        this.mnemonicDoneModalOpen()
      }
    },
    removeElFromArray (arr, value) {
      return arr.filter(function (ele) {
        return ele !== value
      })
    },
    getRandMnemonicElements (mnemonic, howMany) {
      var mnemonicCount = mnemonic.length

      var arr = []
      while (arr.length < howMany) {
        var randomnumber = Math.floor(Math.random() * mnemonicCount)
        if (arr.indexOf(randomnumber) > -1) continue
        arr[arr.length] = randomnumber
      }
      return arr.sort((a, b) => a - b)
    },
    shuffleArray (a) {
      var j, x, i
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
      }
      return a
    }
  },
  watch: {
    // When "mnemonicValues" changes, reselect verification items.
    mnemonicValues: function (mnemonicValArray) {
      // Get 3 random "array index" for "mnemonicValues"
      var randItems = this.getRandMnemonicElements(mnemonicValArray, 3)
      this.randTestItems = randItems

      for (let c = 0; c < randItems.length; c++) {
        // Remove randItems from Mnemonic Value Array
        let newMnemonicValArray = this.removeElFromArray(mnemonicValArray, mnemonicValArray[randItems[c]])

        // Shuffle array
        newMnemonicValArray = this.shuffleArray(newMnemonicValArray)

        this.mnemonicVerificationItems[c] = {
          num: randItems[c],
          data: [
            {
              value: newMnemonicValArray[0],
              correctItem: false
            },
            {
              value: newMnemonicValArray[1],
              correctItem: false
            },
            {
              value: mnemonicValArray[randItems[c]],
              correctItem: true
            }
          ]
        }

        this.shuffleArray(this.mnemonicVerificationItems[c].data)
      }

      // console.log(this.mnemonicVerificationItems)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "VerificationModal.scss";
</style>
