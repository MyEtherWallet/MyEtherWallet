<template>
  <div class="crypto-kitties-manager">
    <interface-container-title :title="$t('common.ntfManager')" />
    <div class="inner-side-menu content-container">
      <nft-side-menu
        :data="sideMenuData"
        :nft-config="nftConfig"
        :initial-highlighted="selectedContract"
        @selected="changeSelectedContract"
      >
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
            {{ $t('dapps.showing', { first: startIndex, last: endIndex }) }}
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

const URL_BASE = 'https://nft.mewapi.io/nft';

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
      imagesRetrieved: true,
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
    endIndex() {
      if (this.nftData[this.selectedContract]) {
        const ids_retrieved = this.nftData[this.selectedContract].details
          .length;
        const increment =
          ids_retrieved > this.countPerPage ? this.countPerPage : ids_retrieved;
        return this.nftData[this.selectedContract].currentIndex + increment;
      }
    },
    nftTitle() {
      if (this.nftData[this.selectedContract]) {
        return this.nftData[this.selectedContract].title;
      }
      return 'Loading';
    },
    nftToShow() {
      if (this.nftData[this.selectedContract]) {
        if (!this.nftData[this.selectedContract].details) return [];
        return this.nftData[this.selectedContract].details.length >
          this.countPerPage
          ? this.nftData[this.selectedContract].details.slice(
              this.nftData[this.selectedContract].currentIndex,
              this.nftData[this.selectedContract].currentIndex +
                this.countPerPage
            )
          : this.nftData[this.selectedContract].details;
      }
      return [];
    },
    ntfCount() {
      if (this.nftData[this.selectedContract]) {
        return this.$t('dapps.nftOwnCount', {
          perPage: this.countPerPage,
          count: this.nftData[this.selectedContract].count
        });
      }

      return this.$t('dapps.noneOwned');
    },
    selectedNtf() {
      if (this.nftData[this.selectedContract]) {
        return this.nftData[this.selectedContract];
      }
      return {};
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
    sideMenuData() {
      return this.nftData;
    },
    ...mapState(['account', 'web3', 'online', 'network']),
    startIndex() {
      if (this.nftData[this.selectedContract]) {
        return this.nftData[this.selectedContract].currentIndex;
      }
      return 0;
    },
    activeAddress() {
      return this.account.address;
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

    if (this.network.type.name === 'ETH') {
      this.changeSelectedContract(this.nftConfig[0].contractAddress);

      this.getOwnedCounts();
      this.getOwned();
    }
  },
  methods: {
    changeSelectedContract(selectedContract) {
      this.selectedContract = selectedContract;
      this.showDetails = false;
    },
    comeBack() {
      this.showDetails = false;
    },
    getImage(nft) {
      return nft.image;
    },
    async getNftImagePath(contract, token) {
      const image = await fetch(
        `${URL_BASE}?contract=${contract}&token=${token}`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET'
        }
      );
      return await image.json();
    },
    async getOwned(address = this.activeAddress, nftData = this.nftData) {
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
    async getOwnedCounts(address = this.activeAddress) {
      const supportedNftTokens = this.nftConfig
        .filter(entry => entry.ERC721Extension)
        .map(entry => entry.contract);
      const tokenContract = new this.web3.eth.Contract(nftABI);
      tokenContract.options.address = this.tokenContractAddress;

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
    async getOwnedNonStandard(
      contract,
      address,
      offset = 0,
      limit = this.countPerPage
    ) {
      fetch(
        `${URL_BASE}?nonStandardContract=${contract}&address=${address}&offset=${offset}&limit=${limit}`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET'
        }
      )
        .then(data => {
          return data.json();
        })
        .then(rawJson => {
          this.nftData[contract].count = JSON.parse(rawJson).total;
          const getNestedObject = (nestedObj, pathArr, token) => {
            return pathArr.reduce((obj, key) => {
              if (key === '@tokenvalue@') {
                key = token.toString();
              }
              return obj && obj[key] !== 'undefined' ? obj[key] : undefined;
            }, nestedObj);
          };

          const metadataKeys = this.nftData[contract].metadataKeys || [
            'kitties'
          ];
          const imageKey = this.nftData[contract].imageKey || 'image_url_png';
          return getNestedObject(JSON.parse(rawJson), metadataKeys).map(val => {
            return {
              contract: contract,
              token: val.id,
              image: val[imageKey]
                ? `${URL_BASE}/image?path=${val[imageKey]}`
                : ''
            };
          });
        })
        .then(list => {
          const reducedList = list.slice(0, 9);
          this.nftData[contract].details = reducedList;
          this.$set(this.nftData[contract], 'details', reducedList);
          if (list.length > 0) {
            const retrieveCount =
              list.length > this.countPerPage ? this.countPerPage : list.length;
            for (let j = 0; j < retrieveCount; j++) {
              if (!Number.isNaN(list[j].token) && list[j].image === '') {
                this.getNftImagePath(contract, list[j].token)
                  .then(image => {
                    this.nftData[contract].details[
                      j
                    ].image = `${URL_BASE}/image?path=${image.image}`;
                  })
                  .catch(() => {
                    if (this.nftData[contract].details[j]) {
                      this.nftData[contract].details[j].image = '';
                    }
                  });
              }
            }
          }
        });
    },
    async getOwnedStandard(
      contract,
      offset,
      count = this.countPerPage,
      address = this.activeAddress,
      tokenContract = undefined
    ) {
      if (!tokenContract) {
        tokenContract = new this.web3.eth.Contract(nftABI);
        tokenContract.options.address = this.tokenContractAddress;
      }

      tokenContract.methods
        .getOwnedTokens(contract, address.toLowerCase(), offset, count)
        .call()
        .then(res => {
          return hexDecoder(res).map(val => {
            return {
              contract: contract,
              token: val.toNumber(),
              image: ''
            };
          });
        })
        .then(list => {
          this.nftData[contract].details = list;
          this.$set(this.nftData[contract], 'details', list);
          if (list.length > 0) {
            const retrieveCount =
              list.length > this.countPerPage ? this.countPerPage : list.length;
            for (let j = 0; j < retrieveCount; j++) {
              if (!Number.isNaN(list[j].token)) {
                this.getNftImagePath(contract, list[j].token)
                  .then(image => {
                    this.nftData[contract].details[
                      j
                    ].image = `${URL_BASE}/image?path=${image.image}`;
                  })
                  .catch(() => {
                    if (this.nftData[contract].details[j]) {
                      this.nftData[contract].details[j].image = '';
                    }
                  });
              }
            }
          }
        });
    },
    async getOwnedTokens(contracts, address, nftData) {
      const tokenContract = new this.web3.eth.Contract(nftABI);
      tokenContract.options.address = this.tokenContractAddress;

      for (let i = 0; i < contracts.length; i++) {
        nftData = await this.loadForContract(
          contracts[i],
          nftData,
          address,
          tokenContract
        );
      }
      this.imagesRetrieved = true;
    },
    getNext(address = this.account.address) {
      const content = this.nftData[this.selectedContract];

      const offset = content.currentIndex + this.countPerPage;
      if (offset <= content.count) {
        // update offsets if not at the end
        content.priorIndex = content.currentIndex;
        content.currentIndex = offset;
      }

      if (content.nonStandard) {
        this.getOwnedNonStandard(
          content.contract,
          address,
          offset,
          this.countPerPage
        );
      } else {
        this.getOwnedStandard(content.contract, offset, this.countPerPage);
      }
    },
    getPrevious(address = this.activeAddress) {
      const content = this.nftData[this.selectedContract];

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
        if (content.nonStandard) {
          this.getOwnedNonStandard(
            content.contract,
            address,
            offset,
            this.countPerPage
          );
        } else {
          this.getOwnedStandard(content.contract, offset, this.countPerPage);
        }
      }
    },
    async getTokenConfig() {
      const data = await fetch(`${URL_BASE}?supported=true`, {
        mode: 'cors',
        cache: 'no-cache',
        method: 'GET'
      });
      return await data.json();
    },
    hasImage(nft) {
      return nft.image !== '';
    },
    async loadForContract(
      contract,
      nftData,
      address = this.activeAddress,
      tokenContract = null
    ) {
      if (nftData[contract].ERC721Extension) {
        this.getOwnedStandard(
          contract,
          0,
          this.countPerPage,
          address,
          tokenContract
        ).then(result => {
          this.nftData[contract].details = result;
        });

        return nftData;
      } else if (nftData[contract].nonStandard) {
        this.getOwnedNonStandard(contract, address);
      }
      return nftData;
    },
    showNftDetails(nft) {
      this.detailsFor = nft;
      this.showDetails = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NFTManagerContainer.scss';
</style>
