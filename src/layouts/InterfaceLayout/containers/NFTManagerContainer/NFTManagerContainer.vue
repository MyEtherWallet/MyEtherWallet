<template>
  <div class="crypto-kitties-manager">
    <interface-container-title title="NFT Manager" />
    <div class="inner-side-menu content-container">
      <nft-side-menu :data="sideMenuData" @selected="selectedContract = $event">
        <input type="text" placeholder="Search #" />
      </nft-side-menu>
      <div v-if="showDetails">
        <nft-details :nft="detailsFor" @back="comeBack"></nft-details>
      </div>
      <div v-if="!showDetails">
        <content-block-title :button-text="ntfCount" :title="nftTitle" />
        <div v-if="imagesRetrieved" class="grid-container">
          <div v-for="nft in nftToShow" :key="nft.key" class="kitty">
            <div class="kitty-img" @click="showNftDetails(nft)">
              <img :src="nft.image" />
              <p>#{{ nft.token }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    <span @click="getAdditionalImages(-5)"> Prev </span>-->
    <!--    <span @click="getAdditionalImages(5)">Next</span>-->
    <div class="flex--row--align-start mft-manager-content-container"></div>
    <!--    <div v-if="showDetails">
      <nft-details :nft="detailsFor" @back="comeBack"></nft-details>
    </div>-->
  </div>
</template>

<script>
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import ContentBlockTitle from '@/layouts/InterfaceLayout/components/ContentBlockTitle';
import NFTSideMenu from '@/layouts/InterfaceLayout/containers/NFTManagerContainer/components/NFTSideMenu';
import NftDetails from './containers/NftDetails';
import { mapState } from 'vuex';
import hexDecoder from './binaryDecoderNFT';
import nftABI from './abis/abiNFT';
import ERC721 from './abis/ERC721';
import config from './config';
import KittyCore from './abis/KittyCore';

// Please remove these images after "NFT Manager" development is done. (@/assets/images/temp)
import fetch from 'node-fetch';
const urlBase = 'https://example.com';
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
      ERC721,
      KittyCore,
      tokenHelper: {},
      nftConfig: config,
      imagesRetrieved: true,
      showDetails: false,
      selectedContract: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      detailsFor: {},
      nftTokens: {},
      nftToShow: [],
      // sideMenuData: {},
      nftData: {},
      ownedTokens: []
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
    sideMenuData() {
      return this.nftData;
    },
    selectedNtf() {
      return this.nftData[this.selectedContract];
    },
    nftTitle() {
      if (this.nftData[this.selectedContract]) {
        return this.nftData[this.selectedContract].title;
      }
      return 'Loading';
    },
    ntfCount() {
      if (this.nftData[this.selectedContract]) {
        return `You own ${this.nftData[this.selectedContract].count} ${this.nftData[this.selectedContract].title}`;
      }

      return 'You own no NFTs';
    }
  },
  watch: {
    selectedContract() {
      this.nftToShow = this.nftData[this.selectedContract]
        ? this.nftData[this.selectedContract].details
        : [];
    },
    nftData(newVal) {
      console.log('nftData watched', newVal); // todo remove dev item
      // this.sideMenuData = newVal;
    },
    ['tokenHelper.valueChanged'](newVal) {
      console.log('this.valueChanged', newVal); // todo remove dev item
      // this.sideMenuData = this.tokenHelper.getSideMenuData();
    }
  },
  async mounted() {
    const stateItems = {
      count: 0,
      selected: false,
      startIndex: 0,
      endIndex: 6,
      currentIndex: 0,
      details: []
    };
    this.nftData = config.reduce((accumulator, currentValue) => {
      accumulator[currentValue.contract] = {
        ...currentValue,
        ...stateItems
      };
      return accumulator;
    }, {});

    console.log('sideMenu', this.nftData); // todo remove dev item
    this.getOwned();
  },
  methods: {
    comeBack() {
      console.log('com back'); // todo remove dev item
      this.showDetails = false;
    },
    showNftDetails(nft) {
      this.detailsFor = nft;
      this.showDetails = true;
    },
    async getNftImage(contract, token) {
      const image = await fetch(
        `${urlBase}?contract=${contract}&token=${token}`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET'
        }
      );
      console.log(image); // todo remove dev item
      return await image.text();
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
        return result;
      }
    },

    async getOwnedTokens(contracts, address, nftData) {
      const tokenContract = new this.web3.eth.Contract(nftABI);
      tokenContract.options.address =
        '0xeA3352C1a3480Ac5a32Fcd1F2854529BA7193F14';

      const processContract = async (contract, nftData) => {
        if (nftData[contract].ERC721Extension) {
          const res = await tokenContract.methods
            .getOwnedTokens(contract, address.toLowerCase(), 0, 1000)
            .call();
          nftData[contract].details = hexDecoder(res).map(val => {
            return {
              token: val.toNumber(),
              image: ''
            };
          });
          nftData[contract].count = hexDecoder(res).length;
          return nftData;
        } else if (nftData[contract].nonStandard) {
          try {
            const nonStandard = await this.getOwnedNonStandard(
              contract,
              address
            );
            nftData[contract].details = JSON.parse(nonStandard).kitties.map(
              val => {
                return {
                  token: val.id,
                  image: ''
                };
              }
            );
            nftData[contract].count = JSON.parse(nonStandard).total;
            console.log(nftData[contract].details); // todo remove dev item
          } catch (e) {
            nftData[contract].details = [];
          }
        }
        return nftData;
      };

      for (let i = 0; i < contracts.length; i++) {
        nftData = await processContract(contracts[i], nftData);
      }
      this.nftData = nftData;
      return await this.getImages(nftData);
    },
    async getOwnedNonStandard(contract, address, offset = 0) {
      // address = '0x2f261a227480b7d1802433d05a92a27bab645032';
      const image = await fetch(
        `${urlBase}?nonStandardContract=${contract}&address=${address}&offset=${offset}`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET'
        }
      );
      console.log(image); // todo remove dev item
      return await image.json();
    },

    async getImages(nftTokenDetails) {
      const contracts = Object.keys(nftTokenDetails);
      for (let i = 0; i < contracts.length; i++) {
        const prop = contracts[i];
        const content = nftTokenDetails[prop].details;
        if (content.length > 0) {
          for (let j = 0; j < content.length; j++) {
            if (!Number.isNaN(content[j].token)) {
              content[j].image = await this.getNftImage(prop, content[j].token);
            }
          }
          nftTokenDetails[prop].details = content;
          this.valueChanged++;
        }
      }
      this.nftData = nftTokenDetails;
      return nftTokenDetails;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NFTManagerContainer.scss';
</style>
