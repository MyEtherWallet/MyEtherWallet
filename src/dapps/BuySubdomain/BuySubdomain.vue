<template>
  <div class="buy-subdomain-container">
    <back-button/>
    <div class="buy-subdomain-content">
      <div class="buy-subdomain-form-container">
        <p>Sub Domain</p>
        <form>
          <div class="subdomain-input">
            <input 
              type="text" 
              placeholder="Please Enter Sub Domain Name">
            <button 
              type="button" 
              @click.prevent="() => {}">Check</button>
          </div>
        </form>
        <p>All Sub domains</p>
        <div class="results-container">
          <div class="result-item">
            <span>myetherwallet2018.etherbase.eth</span>
            <span>
              <span class="amt">0 </span>
              <span class="currency">ETH </span>
              <button> Buy</button>
            </span>
          </div>
        </div>
      </div>
      <div>
        <interface-bottom-text
          :link-text="$t('interface.learnMore')"
          :question="$t('interface.haveIssues')"
          link="/"/>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'back-button': BackButton
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'BuySubdomain.scss';
</style>
