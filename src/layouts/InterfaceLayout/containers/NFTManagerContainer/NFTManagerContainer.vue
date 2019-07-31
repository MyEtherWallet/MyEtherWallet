<template>
  <div class="crypto-kitties-manager">
    <interface-container-title title="NFT Manager" />
    <div class="inner-side-menu content-container">
      <nft-side-menu
        :data="sideMenuData"
        @selected="changeSelectedContract"
        @showTokenDetails="showSearchSelected"
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
              <img :src="getImage(nft)" />
              <p>#{{ nft.token }}</p>
            </div>
          </div>
          <div v-show="selectedNtf.count > 9" class="internal-nav-container">
            <span
              v-show="startIndex > 0"
              class="internal-nav prev"
              @click="getPrevious()"
            >
              Previous
            </span>
            Showing {{ startIndex }} -{{ endIndex }}
            <span
              v-show="showNextButton"
              class="internal-nav next"
              @click="getNext()"
              >Next</span
            >
          </div>
        </div>
      </div>
    </div>
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
// import config from './config';
import KittyCore from './abis/KittyCore';
import fetch from 'node-fetch';

const URL_BASE =
  'example.com';

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
      countPerPage: 9,
      nftConfig: [],
      tokenHelper: {},
      imagesRetrieved: false,
      showDetails: false,
      selectedContract: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      detailsFor: {},
      nftTokens: {},
      // nftToShow: [],
      // sideMenuData: {},
      nftData: {},
      ownedTokens: [],
      useDevAddress: true,
      devAddress: '0x2f261a227480b7d1802433d05a92a27bab645032'
      // 0xac43df42ba2d186da57342e1b685f024db445a22 // mycryptoheros:hero
      // '0xa3d7553397352efb84a0bc217a464e9e114207d6' // gods unchained
      // '0x2f261a227480b7d1802433d05a92a27bab645032' // cryptokitties
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
      const toShow = this.nftData[this.selectedContract]
        ? this.nftData[this.selectedContract].details.slice(
            this.nftData[this.selectedContract].currentIndex,
            this.nftData[this.selectedContract].currentIndex + this.countPerPage
          )
        : [];
      return toShow;
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
        const itemName = this.nftData[this.selectedContract].itemName
          ? this.nftData[this.selectedContract].itemName
          : this.nftData[this.selectedContract].title;
        return this.$t('dapps.nftOwnCount', {
          count: this.nftData[this.selectedContract].count,
          items: itemName
        });
      }

      return 'You own no NFTs';
    }
  },
  watch: {
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
    // this.getViaMetadataUrl();
    this.getOwnedCounts();
    this.getOwned();
  },
  methods: {
    async getTokenConfig() {
      // address = '0x2f261a227480b7d1802433d05a92a27bab645032';
      const data = await fetch(`${URL_BASE}?supported=true`, {
        mode: 'cors',
        cache: 'no-cache',
        method: 'GET'
      });
      return await data.json();
    },
    async showSearchSelected(thing) {
      if (thing.image === '') {
        thing.image = await this.getNftImage(thing.contract, thing.token);
      }
      this.showNftDetails(thing);
    },
    changeSelectedContract(selectedContract) {
      this.selectedContract = selectedContract;
      this.showDetails = false;
    },
    getImage(ntf) {
      return ntf.image;
    },
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
        `${URL_BASE}?contract=${contract}&token=${token}`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET'
        }
      );
      return await image.text();
    },
    async getViaMetadataUrl(contract, token) {
      const tokenContract = new this.web3.eth.Contract(ERC721);
      tokenContract.options.address = contract;
      if (!token) return '';
      const res = await tokenContract.methods.tokenURI(token).call();
      console.log(res.trim()); // todo remove dev item
      const imageRaw = await fetch(`${URL_BASE}?metadataUri=${res}`, {
        mode: 'cors',
        cache: 'no-cache',
        method: 'GET'
      });

      return await imageRaw.text();
    },
    async getOwnedCounts() {
      const supportedNftTokens = this.nftConfig
        .filter(entry => entry.ERC721Extension)
        .map(entry => entry.contract);
      const tokenContract = new this.web3.eth.Contract(nftABI);
      tokenContract.options.address =
        '0xeA3352C1a3480Ac5a32Fcd1F2854529BA7193F14';
      const address = this.useDevAddress ? this.devAddress : this.account.address;
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
      if(this.useDevAddress) address = this.devAddress;
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
        this.$forceUpdate();
        return result;
      }
    },
    async getOwnedTokens(contracts, address, nftData) {
      const tokenContract = new this.web3.eth.Contract(nftABI);
      tokenContract.options.address =
        '0xeA3352C1a3480Ac5a32Fcd1F2854529BA7193F14';

      for (let i = 0; i < contracts.length; i++) {
        nftData = await this.processNftDataContract(
          address,
          tokenContract,
          contracts[i],
          nftData
        );
      }
      this.imagesRetrieved = true;
      this.nftData = nftData;
      return await this.getImages(nftData);
    },
    async processNftDataContract(address, tokenContract, contract, nftData) {
      if (nftData[contract].ERC721Extension) {
        for (let i = 0; i < nftData[contract].count; i += 1000) {
          const res = await tokenContract.methods
            .getOwnedTokens(contract, address.toLowerCase(), i, i + 1000)
            .call();
          const details = hexDecoder(res).map(val => {
            return {
              contract: contract,
              token: val.toNumber(),
              image: ''
            };
          });
          if (details.length < 1000) {
            const detailsSlim = details.reduce((accumulator, currentValue) => {
              const idx = nftData[contract].details.findIndex(
                entry => entry.token === currentValue.token
              );
              if (idx < 0) {
                accumulator.push(currentValue);
              }
              return accumulator;
            }, []);
            nftData[contract].details = [
              ...nftData[contract].details,
              ...detailsSlim
            ];
          } else {
            nftData[contract].details = [
              ...nftData[contract].details,
              ...details
            ];
          }

          // console.log(nftData[contract].details.length); // todo remove dev item
        }
        // nftData[contract].count = hexDecoder(res).length;
        return nftData;
      } else if (nftData[contract].nonStandard) {
        try {
          const nonStandard = await this.getOwnedNonStandard(contract, address);
          // Generalize access or create accessor function for each non-standard contract
          // nftData[contract].details = JSON.parse(nonStandard).kitties.map(
          //   val => {
          //     return {
          //       contract: contract,
          //       token: val.id,
          //       image: ''
          //     };
          //   }
          // );
          nftData[contract].details = this.processor(
            nftData[contract].details,
            contract,
            nonStandard
          );
          // nftData[contract].currentIndex = nftData[contract].details.length;
          nftData[contract].count = JSON.parse(nonStandard).total;
          // console.log(nftData[contract].details); // todo remove dev item
        } catch (e) {
          nftData[contract].details = [];
        }
      }
      return nftData;
    },
    async getOwnedNonStandard(contract, address, offset = 0) {
      // address = '0x2f261a227480b7d1802433d05a92a27bab645032';
      const data = await fetch(
        `${URL_BASE}?nonStandardContract=${contract}&address=${address}&offset=${offset}`,
        {
          mode: 'cors',
          cache: 'no-cache',
          method: 'GET'
        }
      );
      console.log(data); // todo remove dev item
      return await data.json();
    },
    processor(details, contract, nonStandard) {
      const exists = item => {
        return details.findIndex(entry => entry.token === item.id) >= 0;
      };
      const newDetails = JSON.parse(nonStandard).kitties.map(val => {
        if (!exists(val)) {
          return {
            contract: contract,
            token: val.id,
            image: ''
          };
        }
      });
      console.log('newDetails', newDetails); // todo remove dev item
      return [...details, ...newDetails];
      // return details.concat(newDetails);
    },
    async getImages(nftTokenDetails) {
      const contracts = Object.keys(nftTokenDetails);
      for (let i = 0; i < contracts.length; i++) {
        const prop = contracts[i];
        const content = nftTokenDetails[prop].details;
        if (content.length > 0) {
          nftTokenDetails[prop].details = await this.getImagesForContract(
            content,
            prop,
            nftTokenDetails[prop].nonStandard
          );
          // const retrieveCount = content.length > 20 ? 21 : content.length;

          // for (let j = 0; j < retrieveCount; j++) {
          //   if (!Number.isNaN(content[j].token)) {
          //     try {
          //       content[j].image = await this.getNftImage(
          //         prop,
          //         content[j].token
          //       );
          //     } catch (e) {
          //       content[j].image = '';
          //     }
          //   }
          // }
          // nftTokenDetails[prop].details = contentResult;
          // this.valueChanged++;
        }
      }
      this.nftData = nftTokenDetails;
      return nftTokenDetails;
    },
    async getImagesForContract(content, contract, nonStandard = false) {
      let failCount = 0;
      // const retrieveCount = content.length > 20 ? 21 : content.length;
      console.log('getImagesForContract: content -', content); // todo remove dev item
      if (content) {
        if (content.length > 0) {
          const retrieveCount =
            content.length > this.countPerPage
              ? this.countPerPage
              : content.length;
          for (let j = 0; j < retrieveCount; j++) {
            if (failCount > 10) break;
            // console.log(content[j].token); // todo remove dev item
            if (!Number.isNaN(content[j].token)) {
              try {
                if (nonStandard) {
                  console.log(j); // todo remove dev item
                  content[j].image = await this.getNftImage(
                    contract,
                    content[j].token
                  );
                } else {
                  content[j].image = await this.getViaMetadataUrl(
                    contract,
                    content[j].token
                  );
                  // await this.getViaMetadataUrl(contract, content[j].token);
                }
              } catch (e) {
                failCount++;
                content[j].image = '';
              }
            }
          }
        }
      }
      return content;
    },
    getPrevious() {
      console.log('get prior'); // todo remove dev item
      const content = this.nftData[this.selectedContract];
      if (content.nonStandard) {
        console.log('getNextSetNonStandard'); // todo remove dev item
        this.getPriorSetNonStandard(content);
      } else {
        this.getPriorSetStandard(content);
      }
    },
    getNext() {
      console.log('get next'); // todo remove dev item
      const content = this.nftData[this.selectedContract];
      if (content.nonStandard) {
        console.log('getNextSetNonStandard'); // todo remove dev item
        this.getNextSetNonStandard(content);
      } else {
        this.getNextSetStandard(content);
      }
    },
    async getNextSetStandard(content) {
      const offset = content.currentIndex + this.countPerPage; // 0 = 20 | 20 = 37
      if (offset <= content.count) {
        // update offsets if not at the end
        content.priorIndex = content.currentIndex;
        content.currentIndex = offset;
      }

      const maxIndex =
        offset + this.countPerPage <= content.count
          ? offset + this.countPerPage
          : content.count;
      let failCount = 0;
      for (let i = content.currentIndex; i < maxIndex; i++) {
        if (failCount > 10) break;
        console.log(i); // todo remove dev item
        if (content.details[i].image === '') {
          if (!Number.isNaN(content.details[i].token)) {
            try {
              content.details[i].image = await this.getNftImage(
                content.details[i].contract,
                content.details[i].token
              );
            } catch (e) {
              failCount++;
              content.details[i].image = '';
            }
          }
        }
      }
      // content.details = await this.getImagesForContract(
      //   content.details,
      //   content.contract
      // );

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
              try {
                content.details[i].image = await this.getNftImage(
                  content.details[i].contract,
                  content.details[i].token
                );
              } catch (e) {
                content.details[i].image = '';
              }
            }
          }
        }

        this.$set(this.nftData, content.contract, content);
      }
    },
    async getNextSetNonStandard(content, address = this.account.address) {
      if(this.useDevAddress)  address = this.devAddress;
      const offset = content.currentIndex + content.details.length; // 0 = 20 | 20 = 37
      if (offset <= content.count) {
        // update offsets if not at the end
        content.priorIndex = content.currentIndex;
        content.currentIndex = offset;
      }
      const nonStandard = await this.getOwnedNonStandard(
        content.contract,
        address,
        offset
      );
      console.log('nonStandard', nonStandard); // todo remove dev item
      content.details = this.processor([], content.contract, nonStandard);

      content.details = await this.getImagesForContract(
        content.details,
        content.contract,
        true
      );

      console.log('content.details', content.details); // todo remove dev item
      this.$set(this.nftData, content.contract, content);
    },
    async getPriorSetNonStandard(content, address = this.account.address) {
      if(this.useDevAddress)  address = this.devAddress;
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

        content.details = this.processor([], content.contract, nonStandard);
        console.log('content.details', content.details); // todo remove dev item
        content.details = await this.getImagesForContract(
          content.details,
          content.contract,
          true
        );

        this.$set(this.nftData, content.contract, content);
      }
    },

    async getAllNonStandardOwned() {
      // await this.getOwnedNonStandard()
      // const getAll = async (address, body, offset) => {
      //   const higherOffset = offset > 20 ? offset : 20;
      //   const cats = body.kitties;
      //   for (let i = higherOffset; i < limit; i += 20) {
      //     var options = {
      //       url: `https://api.cryptokitties.co/kitties?owner_wallet_address=${address}&limit=100&offset=${i}`,
      //       method: 'GET'
      //     };
      //     let results = await makeRequest(options);
      //     console.log(results); // todo remove dev item
      //     cats.concat(results.kitties);
      //   }
      //   body.kitties = cats;
      //   return body;
      // };
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NFTManagerContainer.scss';
</style>
