<template>
  <div>
    <div class="about-dapp-container mt-5">
      <b-form>
        <b-form-group
          label-class="dapp-label"
          label-align="left"
          label="DApp Name"
          label-for="dappName"
        > 
          <div class="dapp-input">
            <b-form-input
              id="dappName"
              type="text"
              required>
            </b-form-input>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group
          label-class="dapp-label"
          label-align="left"
          label="Category"
          label-for="dappCategory"
        >
          <div class="dapp-input">
            <b-form-select
              id="dappCategory"
              :options="categories"
              required
            ></b-form-select>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group
          label-class="dapp-label"
          label-align="left"
          label="Tags"
          label-for="dappTags"> 
          <b-form-input
            id="dappTags"
            type="text"
            required>
          </b-form-input>
        </b-form-group>
        <b-form-group
          label-class="dapp-text-label"
          label-align="left"
          label="Description">
          <div class="dapp-input">
            <b-form-textarea
              size="lg"
              rows="7"
              placeholder="800 characters"
            ></b-form-textarea>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group
          label-class="dapp-label"
          label-align="left"
          label="DApp status"
          label-for="dappStatus"
        >
          <div class="dapp-input">
            <b-form-select
              id="dappStatus"
              :options="categories"
              required
            ></b-form-select>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group
          label-align="left"
          label-class="dapp-text-label"
          label="Mock user flow">
          <p class="dapp-text-info">Dimensions must be 1200px width by 630px height; JPEG or PDF file only; Image size no large than 5M</p>
          <label for="file-upload" class="custom-file-upload">
              <i class="fa fa-cloud-upload"></i> Custom Upload
          </label>
          <div class="dapp-input">
            <b-form-file
              v-model="file"
              :state="false"
              placeholder="Choose a file..."
              drop-placeholder="Drop file here..."
            ></b-form-file>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group 
          label-class="dapp-label"
          label-align="left"
          label="Contract address"
          label-for="contractAddress">
          <div class="dapp-input">
            <b-form-input
              id="contractAddress"
              type="text"
              required>
            </b-form-input>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group
          label-align="left"
          label-class="dapp-label"
          label="DApp icon"
          label-for="dappIcon">
          <p>Dimensions must be 192px width by 192px height; JPEG or PNG file only; Image size no large than 1M.</p>
          <b-form-file
            id="dappIcon"
            v-model="file"
            :state="false"
            placeholder="Choose a file..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>
        <b-form-group
          label-align="left"
          label-class="dapp-label"
          label="Banner Image"
          label-for="bannerImage">
          <p>Dimensions must be 1200 width by 206px height, JPEG or PNG file only; Image size no large than 5M</p>
          <b-form-file
            id="bannerImage"
            v-model="file"
            :state="false"
            placeholder="Choose a file..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>
         <b-form-group 
          label-class="dapp-label"
          label-align="left"
          label="DApp website"
          label-for="dappWebsite">
          <b-form-input
            placeholder="URL link"
            id="dappWebsite"
            type="text"
            required>
          </b-form-input>
        </b-form-group>
        <b-form-group
          label-class="dapp-label"
          label-align="left"
          label="DApp contract audit"
          label-for="dappContractAudit"
        >
          <b-form-select
            id="dappContract"
            :options="categories"
            required
          ></b-form-select>
        </b-form-group>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progressBarValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      categories: [{ value: null, text: 'Select One' }, 'Finance']
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'AboutYourDappContainer.scss';
</style>

<style lang="scss">
  .dapp-label {
    margin-bottom: 10px;
    font-size: 16px;
  }
  .dapp-text-label {
    font-size: 16px;
  }
  input[type="file"] {
    display: none;
  } 

</style>