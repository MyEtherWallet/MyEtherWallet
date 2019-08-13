<template>
  <div class="about-dapp-container">
    <b-form>
      <b-form-group class="form-label mt-2" label="DApp Name" label-for="dappName">
        <b-form-input id="dappName" type="text" required></b-form-input>
      </b-form-group>
      <b-form-group class="form-label" label="Category" label-for="dappCategory">
        <b-form-select
          id="dappCategory"
          :options="categories"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group class="form-label" label="Tags" label-for="dappTags">
        <b-form-input id="dappTags" type="text" required></b-form-input>
      </b-form-group>
      <b-form-group class="form-label" label="Description">
        <b-form-textarea
          size="lg"
          placeholder="800 characters"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group class="form-label" label="DApp status" label-for="dappStatus">
        <b-form-select
          id="dappStatus"
          :options="categories"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group class="form-label" label="Mock user flow">
        <b-form-file
          v-model="file"
          :state="false"
          placeholder="Choose a file..."
          drop-placeholder="Drop file here..."
        ></b-form-file>
      </b-form-group>

      <b-form-group class="form-label" label="DApp Name" label-for="dappName">
        <b-form-input id="dappName" type="text" required></b-form-input>
      </b-form-group>
      <b-form-group class="form-label" label="DApp Name" label-for="dappName">
        <b-form-input id="dappName" type="text" required></b-form-input>
      </b-form-group>

      <b-form-group class="form-label" label="Category" label-for="dappCategory">
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
export default {
  data() {
    return {
      categories: [{ text: 'Select One', value: null }, 'Finance']
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'AboutYourDappContainer.scss';
</style>
