<template>
  <div class="tx-topmenu-popup">
    <div class="wrap">
      <div class="menu-title" @click.native="popupOpen = !popupOpen">
        <i class="indicator fa fa-circle" aria-hidden="true"></i>
        <p>
          Transactions
        </p>
        <i v-if="popupOpen" class="fa fa-angle-up" aria-hidden="true"></i>
        <i v-if="!popupOpen" class="fa fa-angle-down" aria-hidden="true"></i>
      </div>

      <div
        v-if="popupOpen"
        :class="popupOpen ? 'popup-open' : ''"
        class="popup-container">
        
        <div class="popup-box">
          <div class="top">
            <txinfo />
          </div>
          <div class="bottom">
            Check History
          </div>
        </div>

      </div><!-- .popup-container -->
    </div><!-- .wrap -->
  </div><!-- .tx-topmenu-popup -->
</template>

<script>
import TxInfoBlock from './components/TxInfoBlock';

export default {
  components: {
    txinfo: TxInfoBlock
  },
  data() {
    return {
      popupOpen: true
    };
  },
  beforeMount() {
    //document.addEventListener('click', this.clickEvent, false);
  },
  beforeDestroy() {
    //document.removeEventListener('click', this.clickEvent, false);
  },
  methods: {
    clickEvent: function(event) {
      for (let count = 0; count < event.path.length; count++) {
        if (event.path[count].className === 'popup-container') {
          return;
        }
      }
      this.popupOpen = false;
    }    
  }
};
</script>

<style lang="scss" scoped>
@import 'TxTopMenuPopup.scss';
</style>
