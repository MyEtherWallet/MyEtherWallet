<template>
  <mew-overlay
    :show-overlay="open"
    right-btn-text="Close"
    content-size="xlarge"
    :close="closing"
  >
    <div class="upload-ipfs">
      <h2 class="text-center mb-10">
        {{ $t('unstoppable.manage-ipfs-website') }}
      </h2>

      <div class="greyPrimary--text mb-5">
        To link
        <span class="bluePrimary--text">{{ managedDomain.name }}</span> to your
        website, upload its .zip file or enter the IPFS hash.
      </div>

      <v-sheet
        class="d-flex flex-column justify-center px-5"
        color="backgroundGrey"
        height="76"
        rounded
        shaped
        width="100%"
      >
        <div class="d-flex align-center justify-space-between">
          <div class="textMedium--text d-flex align-center">
            <v-icon class="pr-2" color="primary">mdi-folder-zip-outline</v-icon>
            <div>
              {{ $t('unstoppable.upload-your-zip-file') }}
            </div>
          </div>
          <div>
            <mew-button
              title="Browse..."
              btn-style="outline"
              color-theme="primary"
              btn-size="medium"
              @click.native="ipfsClick"
            />
          </div>
        </div>
      </v-sheet>

      <div>
        <div
          v-if="loading"
          class="pa-8 d-flex flex-column align-center justify-center"
        >
          <v-progress-circular indeterminate />
          <span class="mew-heading-2 mt-8"
            >{{ $t('unstoppable.updating-your-records') }}
          </span>
          <span class="mew-body d-flex text-center mt-4" style="width: 317px">
            {{ $t('unstoppable.processing-registration-advice') }}
          </span>
        </div>

        <div class="my-5 d-flex align-center justify-space-between">
          <v-divider></v-divider>
          <div class="px-5">OR</div>
          <v-divider></v-divider>
        </div>

        <div v-if="!loading">
          <div class="d-flex justify-space-between align-center">
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
            </div>
          </div>

          <div class="d-flex align-center justify-space-around">
            <div class="bluePrimary--text font-weight-bold">
              {{ $t('unstoppable.ipfs-hash') }}
            </div>
            <div class="pt-5" style="min-width: 300px">
              <mew-input
                v-model="input"
                placeholder="Know your IPFS Hash? Enter it instead"
                has-full-width
                :rules="[v => isValidIpfs(v) || 'Invalid IPFS hash']"
              />
            </div>
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
        </div>
      </div>
    </div>

    <mew-button
      :title="$t('unstoppable.save-and-close')"
      btn-size="xlarge"
      :disabled="disabled"
      @click.native="() => saveIpfsHash(input)"
    />
  </mew-overlay>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import resolverAbi from '../handlers/resolverAbi';
import isIpfs from 'is-ipfs';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

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
    ...mapGetters('unstoppable', [
      'managedDomain',
      'resolution',
      'activeOverlay'
    ]),
    ipfsHash: {
      get() {
        return this.managedDomain.ipfsHash;
      },
      set(newHash) {
        return newHash;
      }
    },
    name() {
      return this.managedDomain.name ? this.managedDomain.name : '';
    }
  },
  watch: {
    managedDomain: async function (newVal, oldVal) {
      if (this.activeOverlay === 'UploadIpfsOverlay' && newVal) {
        if (newVal.name !== oldVal.name) {
          await this.fetchRecords();
        }
      }
    }
  },
  methods: {
    ...mapMutations('unstoppable', ['SET_ACTIVE_OVERLAY']),
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
        .getIpfsHash(this.name)
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
            Toast(e, {}, ERROR);
          });
        if (ipfsHash.error) {
          Toast('error fetching ipfs', {}, ERROR);
        } else {
          this.ipfsHash = ipfsHash;
          this.saveIpfsHash(ipfsHash);
        }
      } catch (e) {
        this.loading = false;
        Toast(e, {}, ERROR);
      }
    },

    async saveIpfsHash(hash) {
      this.loading = true;

      const currentResolverAddress = await this.resolution.getResolver(
        this.name
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
            .set('ipfs.html.value', hash, this.namehash)
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
.upload-ipfs {
  width: 100%;
}

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
