<template>
  <div class="modal-container">

    <b-modal
      ref="settings"
      title="Settings"
      hide-footer
      centered
      class="bootstrap-modal nopadding">

      <div class="modal-contents">
        
        <full-width-dropdown 
          title="Transaction Speed" 
          popup="What is TX speed" 
          class="tx-speed">
          <div class="radio-buttons">
            <ul>
              <li class="selected">
                <div>
                  <input 
                    id="aaa" 
                    type="radio" 
                    name="gender" 
                    value="male" 
                    checked="checked">
                  <label for="aaa">Slow (2000 Gwei)</label>
                </div>
                <p>0.000013 ETH ($1.34)</p>
              </li>
              <li>
                <div>
                  <input 
                    id="bbb" 
                    type="radio" 
                    name="gender" 
                    value="female">
                  <label for="bbb">Regular (8000 Gwei)</label>
                </div>
                <p>0.000023ETH ($3.23)</p>
              </li>
              <li>
                <div>
                  <input 
                    id="ccc" 
                    type="radio" 
                    name="gender" 
                    value="other">
                  <label for="ccc">Fast (12000 Gwei)</label>
                </div>
                <p>0.000063ETH ($5.16)</p>
              </li>
              <li>
                <div>
                  <input 
                    id="ccc" 
                    type="radio" 
                    name="gender" 
                    value="other">
                  <input 
                    type="text" 
                    name="">
                  <p class="gwei">Gwei</p>
                </div>
                <p>0.000063ETH ($5.16)</p>
              </li>
            </ul>
          </div>
          <div class="button-block">
            <standard-button :options="buttonSave" />
          </div>
        </full-width-dropdown>
       
        <full-width-dropdown 
          title="Import Configurations" 
          class="import-config">
          <p>Please click the button below to open and import you configuration file from your local computer.</p>
          <div class="import-button-block">
            <standard-input :options="inputFileName" />
            <standard-button :options="buttonUploadFile" />
          </div>
          <div class="button-block">
            <standard-button :options="buttonImport" />
          </div>
        </full-width-dropdown>

        <full-width-dropdown 
          title="Export Configurations" 
          class="export-config">
          <p>Please click the button below to download your configuration file into your local computer.</p>
          <div class="button-block">
            <standard-button :options="buttonExport" />
          </div>
        </full-width-dropdown>

      </div>
    </b-modal>    
  </div>
</template>

<script>
import FullWidthDropdownMenu from '@/components/FullWidthDropdownMenu';

export default {
  name: 'Settings',
  components: {
    'full-width-dropdown': FullWidthDropdownMenu
  },
  data() {
    return {
      buttonSave: {
        title: 'Save',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false
      },
      buttonUploadFile: {
        title: 'Upload File...',
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false,
        noMinWidth: true
      },
      buttonImport: {
        title: 'Import',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false,
        noMinWidth: false
      },
      buttonExport: {
        title: 'Export',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false,
        noMinWidth: false
      },
      inputFileName: {
        title: '',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      }
    };
  },
  mounted() {},
  methods: {
    modalOpen() {
      this.$refs.settings.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SettingsModal.scss';
</style>
