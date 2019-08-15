<template>
  <div class="about-team-container mt-5">
    <b-form>
      <b-form-group>
        <label 
          class="dapp-label">Authors
          <more-info></more-info>
        </label>
        <div class="dapp-input">
          <b-form-input 
            id="authors"
            type="text"
            placeholder="e.g. James Lee; Emilie Roy; Edward McCormick"
            required>
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label
          class="dapp-label">My full name
          <more-info></more-info>
        </label>
        <div class="dapp-input">
          <b-form-input 
            id="fullName"
            type="text"
            required>
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label
          class="dapp-label">My email
          <more-info></more-info>
        </label>
        <div class="dapp-input">
          <b-form-input 
            id="emailAddress"
            type="text"
            required>
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <div class="social-links-container">
          <label class="dapp-label"> Company social links</label>
          <button class="add-btn pull-right">Add +</button>
        </div>
      </b-form-group>
      <b-form-group>
        <label
          class="dapp-label">Company website
          <more-info></more-info>
        </label>
        <div class="dapp-input">
          <b-form-input 
            id="companyWebsite"
            type="text"
            placeholder="URL link"
            required>
          </b-form-input>
        </div>
      </b-form-group>
      <b-form-group>
        <label 
          class="dapp-label">Software license 
          <more-info></more-info>
        </label>
        <div class="dapp-input">
          <b-form-input 
            id="softwareLicense"
            type="text"
            required>
          </b-form-input>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">Additional notes</label>
        <div class="dapp-input">
          <b-form-textarea
            size="lg"
            rows="5"
            placeholder="300 characters"
          ></b-form-textarea>
        </div>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import MoreInfoComponent from '../../components/MoreInfoComponent';

export default {
  components: {
    'more-info': MoreInfoComponent
  }
};
</script>

<style lang="scss" scoped>
@import 'AboutYourTeamContainer.scss';
@import '../AboutYourDappTeamContainer.scss';
</style>

<style lang="scss">
.dapp-label {
  margin-bottom: 10px;
  font-size: 16px;
  display: flex;
}
</style>