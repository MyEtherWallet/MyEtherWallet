<template lang="html">
  <div class="initial-state-unstoppable">
    <div class="content-container">
      <div class="title-container">
        <div class="title">
          <span>
            {{ domainName }}
          </span>
        </div>
      </div>
      <div class="content">
        <div v-show="loading" class="loading-container">
          <i class="fa fa-spinner fa-lg fa-spin" />
        </div>
        <div v-show="!loading">
          <div v-for="key in Object.keys(edit)" :key="key" class="info-row">
            <span class="info-title">{{ key }}</span>
            <input
              v-model="edit[key]"
              :class="[error[key] ? 'errored' : '']"
              :placeholder="$t('unstoppable.your-address')"
              type="text"
              :name="key"
              @input="addressChange"
            />
          </div>
          <div class="dropdown-container" @click="dropdownOpen = !dropdownOpen">
            <div class="dropdown-title">
              {{ $t('unstoppable.more-currencies') }}
            </div>
            <div class="dropdown-open-button">
              <i
                v-if="!dropdownOpen"
                class="fa fa-chevron-down"
                aria-hidden="true"
              />
              <i
                v-if="dropdownOpen"
                class="fa fa-chevron-up"
                aria-hidden="true"
              />
            </div>
            <div v-if="dropdownOpen" class="dropdown-list-box">
              <ul>
                <li
                  v-for="key of additionalRecords"
                  :key="key"
                  @click="handleAddRecord(key)"
                >
                  <div>
                    <p>
                      {{ key }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="save-button-container">
            <button :class="[!canSave ? 'disabled' : '']" @click="handleSave()">
              {{ $t('unstoppable.save-changes') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!loading" class="ipfs-container">
      <div v-if="ipfsProcessing" class="ipfs-loading-container">
        <i class="fa fa-lg fa-spinner fa-spin" />
        <h3>{{ $t('unstoppable.ipfs.processing') }}</h3>
        <p>{{ $t('unstoppable.ipfs.processing-description') }}</p>
      </div>
      <div v-else>
        <p v-show="validIpfs">
          {{
            $t('unstoppable.ipfs.see-website', {
              domainName: domainName
            })
          }}
        </p>
        <div>
          <div class="label-container">
            <form
              enctype="multipart/form-data"
              novalidate
              class="file-upload-container"
            >
              <input
                ref="zipInput"
                type="file"
                name="file"
                accept=".zip"
                @change="fileChange"
              />
            </form>
            <label class="info-title">{{ $t('unstoppable.ipfs.hash') }}</label>
            <p class="upload-zip" @click="ipfsClick">
              {{ $t('unstoppable.ipfs.upload') }}
            </p>
          </div>
          <input
            v-model="ipfsHash"
            placeholder="QmWXdjNC362aPDtwHPUE9o2VMqPeNeCQuTBTv1NsKtwypg"
            type="text"
          />
        </div>
        <div class="save-button-container save-ipfs-hash">
          <span v-if="!validIpfs" class="text-error">{{
            $t('unstoppable.error.empty-invalid-ipfs')
          }}</span>
          <br />
          <button
            :class="[!validIpfs ? 'disabled' : '']"
            @click="saveIpfsHash(ipfsHash)"
          >
            {{ $t('unstoppable.ipfs.set-hash') }}
          </button>
        </div>
      </div>
    </div>

    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://howto.xinfin.org/XinFinWallet/features"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapState } from 'vuex';
import registryAbi from '../../ABI/registryAbi';
import resolverAbi from '../../ABI/resolverAbi';
import { hash } from 'eth-ens-namehash';
import { keyToCryptoKey, isValidRecordKeyValue } from './helpers';
import { Toast } from '@/helpers';
import isIpfs from 'is-ipfs';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    account: {
      type: Object,
      default: function () {}
    },
    domainName: {
      type: String,
      default: ''
    },
    web3: {
      type: Object,
      default: function () {}
    }
  },
  data() {
    return {
      domains: [],
      loading: true,
      records: {},
      edit: {},
      error: {},
      dropdownOpen: false,
      additionalRecords: [],
      canSave: false,
      ipfsHash: '',
      ipfsProcessing: false
    };
  },
  computed: {
    ...mapState('main', ['online']),
    validIpfs() {
      return isIpfs.multihash(this.ipfsHash);
    }
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    fileChange(e) {
      this.ipfsProcessing = true;
      const TYPES = [
        'application/zip',
        'application/x-zip',
        'application/octet-stream',
        'application/x-zip-compressed'
      ];
      const supportedFile = TYPES.find(item => {
        return (
          e.target.files[0].type === item ||
          e.target.files[0].name.includes('.zip')
        );
      });
      if (!supportedFile) {
        this.$refs.zipInput.value = '';
        Toast.responseHandler(
          this.$t('unstoppable.warning.upload-zip'),
          Toast.WARN
        );
        return;
      }

      if (e.target.files[0].size < 500) {
        this.ipfsProcessing = false;
        this.$refs.zipInput.value = '';
        Toast.responseHandler(
          this.$t('unstoppable.warning.too-small'),
          Toast.WARN
        );
        return;
      }

      if (e.target.files[0].size > 50000) {
        this.ipfsProcessing = false;
        this.$refs.zipInput.value = '';
        Toast.responseHandler(
          this.$t('unstoppable.warning.too-big'),
          Toast.WARN
        );
        return;
      }
      this.uploadZip(e.target.files[0]);
    },
    async uploadZip(file) {
      const formData = new FormData();
      try {
        const content = await fetch('https://swap.mewapi.io/ipfs', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            method: 'getUploadUrl'
          })
        }).then(response => {
          return response.json();
        });
        for (const key in content.body.fields) {
          formData.append(key, content.body.fields[key]);
        }
        formData.append('file', file);
        fetch(content.body.signedUrl, {
          method: 'POST',
          headers: {
            'Content-Length': file.size
          },
          body: formData
        }).then(response => {
          if (!response.ok) {
            this.ipfsProcessing = false;
            Toast.responseHandler(
              this.$t('unstoppable.error.upload-error'),
              Toast.ERROR
            );
            return;
          }
          this.getHashFromFile(content.body.hashResponse);
        });
      } catch (e) {
        this.ipfsProcessing = false;
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async getHashFromFile(hash) {
      try {
        const ipfsHash = await fetch('https://swap.mewapi.io/ipfs', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            method: 'uploadComplete',
            hash: hash
          })
        })
          .then(response => {
            return response.json();
          })
          .catch(e => {
            this.ipfsProcessing = false;
            Toast.responseHandler(e, Toast.ERROR);
          });
        if (ipfsHash.error) {
          Toast.responseHandler(
            this.$t('unstoppable.ipfs.error-fetching-hash'),
            Toast.ERROR
          );
        } else {
          this.saveIpfsHash(ipfsHash);
        }
      } catch (e) {
        this.ipfsProcessing = false;
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async saveIpfsHash(recHash) {
      this.ipfsProcessing = true;
      const node = hash(this.domainName);
      const cryptoRegistry = new this.web3.eth.Contract(
        registryAbi,
        '0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe'
      );
      const currentResolverAddress = await this.getResolverAddress(
        cryptoRegistry,
        node
      );
      if (!currentResolverAddress) {
        throw new Error(this.$t('unstoppable.error.no-resolver-set'));
      }
      const resolverContract = new this.web3.eth.Contract(
        resolverAbi,
        currentResolverAddress
      );

      try {
        const txObj = {
          from: this.account.address,
          to: currentResolverAddress,
          data: resolverContract.methods
            .set('ipfs.html.value', recHash, node)
            .encodeABI(),
          value: 0
        };
        this.web3.eth.sendTransaction(txObj).then(() => {
          this.ipfsHash = recHash;
          this.ipfsProcessing = false;
        });
      } catch (e) {
        this.ipfsProcessing = false;
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    ipfsClick() {
      const input = this.$refs.zipInput;
      input.value = '';
      input.click();
    },
    async getResolverAddress(cryptoRegistry, node) {
      return cryptoRegistry.methods
        .resolverOf(node)
        .call()
        .catch(() => null);
    },
    async getRecords() {
      let result = [];
      try {
        const node = hash(this.domainName);
        const cryptoRegistry = new this.web3.eth.Contract(
          registryAbi,
          '0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe'
        );
        const resolverAddress = await this.getResolverAddress(
          cryptoRegistry,
          node
        );
        if (!resolverAddress) {
          throw new Error(this.$t('unstoppable.error.no-resolver-set'));
        }
        const resolver = new this.web3.eth.Contract(
          resolverAbi,
          resolverAddress
        );
        result = await resolver.methods
          .getMany(Object.values(keyToCryptoKey), node)
          .call();
        const ipfsHash = await resolver.methods
          .get('ipfs.html.value', node)
          .call();
        this.ipfsHash = ipfsHash && ipfsHash !== '' ? ipfsHash : '';
      } catch (e) {
        result = new Array(65).fill('');
        this.ipfsHash = '';
        this.loading = false;
      }
      this.additionalRecords = [];
      this.edit = {};
      this.records = {};
      for (const [index, key] of Object.keys(keyToCryptoKey).entries()) {
        if (result[index]) {
          this.records[key] = result[index];
          this.edit[key] = result[index];
        } else {
          this.additionalRecords.push(key);
        }
      }
      const defaultRecords = ['ETH', 'BTC', 'LTC', 'ZIL'];
      for (const key of defaultRecords) {
        if (!this.edit[key]) {
          this.edit[key] = '';
          this.records[key] = '';
        }
      }
      this.additionalRecords.sort();
      this.loading = false;
    },
    handleAddRecord(key) {
      this.dropdownOpen = false;
      this.edit[key] = '';
      this.records[key] = '';
      this.additionalRecords.splice(this.additionalRecords.indexOf(key), 1);
      this.additionalRecords.sort();
      this.dropdownOpen = !this.dropdownOpen;
    },
    addressChange(e) {
      const key = e.target.name;
      const value = e.target.value;
      if (value && !isValidRecordKeyValue(key, value)) {
        this.error[key] = true;
      } else {
        this.error[key] = false;
      }
      this.canSave = false;
      for (const key of Object.keys(this.edit)) {
        if (this.error[key]) {
          this.canSave = false;
          return;
        }
        if (this.edit[key] !== this.records[key]) {
          this.canSave = true;
        }
      }
    },
    async handleSave() {
      this.loading = true;
      const node = hash(this.domainName);
      const cryptoRegistry = new this.web3.eth.Contract(
        registryAbi,
        '0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe'
      );
      const resolverAddress = await this.getResolverAddress(
        cryptoRegistry,
        node
      );
      const keys = [];
      const values = [];
      for (const key of Object.keys(this.edit)) {
        if (this.edit[key] !== this.records[key]) {
          keys.push(keyToCryptoKey[key] || key);
          values.push(this.edit[key]);
        }
      }
      const resolverContract = new this.web3.eth.Contract(
        resolverAbi,
        resolverAddress || '0xEf31d4Eb54A743a6d665D067A374cD64CBD71ee3'
      );
      if (!resolverAddress) {
        await cryptoRegistry.methods
          .resolveTo(resolverContract.options.address, node)
          .send({ from: this.account.address })
          .on('error', () => {
            this.loading = false;
            this.getRecords();
          });
      }
      await resolverContract.methods
        .setMany(keys, values, node)
        .send({ from: this.account.address })
        .on('confirmation', confirmationNumber => {
          if (confirmationNumber === 4) {
            this.loading = false;
            this.getRecords();
          }
        })
        .on('error', () => {
          this.loading = false;
          this.getRecords();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageCryptoContainer.scss';
</style>
