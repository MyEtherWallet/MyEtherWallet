<template>
  <mew-overlay :show-overlay="open" right-btn-text="Close" :close="closing">
    <template #mewOverlayBody>
      <h2 class="text-center mb-10">
        {{ $t('unstoppable.manage-ipfs-website') }}
      </h2>
      <mew6-white-sheet min-width="600px">
        <div
          v-if="loading"
          class="pa-8 d-flex flex-column align-center justify-center"
          style="min-height: 466px"
        >
          <v-progress-circular indeterminate />
          <span class="mew-heading-2 mt-8"
            >{{ $t('unstoppable.updating-your-records') }}
          </span>
          <span class="mew-body d-flex text-center mt-4" style="width: 317px">
            {{ $t('unstoppable.processing-registration-advice') }}
          </span>
        </div>
        <div v-if="!loading" class="pa-8" style="min-height: 266px">
          <div class="d-flex justify-space-between align-center">
            <h3 class="font-weight-medium">{{ managedDomain.name || '' }}</h3>
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
              <span
                class="mew-body cursor--pointer"
                style="color: #05c0a5"
                @click="ipfsClick"
              >
                {{ $t('unstoppable.upload-my-website') }}
              </span>
            </div>
          </div>
          <div class="mt-8 mb-8 label-container">
            <mew-input
              v-model="input"
              style="max-height: 50px"
              placeholder="QmWXdjNC362aPDtwHPUE9o2VMqPeNeCQuTBTv1NsKtwypg"
              :label="$t('unstoppable.ipfs-hash')"
              :rules="[v => isValidIpfs(v) || 'Invalid format']"
            />
          </div>
          <div v-if="error" class="error--text mb-7 font-weight-medium">
            {{ error }}
          </div>

          <div
            v-if="notEnoughBalance"
            class="error--text mt-3 mb-7 font-weight-medium"
          >
            {{ $t('unstoppable.insufficient-balance') }}
            <a
              href="https://ccswap.myetherwallet.com/#/"
              target="_blank"
              class="text-decoration--underline"
            >
              {{ $t('unstoppable.insufficient-balance-advice') }}
            </a>
          </div>

          <div class="d-flex justify-space-between align-center">
            <mew-button
              :title="$t('unstoppable.save-changes')"
              btn-size="large"
              :disabled="disabled"
              @click.native="() => saveIpfsHash(input)"
            />
          </div>
        </div>
      </mew6-white-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import resolverAbi from '../handlers/resolverAbi';
import isIpfs from 'is-ipfs';

export default {
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      disabled: false,
      loading: false,
      input: '',
      error: '',
      notEnoughBalance: false
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3']),
    ipfsHash: {
      get() {
        return this.managedDomain.ipfsHash;
      },
      set(newHash) {
        return newHash;
      }
    }
  },
  watch: {
    managedDomain: async function (newVal, oldVal) {
      if (this.activeOverlay() === 'UploadIpfsOverlay' && newVal) {
        if (newVal.name !== oldVal.name) {
          await this.fetchRecords();
        }
      }
    }
  },
  methods: {
    ...mapMutations('unstoppable', ['SET_ACTIVE_OVERLAY']),
    ...mapGetters('unstoppable', [
      'managedDomain',
      'resolution',
      'activeOverlay'
    ]),
    isValidIpfs(value) {
      this.disabled = !isIpfs.multihash(value);
      return !this.disabled;
    },
    closing() {
      this.ipfsHash = '';
      this.SET_ACTIVE_OVERLAY({ value: '' });
      this.close();
    },
    async fetchRecords() {
      this.ipfsHash = await this.resolution
        .getIpfsHash(this.managedDomain.name)
        .then(ipfs => {
          this.isValidIpfs(ipfs);
          return ipfs;
        })
        .catch(() => '');
    },
    ipfsClick() {
      const input = this.$refs.zipInput;
      input.value = '';
      input.click();
    },
    fileChange(e) {
      this.loading = true;
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
        this.error = 'Unsupported File type';
        return;
      }
      if (e.target.files[0].size < 500) {
        this.loading = false;
        this.$refs.zipInput.value = '';
        this.error = 'The website is too small';
        return;
      }
      if (e.target.files[0].size > 50000) {
        this.loading = false;
        this.$refs.zipInput.value = '';
        this.error = 'The website is too big';
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
            this.loading = false;
            this.error = 'Upload failed';
            return;
          }
          this.getHashFromFile(content.body.hashResponse);
        });
      } catch (e) {
        this.loading = false;
        this.error = e.message;
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
            this.loading = false;
            console.error(e);
          });
        if (ipfsHash.error) {
          console.error('error fetching ipfs');
        } else {
          this.ipfsHash = ipfsHash;
          this.saveIpfsHash(ipfsHash);
        }
      } catch (e) {
        this.loading = false;
        console.error(e);
      }
    },

    async saveIpfsHash(hash) {
      this.loading = true;

      const currentResolverAddress = await this.resolution.getResolver(
        this.managedDomain.name
      );

      if (!currentResolverAddress) {
        this.error = "Couldn't fetch resolver address";
        this.loading = false;
        return;
      }
      const resolverContract = new this.web3.eth.Contract(
        resolverAbi,
        currentResolverAddress
      );
      try {
        const txObj = {
          from: this.address,
          to: currentResolverAddress,
          data: resolverContract.methods
            .set('ipfs.html.value', hash, this.managedDomain.namehash)
            .encodeABI(),
          value: 0
        };
        await this.web3.eth.sendTransaction(txObj);
        this.loading = false;
      } catch (e) {
        this.loading = false;
        if (e.message === 'Returned error: insufficient funds for transfer') {
          this.notEnoughBalance = true;
          return;
        }
        this.error = e.message;
      }
    }
  }
};
</script>

<style lang="scss">
.dropdown-list-box {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  width: 22%;
  position: absolute;
  user-select: none;
  background-color: #fff;
  border: 1px solid #05c0a5;
  border-radius: 0 0 4px 4px;
  z-index: 10;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 230px;
  ul {
    li {
      cursor: pointer;
      padding: 10px 15px;
      position: relative;
      display: grid;
      grid-template-columns: 40px 1fr 70px 25px;
      align-items: center;

      &:nth-child(odd) {
        background-color: #fff;
      }

      &:hover {
        background-color: #f9f9f9;
      }
    }
  }
}
.file-upload-container {
  position: absolute;
  top: -100000px;
}

.label-container {
  display: flex;
  // color: $dark-blue-12;
  align-items: center;
  justify-content: space-between;
  padding: 20px 15px;
  position: relative;
}
</style>
