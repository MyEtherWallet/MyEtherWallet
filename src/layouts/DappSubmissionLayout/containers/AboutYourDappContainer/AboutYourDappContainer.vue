<template>
  <div>
    <div class="about-container mt-5">
      <b-form>
        <b-form-group>
          <label class="dapp-label">DApp Name</label>
          <div class="dapp-input">
            <b-form-input
              id="dappName"
              type="text"
              v-model="dappName"
              @update="updateName">
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
          <label
            class="dapp-label">Tags
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
                  class="dapp-tags-input"
                  ref="dappTagsInput"
                  type="text"
                  v-model="tagInput"
                  @keyup="onKeyDown"
                  @change="updateTags(tagInput)"/>
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
        <b-form-group>
          <label class="dapp-label">Description</label>
          <div class="dapp-input">
            <b-form-textarea
              placeholder="800 characters"
              rows="7"
              size="lg"
              @update="updateDescription"
            ></b-form-textarea>
            <span>*</span>
          </div>
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
          <label
            class="dapp-label">Mock user flow
            <popover
              class="dapp-popover"
              :popcontent="$t('dappsSubmission.mockUserFlow')"
            ></popover>
          </label>
          <p class="dapp-text-info mb-3">
            Dimensions must be 1200px width by 630px height; JPEG or PDF file
            only; Image size no large than 5M
          </p>
          <div class="dapp-input">
            <label for="customUpload" class="upload-btn-wrapper">
              <div class="fake-input">
                <p class="file-name">{{mockUserFlowFile}}</p>
              </div>
              <button class="upload-btn">Upload</button>
            </label>
            <input @change="onMockFileChange" id="customUpload" type="file" />
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group>
          <label
            class="dapp-label">Contract address
            <popover
              class="dapp-popover"
              :popcontent="$t('dappsSubmission.contractAddress')"
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
          <label
            class="dapp-label">DApp icon
            <popover
              class="dapp-popover"
              :popcontent="$t('dappsSubmission.dappIcon')"
            ></popover>
          </label>
          <div class="image-container">
            <label class="image-label" for="dappIcon">
              <div class="image-placeholder" v-if="!dappIconFile">
                <i class="fa fa-cloud-upload"></i>
                <h4 class="image-text">
                  Drop your icon here, or select a file from your computer.
                </h4>
                <p class="image-requirements">
                  JPEG or PNG, at least 192px * 192px
                </p>
              </div>
              <div v-if="dappIconFile">{{dappIconFile}}</div>
              <b-form-file
                drop-placeholder="Drop your icon here"
                id="dappIcon"
                type="file"
                @change="onDappIconChange">
              </b-form-file>
            </label>
          </div>
        </b-form-group>
        <b-form-group>
          <label
            class="dapp-label">Banner
            <popover
              class="dapp-popover"
              :popcontent="$t('dappsSubmission.banner')"
            ></popover>
          </label>
          <div class="image-container">
            <label class="image-label" for="bannerImage">
              <div class="image-placeholder" v-if="!bannerFile">
                <i class="fa fa-cloud-upload"></i>
                <h4 class="image-text">
                  Drop your image here, or select a file from your computer.
                </h4>
                <p class="image-requirements">
                  JPEG or PNG, at least 1200px * 206px
                </p>
              </div>
              <div v-if="bannerFile">{{bannerFile}}</div>
              <b-form-file
                drop-placeholder="Drop your banner here"
                id="bannerImage"
                type="file"
                @change="onBannerChange">
              </b-form-file>
            </label>
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">DApp website</label>
          <b-form-input
            id="dappWebsite"
            placeholder="URL link"
            type="text"
            @update="updateDappWeb"
            v-model="dappWebsite"
          >
          </b-form-input>
        </b-form-group>
        <b-form-group>
          <label
            class="dapp-label">DApp contract audit
            <popover
              class="dapp-popover"
              :popcontent="$t('dappsSubmission.contractAudit')"
            ></popover>
          </label>
          <label class="dapp-select-label">
            <b-form-select
              v-model="dappContract"
              id="dappContract"
              :options="dappContractOptions"
              @change="updateContractAudit"
            ></b-form-select>
          </label>
        </b-form-group>
      </b-form>
    </div>
  </div>
</template>

<script>
import TagComponentVue from '../../components/TagComponent/TagComponent.vue';
import PopOver from '@/components/PopOver';

export default {
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
    },
    updateDescription: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    'tag-component': TagComponentVue,
    'popover': PopOver
  },
  data() {
    return {
      tag: '',
      tags: [],
      dappCategory: null,
      dappCategories: [
        { value: null, text: 'Please select' },
        { value: 'Games', text: 'Games'},
        { value: 'Social', text: 'Social'},
        { value: 'Finance', text: 'Finance'},
        { value: 'High risk', text: 'High risk'},
        { value: 'Exchanges', text: 'Exchanges'},
        { value: 'Development', text: 'Development'},
        { value: 'Media', text: 'Media'},
        { value: 'Wallet', text: 'Wallet'},
        { value: 'Security', text: 'Security'},
        { value: 'Property', text: 'Property'},
        { value: 'Marketplaces', text: 'Marketplaces'},
        { value: 'Governance', text: 'Governance'},
        { value: 'Storage', text: 'Storage'},
        { value: 'Identity', text: 'Identity'},
        { value: 'Energy', text: 'Energy'},
        { value: 'Insurance', text: 'Insurance'},
        { value: 'Health', text: 'Health'},
        { value: 'Other', text: 'Other'}
      ],
      dappUsMarket: null,
      dappUsMarketOptions: [
        { value: null, text: 'Please select'},
        { value: 'Yes', text: 'Yes'},
        { value: 'No', text: 'No'}
      ],
      dappStatus: null,
      dappStatusOptions: [
        { value: null, text: 'Please select'},
        { value: 'Live', text: 'Live'},
        { value: 'Beta', text: 'Beta'},
        { value: 'Prototype', text: 'Prototype'},
        { value: 'Work in progress', text: 'Work in progress'},
        { value: 'Concept', text: 'Concept'},
        { value: 'Broken', text: 'Broken'},
        { value: 'Stealth', text: 'Stealth'},
        { value: 'Abandoned', text: 'Abandoned'}
      ],
      dappContract: null,
      dappContractOptions: [
        { value: null, text: 'Please select'},
      ],
      tagInput: '',
      suggestedTags: '',
      mockUserFlowFile: '',
      displayTags: [],
      dappName: '',
      contractAddress: '',
      dappWebsite: '',
      dappIconFile: '',
      bannerFile: ''
    };
  },
  methods: {
    onKeyDown(e) {
      if (e.keyCode === 13 && this.$refs.tagHolder.offsetWidth <= (this.$refs.dappTagsInput.offsetWidth - 10)) {
        if (this.tagInput.length > 0) {
          this.displayTags.push(this.tagInput);
          this.tagInput = '';
          setTimeout(() => this.updateWidth());
        }
      } else if (e.keyCode === 8) {
        if (this.tagInput.length <= 0) {
          const lastTag = this.displayTags.splice(this.displayTags.length-1, 1);
          setTimeout(() => {this.updateWidth(); this.tagInput = lastTag.toString()});
        }
      }
    },
    deleteTag(idx) {
      this.displayTags.splice(idx, 1);
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
      this.mockUserFlowFile = file.name;
      this.updateMockFlow(file);
    },
    onDappIconChange(e) {
      console.error('e', e)
      const file = e.target.files[0];
      this.dappIconFile = file.name;
      this.updateDappIcon(file);
    },
    onBannerChange(e) {
      const file = e.target.files[0];
      this.bannerFile = file.name;
      this.updateBanner(file);
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
}
.custom-file-input {
  height: 100%;
}
.custom-file-label {
  height: 100%;
  opacity: 0;
}
</style>
