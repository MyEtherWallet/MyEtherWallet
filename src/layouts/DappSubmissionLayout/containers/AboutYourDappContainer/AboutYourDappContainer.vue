<template>
  <div class="about-dapp-container">
    <b-form>
      <b-form-group label-align="left" label="DApp Name" label-for="dappName">
        <b-form-input id="dappName" type="text" required></b-form-input>
      </b-form-group>
      <b-form-group
        label-align="left"
        label="Category"
        label-for="dappCategory"
      >
        <b-form-select
          id="dappCategory"
          :options="categories"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group label-align="left" label="Tags" label-for="dappTags">
        <div class="fake-container">
          <div ref="tagHolder" class="tag-holder">
            <tag-component
              v-for="(tag, idx) in displayTags"
              :name="tag"
              :delete-func="deleteTag"
              :idx="idx"
            />
          </div>
          <b-form-input
            id="dappTags"
            ref="dappTagsInput"
            v-model="tagInput"
            type="text"
            required
          ></b-form-input>
        </div>
      </b-form-group>
      <b-form-group label-align="left" label="Description">
        <b-form-textarea
          size="lg"
          placeholder="800 characters"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
        label-align="left"
        label="DApp status"
        label-for="dappStatus"
      >
        <b-form-select
          id="dappStatus"
          :options="categories"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group label-align="left" label="Mock user flow">
        <b-form-file
          v-model="file"
          :state="false"
          placeholder="Choose a file..."
          drop-placeholder="Drop file here..."
        ></b-form-file>
      </b-form-group>

      <b-form-group label-align="left" label="DApp Name" label-for="dappName">
        <b-form-input id="dappName" type="text" required></b-form-input>
      </b-form-group>
      <b-form-group label-align="left" label="DApp Name" label-for="dappName">
        <b-form-input id="dappName" type="text" required></b-form-input>
      </b-form-group>

      <b-form-group
        label-align="left"
        label="Category"
        label-for="dappCategory"
      >
        <b-form-select
          id="dappCategory"
          :options="categories"
          required
        ></b-form-select>
      </b-form-group>
    </b-form>
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
@import 'AboutYourDappContainer.scss';
</style>
