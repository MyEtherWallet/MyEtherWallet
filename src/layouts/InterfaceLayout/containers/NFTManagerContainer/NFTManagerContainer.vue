<template>
  <div class="crypto-kitties-manager">
    <interface-container-title title="NFT Manager" />
    <div class="inner-side-menu content-container">
      <nft-side-menu
        :data="sideMenuData"
        :nft-config="nftConfig"
        @selected="changeSelectedContract"
      >
        <input type="text" placeholder="Search #" />
      </nft-side-menu>
      <div v-if="showDetails">
        <nft-details
          :nft="detailsFor"
          :selected-title="nftTitle"
          @back="comeBack"
        ></nft-details>
      </div>
      <div v-if="!showDetails">
        <content-block-title :button-text="ntfCount" :title="nftTitle" />
        <!-- TODO Clean Up Design and Improve Mobile -->
        <div class="grid-container">
          <div v-for="nft in nftToShow" :key="nft.key" class="kitty">
            <div class="kitty-img" @click="showNftDetails(nft)">
              <div v-show="!hasImage(nft)" class="placeholder">
                <div class="animated-background"></div>
              </div>
              <div v-show="hasImage(nft)">
                <img :src="getImage(nft)" />
              </div>
              <p>#{{ nft.token }}</p>
            </div>
          </div>
          <div v-show="selectedNtf.count > 9" class="internal-nav-container">
            <span
              v-show="startIndex > 0"
              class="internal-nav prev"
              @click="getPrevious()"
            >
              <i class="fa fa-chevron-left"></i>
            </span>
            Showing {{ startIndex }} -{{ endIndex }}
            <span
              v-show="showNextButton"
              class="internal-nav next"
              @click="getNext()"
            >
              <i class="fa fa-chevron-right"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex--row--align-start mft-manager-content-container"></div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import ContentBlockTitle from '@/layouts/InterfaceLayout/components/ContentBlockTitle';
import NFTSideMenu from '@/layouts/InterfaceLayout/containers/NFTManagerContainer/components/NFTSideMenu';
import NftDetails from './containers/NftDetails';
import { mapState } from 'vuex';
import hexDecoder from './binaryDecoderNFT';
import { nftABI } from './abis';
import fetch from 'node-fetch';

const URL_BASE = 'https://swap.mewapi.io/nft';

export default {
  components: {
    'content-block-title': ContentBlockTitle,
    'nft-side-menu': NFTSideMenu,
    'interface-container-title': InterfaceContainerTitle,
    'nft-details': NftDetails
  },
  props: {},
  data() {
    return {
      nftABI,
      countPerPage: 9,
      nftConfig: [],
      tokenHelper: {},
      imagesRetrieved: false,
      showDetails: false,
      selectedContract: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      detailsFor: {},
      nftTokens: {},
      nftData: {},
      ownedTokens: [],
      tokenContractAddress: '0xeA3352C1a3480Ac5a32Fcd1F2854529BA7193F14'
    };
  },
  computed: {
    ...mapState([
      'account',
      'gasPrice',
      'web3',
      'network',
      'linkQuery',
      'online'
    ]),
    startIndex() {
      if (this.nftData[this.selectedContract]) {
        return this.nftData[this.selectedContract].currentIndex;
      }
      return 0;
    },
    showNextButton() {
      if (this.nftData[this.selectedContract]) {
        const ids_retrieved = this.nftData[this.selectedContract].count;
        return (
          this.endIndex !== ids_retrieved &&
          this.endIndex + this.countPerPage <= ids_retrieved
        );
      }
    },
    endIndex() {
      if (this.nftData[this.selectedContract]) {
        const ids_retrieved = this.nftData[this.selectedContract].details
          .length;
        const increment =
          ids_retrieved > this.countPerPage ? this.countPerPage : ids_retrieved;
        return this.nftData[this.selectedContract].currentIndex + increment;
      }
    },
    nftToShow() {
      return this.nftData[this.selectedContract]
        ? this.nftData[this.selectedContract].details.slice(
            this.nftData[this.selectedContract].currentIndex,
            this.nftData[this.selectedContract].currentIndex + this.countPerPage
          )
        : [];
    },
    sideMenuData() {
      return this.nftData;
    },
    selectedNtf() {
      if (this.nftData[this.selectedContract]) {
        return this.nftData[this.selectedContract];
      }
      return {};
    },
    nftTitle() {
      if (this.nftData[this.selectedContract]) {
        return this.nftData[this.selectedContract].title;
      }
      return 'Loading';
    },
    ntfCount() {
      if (this.nftData[this.selectedContract]) {
        return this.$t('dapps.nftOwnCount', {
          perPage: this.countPerPage,
          count: this.nftData[this.selectedContract].count
        });
      }

      return this.$t('dapps.noneOwned');
    }
  },
  watch: {},
  async mounted() {
    const stateItems = {
      count: 0,
      selected: false,
      startIndex: 0,
      priorIndex: 0,
      currentIndex: 0,
      details: []
    };
    const configData = await this.getTokenConfig();

    this.nftConfig = configData.map(entry => {
      return {
        ...entry,
        contract: entry.contractAddress
      };
    });
    this.nftData = this.nftConfig.reduce((accumulator, currentValue) => {
      accumulator[currentValue.contract] = {
        ...currentValue,
        ...stateItems
      };
      return accumulator;
    }, {});
    this.getOwnedCounts();
    this.getOwned();
  },
  methods: {
    changeSelectedContract(selectedContract) {
      this.selectedContract = selectedContract;
      this.showDetails = false;
    },
    hasImage(nft) {
      return nft.image !== '';
    },
    getImage(nft) {
      return nft.image;
    },
    comeBack() {
      this.showDetails = false;
    },
    showNftDetails(nft) {
      this.detailsFor = nft;
      this.showDetails = true;
    },
    async getTokenConfig() {
      const data = await fetch(`${URL_BASE}?supported=true`, {
        mode: 'cors',
        cache: 'no-cache',
        method: 'GET'
      });
      return await data.json();
    },
    async getNftImage(contract, token) {
      const image = await fetch(
        `${URL_BASE}?contract=${contract}&token=${token}`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET'
        }
      );
      return await image.text();
    },
    async getOwnedCounts() {
      const supportedNftTokens = this.nftConfig
        .filter(entry => entry.ERC721Extension)
        .map(entry => entry.contract);
      const tokenContract = new this.web3.eth.Contract(nftABI);
      tokenContract.options.address = this.tokenContractAddress;
      const address = this.account.address;
      const res = await tokenContract.methods
        .getTokenBalances(supportedNftTokens, address.toLowerCase())
        .call();
      hexDecoder(res).map((val, idx) => {
        this.nftData[supportedNftTokens[idx]].count = Number.isNaN(
          val.toNumber()
        )
          ? 0
          : val.toNumber();
        return val.toString();
      });
    },
    async getOwned(address = this.account.address, nftData = this.nftData) {
      if (!this.processing) {
        this.processing = true;
        const supportedNftTokens = Object.keys(nftData);

        const result = await this.getOwnedTokens(
          supportedNftTokens,
          address,
          nftData
        );
        this.ready = true;
        this.processing = false;
        this.imagesRetrieved = true;
        return result;
      }
    },
    async getOwnedTokens(contracts, address, nftData) {
      const tokenContract = new this.web3.eth.Contract(nftABI);
      tokenContract.options.address = this.tokenContractAddress;

      for (let i = 0; i < contracts.length; i++) {
        nftData = await this.processNftDataContract(
          contracts[i],
          nftData,
          address,
          tokenContract
        );
      }
      this.imagesRetrieved = true;
      this.nftData = nftData;
      return await this.getImages(nftData);
    },
    async processNftDataContract(
      contract,
      nftData,
      address = this.account.address,
      tokenContract = null
    ) {
      if (nftData[contract].ERC721Extension) {
        nftData[contract].details = await this.getOwnedStandard(
          contract,
          0,
          this.countPerPage,
          address,
          tokenContract
        );
        return nftData;
      } else if (nftData[contract].nonStandard) {
        try {
          const nonStandard = await this.getOwnedNonStandard(contract, address);
          nftData[contract].details = this.processor(
            nftData[contract].details,
            contract,
            nonStandard
          );
          nftData[contract].count = JSON.parse(nonStandard).total;
        } catch (e) {
          nftData[contract].details = [];
        }
      }
      return nftData;
    },
    async getOwnedNonStandard(contract, address, offset = 0) {
      const data = await fetch(
        `${URL_BASE}?nonStandardContract=${contract}&address=${address}&offset=${offset}`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET'
        }
      );
      return await data.json();
    },
    async getOwnedStandard(
      contract,
      offset,
      count = this.countPerPage,
      address = this.account.address,
      tokenContract = undefined
    ) {
      if (!tokenContract) {
        tokenContract = new this.web3.eth.Contract(nftABI);
        tokenContract.options.address = this.tokenContractAddress;
      }
      const res = await tokenContract.methods
        .getOwnedTokens(contract, address.toLowerCase(), offset, count)
        .call();
      return hexDecoder(res).map(val => {
        return {
          contract: contract,
          token: val.toNumber(),
          image: ''
        };
      });
    },

    processor(details, contract, nonStandardResult) {
      const newDetails = JSON.parse(nonStandardResult).kitties.map(val => {
        return {
          contract: contract,
          token: val.id,
          image: ''
        };
      });
      return [...details, ...newDetails];
    },
    async getImages(nftTokenDetails) {
      const contracts = Object.keys(nftTokenDetails);
      for (let i = 0; i < contracts.length; i++) {
        const prop = contracts[i];
        const content = nftTokenDetails[prop].details;
        if (content.length > 0) {
          this.getImagesForContract(
            content,
            prop,
            nftTokenDetails[prop].nonStandard
          ).then(result => {
            this.nftData[prop].details = result;
          });
        }
      }
    },
    async getImagesForContract(content, contract) {
      if (content) {
        if (content.length > 0) {
          const retrieveCount =
            content.length > this.countPerPage
              ? this.countPerPage
              : content.length;
          for (let j = 0; j < retrieveCount; j++) {
            if (!Number.isNaN(content[j].token)) {
              this.getNftImage(contract, content[j].token)
                .then(image => {
                  content[j].image = image;
                })
                .catch(() => {
                  if (content[j]) {
                    content[j].image = '';
                  }
                });
            }
          }
        }
      }
      return content;
    },
    getPrevious() {
      const content = this.nftData[this.selectedContract];
      if (content.nonStandard) {
        this.getPriorSetNonStandard(content);
      } else {
        this.getPriorSetStandard(content);
      }
    },
    getNext() {
      const content = this.nftData[this.selectedContract];
      this.getNextSetStandard(content);
    },
    async getNextSetStandard(content, address = this.account.address) {
      const offset = content.currentIndex + this.countPerPage;
      if (offset <= content.count) {
        // update offsets if not at the end
        content.priorIndex = content.currentIndex;
        content.currentIndex = offset;
      }

      if (content.nonStandard) {
        const nonStandard = await this.getOwnedNonStandard(
          content.contract,
          address,
          offset
        );
        content.details = this.processor(
          content.details,
          content.contract,
          nonStandard
        );
      } else {
        const additional = await this.getOwnedStandard(
          content.contract,
          offset
        );
        content.details = [...content.details, ...additional];
      }
      await this.getNextSet(content, offset);
    },
    async getNextSet(content, offset) {
      const maxIndex =
        offset + this.countPerPage <= content.count
          ? offset + this.countPerPage
          : content.count;
      for (let i = content.currentIndex; i < maxIndex; i++) {
        if (content.details[i].image === '') {
          if (!Number.isNaN(content.details[i].token)) {
            this.getNftImage(content.contract, content.details[i].token)
              .then(image => {
                content.details[i].image = image;
              })
              .catch(() => {
                if (content.details[i]) {
                  content.details[i].image = '';
                }
              });
          }
        }
      }

      this.$set(this.nftData, content.contract, content);
    },
    async getPriorSetStandard(content) {
      const offset = content.currentIndex - content.priorIndex;

      if (content.currentIndex - offset >= 0) {
        content.currentIndex = content.currentIndex - offset;
      } else {
        content.currentIndex = 0;
      }

      if (content.priorIndex - offset >= 0) {
        content.priorIndex = content.priorIndex - offset;
      } else {
        content.priorIndex = 0;
      }
      if (offset >= 0) {
        for (let i = content.priorIndex; i < content.currentIndex; i++) {
          if (content.details[i].image === '') {
            if (!Number.isNaN(content.details[i].token)) {
              this.getNftImage(
                content.details[i].contract,
                content.details[i].token
              )
                .then(image => {
                  content.details[i].image = image;
                })
                .catch(() => {
                  if (content.details[i]) {
                    content.details[i].image = '';
                  }
                });
            }
          }
        }

        this.$set(this.nftData, content.contract, content);
      }
    },
    async getPriorSetNonStandard(content, address = this.account.address) {
      const offset = content.currentIndex - content.priorIndex;
      if (content.currentIndex - offset >= 0) {
        content.currentIndex = content.currentIndex - offset;
      } else {
        content.currentIndex = 0;
      }

      if (content.priorIndex - offset >= 0) {
        content.priorIndex = content.priorIndex - offset;
      } else {
        content.priorIndex = 0;
      }

      if (offset >= 0) {
        const nonStandard = await this.getOwnedNonStandard(
          content.contract,
          address,
          content.currentIndex
        );

        const details = this.processor(
          content.details,
          content.contract,
          nonStandard
        );
        content.details = await this.getImagesForContract(
          details,
          content.contract,
          true
        );

        this.$set(this.nftData, content.contract, content);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NFTManagerContainer.scss';
</style>
