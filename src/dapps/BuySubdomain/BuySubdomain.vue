<template>
  <div class="buy-subdomain-container">
    <back-button/>
    <div class="buy-subdomain-content">
      <div class="buy-subdomain-form-container">
        <p>Sub Domain</p>
        <form>
          <div class="subdomain-input">
            <input
              v-model="domainName"
              type="text"
              placeholder="Please Enter Sub Domain Name"
            >
            <button
              type="submit"
              @click.prevent="query">Check</button>
          </div>
        </form>
        <div v-show="results.length > 0">
          <p>All Sub domains</p>
          <div class="results-container">
            <div 
              v-for="item in results" 
              :key="domainName+item.domain" 
              class="result-item">
              <span>{{ domainName }}.{{ item.domain }}.eth</span>
              <span>
                <span class="amt">{{ $store.state.web3.utils.fromWei(item.price, 'ether') }} </span>
                <span class="currency">ETH </span>
                <button> Buy</button>
              </span>
            </div>
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
import SubdomainAbi from '@/helpers/subdomainAbi.js';
import domains from './domains.json';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'back-button': BackButton
  },
  data() {
    return {
      subdomainContract: function() {},
      ensContract: function() {},
      results: [],
      domainName: '',
      knownRegistrarInstances: {}
    };
  },
  mounted() {
    const web3C = this.$store.state.web3.eth.Contract;
    domains.forEach(domain => {
      // console.log(domain);
      const updatedDomain = Object.assign({}, domain);
      updatedDomain.contract = new web3C(SubdomainAbi, domain.registrar);
      this.knownRegistrarInstances[domain.name] = updatedDomain;
    });
  },
  methods: {
    async query() {
      this.results = [];
      const sha3 = this.$store.state.web3.utils.sha3;
      const registrarNames = Object.keys(this.knownRegistrarInstances);
      await registrarNames.forEach(async key => {
        const getSubdomain = await this.knownRegistrarInstances[
          key
        ].contract.methods
          .query(sha3(key), this.domainName)
          .call();
        this.results.push(getSubdomain);
      });
    }
    // async register(
    //   domain,
    //   subdomain,
    //   ownerAddress,
    //   referrerAddress,
    //   resolverAddress,
    //   value
    // ) {
    //   return domain.contract.register(
    //     '0x' + sha3(domain.name),
    //     subdomain,
    //     ownerAddress,
    //     referrerAddress,
    //     resolverAddress,
    //     {
    //       from: ownerAddress,
    //       value: value
    //     }
    //   );
    // },
    // async checkDomain(domains, subdomain) {
    //   const results = [];
    //   domains.forEach(async domain => {
    //     const searchDom = await this.subdomainContract.methods.query(
    //       domain,
    //       subdomain
    //     );
    //     console.log(searchDom);
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
@import 'BuySubdomain.scss';
</style>
