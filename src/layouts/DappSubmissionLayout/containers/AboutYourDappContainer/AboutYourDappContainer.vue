<template>
  <div>
    <div class="about-dapp-container mt-5">
      <b-form>
        <b-form-group>
          <label class="dapp-label">DApp Name</label>
          <div class="dapp-input">
            <b-form-input id="dappName" type="text" required> </b-form-input>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">Category</label>
          <div class="dapp-input">
            <label class="dapp-select-label">
              <b-form-select
                id="dappCategory"
                :options="categories"
                required
              ></b-form-select>
            </label>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">Tags</label>
          <img
            class="explanation-icon"
            src="~@/assets/images/icons/explanation.png"
          />
          <div class="fake-container">
            <div ref="tagHolder" class="tag-holder">
              <tag-component
                v-for="(tag, idx) in displayTags"
                :name="tag"
                :delete-func="deleteTag"
                :idx="idx"
                :key="tag + idx"
              />
            </div>
            <!-- change to regular input -->
            <b-form-input
              id="dappTags"
              ref="dappTagsInput"
              v-model="tagInput"
              type="text"
              required
            ></b-form-input>
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">Description</label>
          <div class="dapp-input">
            <b-form-textarea
              size="lg"
              rows="7"
              placeholder="800 characters"
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
                :options="categories"
                required
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
                :options="categories"
                required
              ></b-form-select>
            </label>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">Mock user flow</label>
          <img
            class="explanation-icon"
            src="~@/assets/images/icons/explanation.png"
          />
          <p class="dapp-text-info">
            Dimensions must be 1200px width by 630px height; JPEG or PDF file
            only; Image size no large than 5M
          </p>
          <div class="dapp-input">
            <div class="upload-btn-wrapper">
              <div class="fake-input"></div>
              <button for="customUpload" class="upload-btn">Upload</button>
              <input id="customUpload" type="file" />
            </div>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">Contract address</label>
          <img
            class="explanation-icon"
            src="~@/assets/images/icons/explanation.png"
          />
          <div class="dapp-input">
            <b-form-input id="contractAddress" type="text" required>
            </b-form-input>
            <span>*</span>
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">DApp icon</label>
          <img
            class="explanation-icon"
            src="~@/assets/images/icons/explanation.png"
          />
          <div class="image-container">
            <label class="image-label" for="dappIcon">
              <i class="fa fa-cloud-upload"></i>
              <h4 class="image-text">
                Drop your icon here, or select a file from your computer.
              </h4>
              <p class="image-requirements">
                JPEG or PNG, at least 192px * 192px
              </p>
            </label>
            <input id="dappIcon" type="file" />
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">Banner</label>
          <img
            class="explanation-icon"
            src="~@/assets/images/icons/explanation.png"
          />
          <div class="image-container">
            <label class="image-label" for="bannerImage">
              <i class="fa fa-cloud-upload"></i>
              <h4 class="image-text">
                Drop your icon here, or select a file from your computer.
              </h4>
              <p class="image-requirements">
                JPEG or PNG, at least 1200px * 206px
              </p>
            </label>
            <input id="bannerImage" type="file" />
          </div>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">DApp website</label>
          <b-form-input
            id="dappWebsite"
            placeholder="URL link"
            type="text"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group>
          <label class="dapp-label">DApp contract audit</label>
          <img
            class="explanation-icon"
            src="~@/assets/images/icons/explanation.png"
          />
          <label class="dapp-select-label">
            <b-form-select
              id="dappContract"
              :options="categories"
              required
            ></b-form-select>
          </label>
        </b-form-group>
      </b-form>
    </div>
  </div>
</template>

<script>
import TagComponentVue from '../../components/TagComponent/TagComponent.vue';
export default {
  components: {
    'tag-component': TagComponentVue
  },
  data() {
    return {
      categories: [{ text: 'Select One', value: null }, 'Finance'],
      tagInput: '',
      suggestedTags: '',
      file: '',
      displayTags: []
    };
  },
  watch: {
    tagInput(newVal) {
      if (newVal.includes(' ')) {
        newVal.split(' ').forEach(item => {
          if (item.length > 0) {
            this.displayTags.push(item);
            this.tagInput = '';
            this.updateWidth();
          }
        });
      }
    }
  },
  methods: {
    deleteTag(idx) {
      this.displayTags.splice(idx, 1);
      this.updateWidth();
    },
    updateWidth() {
      this.$refs.dappTagsInput.style.paddingLeft =
        this.$refs.tagHolder.offsetWidth > 0
          ? `${this.$refs.tagHolder.offsetWidth}px`
          : '10.5px';
    }
  }
};
</script>

<style lang="scss" scoped>
// @import 'AboutYourDappContainer.scss';
@import '../AboutYourDappTeamContainer.scss';
</style>

<style lang="scss">
.dapp-label {
  margin-bottom: 10px;
  font-size: 16px;
}
</style>
