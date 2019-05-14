<template>
  <div>
    <b-modal
      ref="print"
      title="Print Preview"
      hide-footer
      centered
      class="nopadding print-mod"
      size="lg"
    >
      <div class="print-container">
        <div id="printContainer">
          <div class="content">
            <div class="header">
              <img src="~@/assets/images/logo.png" height="30px" />
              <div></div>
              <span>Mnemonic Phrase</span>
            </div>
            <div v-show="isTwentyFour" class="full-mnemonic">
              <div>
                <div
                  v-for="(item, idx) in mnemonic.slice(0, 12)"
                  :key="item"
                  class="item"
                >
                  <span>{{ idx + 1 }}. </span>{{ item }}
                </div>
              </div>
              <div>
                <div
                  v-for="(item, idx) in mnemonic.slice(12, 24)"
                  :key="item"
                  class="item"
                >
                  <span>{{ idx + 13 }}.</span> {{ item }}
                </div>
              </div>
            </div>
            <div v-show="!isTwentyFour" class="half-mnemonic">
              <div
                v-for="(item, idx) in mnemonic.slice(0, 12)"
                :key="item"
                class="item"
              >
                <span>{{ idx + 1 }}. </span>{{ item }}
              </div>
            </div>
          </div>
          <div class="footer">
            <div>
              <img src="~@/assets/images/icons/support.svg" />
              support@xinfin.network
            </div>
            <div>
              <img src="~@/assets/images/icons/web-solution.svg" />
              https://www.xinfin.network
            </div>
          </div>
        </div>
        <div class="button-container">
          <standard-button
            :options="printButtonOptions"
            @click.native="print"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import StandardButton from '@/components/Buttons/StandardButton';
import printJS from 'print-js';
import html2canvas from 'html2canvas';

export default {
  components: {
    'standard-button': StandardButton
  },
  props: {
    mnemonic: {
      type: Array,
      default: () => []
    },
    isTwentyFour: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      printButtonOptions: {
        title: 'Print',
        buttonStyle: 'green-border',
        noMinWidth: true,
        fullWidth: true
      }
    };
  },
  methods: {
    async print() {
      const element = document.getElementById('printContainer');
      const screen = await html2canvas(element, {
        async: true,
        logging: false
      }).then(canvas => {
        return canvas;
      });

      printJS({
        printable: screen.toDataURL('image/png'),
        type: 'image'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PrintModal.scss';
</style>
