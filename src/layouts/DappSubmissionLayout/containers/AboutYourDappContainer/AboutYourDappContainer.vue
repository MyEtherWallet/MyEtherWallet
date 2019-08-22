<template>
  <div class="about-your-dapp w-50 mb-5 mt-5">
    <b-form onsubmit="return false;">
      <b-form-group>
        <label class="dapp-label">DApp Name</label>
        <div class="dapp-input">
          <b-form-input
            id="dappName"
            v-model="dappName"
            type="text"
            @update="updateName"
          >
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">Category</label>
        <div class="dapp-input">
          <label class="dapp-select-label">
            <b-form-select
              id="dappCategory"
              :options="dappCategories"
              v-model="dappCategory"
              @change="updateCategory"
            ></b-form-select>
          </label>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group class="input-tags-group">
        <label class="dapp-label"
          >Tags
          <popover
            :popcontent="$t('dappsSubmission.tags')"
            class="dapp-popover"
          ></popover>
        </label>
        <div class="input-tags-container">
          <div class="tag-wrapper">
            <div ref="tagHolder" class="tag-holder">
              <tag-component
                v-for="(tag, idx) in displayTags"
                ref="tagContainer"
                :name="tag"
                :delete-func="deleteTag"
                :idx="idx"
                :key="tag + idx"
              />
            </div>
            <div class="dapp-input">
              <input
                id="dappTags"
                ref="dappTagsInput"
                v-model="tagInput"
                class="dapp-tags-input"
                type="text"
                @keyup="onKeyDown"
              />
            </div>
          </div>
          <span>*</span>
        </div>
      </b-form-group>
      <div class="suggested-tags-container mb-3">
        <p class="title">Suggested Tags</p>
        <p class="tags">
          <span>games</span>
          <span>gambling</span>
          <span>social</span>
          <span>finance</span>
          <span>high risk</span>
          <span>wallet</span>
        </p>
      </div>
      <b-form-group id="form-group-description">
        <label class="dapp-label">Description</label>
        <b-form-invalid-feedback id="form-group-description">
          This is a required field.
        </b-form-invalid-feedback>
        <div class="dapp-input">
          <b-form-textarea
            v-validate="'max:800'"
            v-model="dappDescription"
            name="description"
            placeholder="800 characters"
            rows="7"
            size="lg"
            @update="
              updateDescription(dappDescription, errors.has('description'))
            "
          ></b-form-textarea>
          <span>*</span>
        </div>
        <p v-if="errors.has('description')" class="error">
          {{ errors.first('description') }}
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >Will your DApp be released in the U.S. market?</label
        >
        <div class="dapp-input">
          <label class="dapp-select-label">
            <b-form-select
              id="dappUsMarket"
              :options="dappUsMarketOptions"
              v-model="dappUsMarket"
              @change="updateUsMarket"
            ></b-form-select>
          </label>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">DApp status</label>
        <div class="dapp-input">
          <label class="dapp-select-label">
            <b-form-select
              id="dappStatus"
              :options="dappStatusOptions"
              v-model="dappStatus"
              @change="updateDappStatus"
            ></b-form-select>
          </label>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >Mock user flow
          <popover
            :popcontent="$t('dappsSubmission.mockUserFlow')"
            class="dapp-popover"
          ></popover>
        </label>
        <p class="dapp-text-info mb-3">
          Dimensions must be 1200px width by 630px height; JPEG or PDF file
          only; Image size no large than 5M
        </p>
        <div class="dapp-input">
          <label for="customUpload" class="upload-btn-wrapper">
            <div class="fake-input">
              <p class="file-name">{{ mockUserFlowFile }}</p>
            </div>
            <button class="upload-btn">Upload</button>
          </label>
          <input
            id="customUpload"
            ref="mockUserFlow"
            type="file"
            @change="onMockFileChange"
          />
          <span>*</span>
        </div>
        <p v-if="mockFileError" class="error">
          The image dimensions are too big. Dimensions must be 1200px width by
          630px height.
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >Contract address
          <popover
            :popcontent="$t('dappsSubmission.contractAddress')"
            class="dapp-popover"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input
            id="contractAddress"
            v-model="contractAddress"
            type="text"
            @update="updateContractAddress"
          >
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">
          <span class="dapp-icon-label"> DApp icon </span>
          <popover
            :popcontent="$t('dappsSubmission.dappIcon')"
            class="dapp-popover"
          ></popover>
          <label v-if="dappIconUrl" for="dappIcon" class="replace-label"
            >Replace</label
          >
        </label>
        <div
          :class="dappIconUrl ? 'dapp-icon-uploaded ' : ''"
          class="image-container"
        >
          <label class="image-label" for="dappIcon">
            <div class="image-placeholder">
              <i v-if="!dappIconUrl" class="fa fa-cloud-upload"></i>
              <h4 class="image-text">
                Drop your icon here, or select a file from your computer.
              </h4>
              <p class="image-requirements">
                JPEG or PNG, at least 192px * 192px
              </p>
            </div>
            <img v-if="dappIconUrl" :src="dappIconUrl" class="dapp-icon-img" />
            <b-form-file
              id="dappIcon"
              drop-placeholder="Drop your icon here"
              type="file"
              @change="onDappIconChange"
            ></b-form-file>
          </label>
        </div>
        <p v-if="dappIconError" class="error">
          The image dimensions are too big. Dimensions must be 192px by 192px.
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >Banner
          <popover
            :popcontent="$t('dappsSubmission.banner')"
            class="dapp-popover"
          ></popover>
          <label v-if="bannerUrl" for="bannerImage" class="replace-label"
            >Replace</label
          >
        </label>
        <div
          :class="bannerUrl ? 'banner-uploaded ' : ''"
          class="image-container"
        >
          <label class="image-label" for="bannerImage">
            <div class="image-placeholder">
              <i v-if="!bannerUrl" class="fa fa-cloud-upload"></i>
              <h4 class="image-text">
                Drop your image here, or select a file from your computer.
              </h4>
              <p class="image-requirements">
                JPEG or PNG, at least 1200px * 206px
              </p>
            </div>
            <img v-if="bannerUrl" :src="bannerUrl" class="banner-img" />
            <b-form-file
              id="bannerImage"
              accept="image/*"
              drop-placeholder="Drop your banner here"
              type="file"
              @change="onBannerChange"
            >
            </b-form-file>
          </label>
        </div>
        <p v-if="bannerError" class="error">
          The image dimensions are too small. Dimensions must be at least 1200px
          * 206px.
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">DApp website</label>
        <b-form-input
          v-validate="'url:require_protocol'"
          id="dappWebsite"
          v-model="dappWebsite"
          name="website"
          placeholder="URL link"
          type="text"
          @update="updateDappWeb(dappWebsite, errors.has('website'))"
        ></b-form-input>
        <p v-if="errors.has('website')" class="error">
          {{ errors.first('website') }}
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >DApp contract audit
          <popover
            :popcontent="$t('dappsSubmission.contractAudit')"
            class="dapp-popover"
          ></popover>
        </label>
        <label class="dapp-select-label">
          <b-form-select
            id="dappContract"
            v-model="dappContract"
            :options="dappContractOptions"
            @change="updateContractAudit"
          ></b-form-select>
        </label>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import TagComponentVue from '../../components/TagComponent/TagComponent.vue';
import PopOver from '@/components/PopOver';

export default {
  components: {
    'tag-component': TagComponentVue,
    popover: PopOver
  },
  props: {
    updateName: {
      type: Function,
      default: () => {}
    },
    updateCategory: {
      type: Function,
      default: () => {}
    },
    updateTags: {
      type: Function,
      default: () => {}
    },
    updateDescription: {
      type: Function,
      default: () => {}
    },
    updateUsMarket: {
      type: Function,
      default: () => {}
    },
    updateDappStatus: {
      type: Function,
      default: () => {}
    },
    updateMockFlow: {
      type: Function,
      default: () => {}
    },
    updateContractAddress: {
      type: Function,
      default: () => {}
    },
    updateDappIcon: {
      type: Function,
      default: () => {}
    },
    updateBanner: {
      type: Function,
      default: () => {}
    },
    updateDappWeb: {
      type: Function,
      default: () => {}
    },
    updateContractAudit: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      tag: '',
      tags: [],
      dappCategory: null,
      dappCategories: [
        { value: null, text: 'Please select' },
        { value: 'Games', text: 'Games' },
        { value: 'Social', text: 'Social' },
        { value: 'Finance', text: 'Finance' },
        { value: 'High risk', text: 'High risk' },
        { value: 'Exchanges', text: 'Exchanges' },
        { value: 'Development', text: 'Development' },
        { value: 'Media', text: 'Media' },
        { value: 'Wallet', text: 'Wallet' },
        { value: 'Security', text: 'Security' },
        { value: 'Property', text: 'Property' },
        { value: 'Marketplaces', text: 'Marketplaces' },
        { value: 'Governance', text: 'Governance' },
        { value: 'Storage', text: 'Storage' },
        { value: 'Identity', text: 'Identity' },
        { value: 'Energy', text: 'Energy' },
        { value: 'Insurance', text: 'Insurance' },
        { value: 'Health', text: 'Health' },
        { value: 'Other', text: 'Other' }
      ],
      dappUsMarket: null,
      dappUsMarketOptions: [
        { value: null, text: 'Please select' },
        { value: 'Yes', text: 'Yes' },
        { value: 'No', text: 'No' }
      ],
      dappStatus: null,
      dappStatusOptions: [
        { value: null, text: 'Please select' },
        { value: 'Live', text: 'Live' },
        { value: 'Beta', text: 'Beta' },
        { value: 'Prototype', text: 'Prototype' },
        { value: 'Work in progress', text: 'Work in progress' },
        { value: 'Concept', text: 'Concept' },
        { value: 'Broken', text: 'Broken' },
        { value: 'Stealth', text: 'Stealth' },
        { value: 'Abandoned', text: 'Abandoned' }
      ],
      dappContract: null,
      dappContractOptions: [{ value: null, text: 'Please select' }],
      tagInput: '',
      suggestedTags: '',
      mockUserFlowFile: '',
      displayTags: [],
      dappName: '',
      contractAddress: '',
      dappWebsite: '',
      dappIconUrl: '',
      bannerUrl: '',
      dappDescription: '',
      mockFileError: false,
      dappIconError: false,
      bannerError: false
    };
  },
  computed: {
    isFormDirty() {
      console.error('in here');
      return Object.keys(this.fields).some(key => this.fields[key].dirty);
    }
  },
  methods: {
    onKeyDown(e) {
      if (
        e.keyCode === 13 &&
        this.$refs.tagHolder.offsetWidth <=
          this.$refs.dappTagsInput.offsetWidth - 10
      ) {
        if (this.tagInput.length > 0) {
          this.displayTags.push(this.tagInput);
          this.tagInput = '';
          setTimeout(() => this.updateWidth());
        }
      } else if (e.keyCode === 8) {
        if (this.tagInput.length <= 0) {
          const lastTag = this.displayTags.splice(
            this.displayTags.length - 1,
            1
          );
          setTimeout(() => {
            this.updateWidth();
            this.tagInput = lastTag.toString();
          });
        }
      }
      this.updateTags(this.displayTags);
    },
    deleteTag(idx) {
      this.displayTags.splice(idx, 1);
      this.updateTags(this.displayTags);
      setTimeout(() => this.updateWidth());
    },
    updateWidth() {
      this.$refs.dappTagsInput.style.paddingLeft =
        this.$refs.tagHolder.offsetWidth > 0
          ? `${this.$refs.tagHolder.offsetWidth + 8}px`
          : '10.5px';
    },
    onMockFileChange(e) {
      const file = e.target.files[0];

      if (file.size > 1200 * 630) {
        this.mockFileError = true;
        this.updateMockFlow('', true);
      } else {
        this.mockFileError = false;
        this.mockUserFlowFile = file.name;
        this.updateMockFlow(URL.createObjectURL(file), false);
      }
    },
    onDappIconChange(e) {
      const file =
        e.type === 'drop' ? e.dataTransfer.files[0] : e.target.files[0];

      if (file.size > 192 * 192) {
        this.dappIconError = true;
        this.updateDappIcon('', true);
      } else {
        this.dappIconError = false;
        this.dappIconUrl = URL.createObjectURL(file);
        this.updateDappIcon(this.dappIconUrl, false);
      }
    },
    onBannerChange(e) {
      const file =
        e.type === 'drop' ? e.dataTransfer.files[0] : e.target.files[0];

      if (file.size < 1200 * 206) {
        this.bannerError = true;
        this.updateBanner('', true);
      } else {
        this.bannerError = false;
        this.bannerUrl = URL.createObjectURL(file);
        this.updateBanner(this.bannerUrl);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AboutYourDappContainer.scss';
@import '../AboutYourDappTeamContainer.scss';
</style>

<style lang="scss">
.dapp-label {
  align-items: center;
  display: flex;
  font-size: 16px;
  margin-bottom: 10px;
  width: 90%;
}
.custom-file-input {
  height: 100%;
}
.custom-file-label {
  height: 100%;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &.dragging {
    opacity: 1;
    border-color: #05c0a5;
  }
}

.custom-file-label::after {
  opacity: 0;
}
</style>
