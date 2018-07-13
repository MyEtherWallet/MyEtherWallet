<template>
  <div class="transaction-tokens">
    <div class="wrap">
      <div class="tokens-container">
        <div class="token-search">
          <div class="block-title">
            <h4>Tokens</h4>
            <p>+ Custome Token</p>
          </div>
          <div class="search-block dropdown-select-search-1">
            <v-select :options="['foo','bar']"></v-select>
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
        </div>
        <div class="token-table-container">
          <table>
            <tr>
              <td>AIX</td>
              <td>43545.0000</td>
            </tr>
            <tr>
              <td>ALCO</td>
              <td>343435.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
            <tr>
              <td>ALIS</td>
              <td>3434.0000</td>
            </tr>
          </table>
        </div>
        <div v-on:click="tokenListExpend" class="expend-bar">
          <p class="down"><i class="fa fa-angle-double-down" aria-hidden="true"></i></p>
          <p class="up hidden"><i class="fa fa-angle-double-up" aria-hidden="true"></i></p>
        </div>
      </div> <!-- .tokens-container -->
      <div class="bottom-image-container">
        <img class="icon" src="~@/assets/images/etc/admewconnect.png">
      </div>
    </div><!-- .wrap -->
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    tokenListExpend: function () {
      document.querySelector('.token-table-container').classList.toggle('expended')
      document.querySelector('.expend-bar .down').classList.toggle('hidden')
      document.querySelector('.expend-bar .up').classList.toggle('hidden')
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionTokens.scss";
</style>
