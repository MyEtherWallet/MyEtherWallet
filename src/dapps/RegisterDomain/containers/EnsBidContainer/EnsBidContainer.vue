<template lang="html">
  <div>
    <json-string-modal ref="jsonStringModal" :update-json-string="updateJson" />
    <div class="name-available-container">
      <div v-if="$route.fullPath.includes('auction')" class="content-header">
        <div>
          <h3>{{ domainName }}.eth</h3>
          <p>{{ $t('dapps.domainIsAvailable') }}</p>
        </div>
      </div>
      <div v-if="$route.fullPath.includes('bid')" class="auction-started">
        <div>
          <h3>{{ $t('dapps.auctionStarted') }} {{ domainName }}.eth</h3>
        </div>
      </div>
      <div v-if="$route.fullPath.includes('reveal')" class="auction-started">
        <h3>
          {{ $t('dapps.revealBid') }} {{ domainName }}.eth
          {{ $t('dapps.revealBidCont') }}. <br />
          {{ highestBidder }} ETH ({{ $t('dapps.currentHighestBid') }})
        </h3>
      </div>
      <div class="timer-container">
        <timer
          v-if="$route.fullPath.includes('bid')"
          :date-number="auctionDateEnd"
          date-type="reveal"
        />
        <timer
          v-if="
            $route.fullPath.includes('bid') ||
              $route.fullPath.includes('reveal')
          "
          :date-number="auctionDateEnd"
          :style="{ width: $route.fullPath.includes('reveal') ? '100%' : '' }"
          date-type="auction"
        />
      </div>
      <div role="tablist">
        <b-card-header
          :class="[showDetail ? 'done' : '', 'accordion-header']"
          header-tag="header"
        >
          <div><span> 1 </span> &nbsp; {{ $t('dapps.bidInfo') }}</div>
          <div v-show="showDetail" class="edit" @click="editInputs">
            {{ $t('dapps.edit') }}
          </div>
        </b-card-header>
        <b-collapse
          id="bidAccordion"
          v-model="showInfo"
          accordion="bidAccordionCollection"
          role="tabpanel"
        >
          <div class="inputs-container">
            <div class="input-container">
              <label for="localBidAmount">{{ $t('dapps.actualBid') }}</label>
              <input
                v-model="localBidAmount"
                type="number"
                name="localBidAmount"
              />
            </div>
            <div class="input-container">
              <label for="localBidMask">{{ $t('dapps.bidMask') }}</label>
              <input
                v-model="localBidMask"
                :class="[localBidAmount >= localBidMask ? 'errored' : '']"
                type="number"
                name="localBidMask"
              />
              <p v-show="localBidAmount >= localBidMask" class="erroredMsg">
                {{ $t('dapps.bidMaskDesc') }}
              </p>
            </div>
            <div class="input-container">
              <label for="localSecretPhrase" class="secret-phrase-label">
                <span class="input-title">
                  {{ $t('dapps.secretPhrase') }}
                </span>
                <button class="title-button" @click.prevent="generateKeyPhrase">
                  <i class="fa fa-lg fa-refresh" /> {{ $t('dapps.random') }}
                </button>
              </label>
              <input
                v-model="localSecretPhrase"
                type="text"
                name="localSecretPhrase"
              />
            </div>
          </div>
        </b-collapse>
        <b-card-header
          :class="[showInfo ? 'disable' : '', 'accordion-header-details']"
          header-tag="header"
        >
          <div><span> 2 </span> &nbsp; {{ $t('dapps.details') }}</div>
        </b-card-header>
        <b-collapse
          id="detailAccordion"
          v-model="showDetail"
          accordion="bidAccordionCollection"
          role="tabpanel"
        >
          <div class="inputs-container">
            <div
              v-if="!$route.fullPath.includes('reveal')"
              class="confirmation-warning"
            >
              {{ $t('dapps.detailWarning') }}
            </div>
            <div id="printableData" class="detail-info">
              <div class="detail-info-item">
                <span class="detail-title">{{ $t('dapps.actualBid') }}</span>
                <span class="detail-value">{{ raw.bidAmount }} ETH</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-title">{{ $t('dapps.secretPhrase') }}</span>
                <span class="detail-value">{{ raw.secretPhrase }}</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-title">{{ $t('dapps.revealDate') }}</span>
                <span class="detail-value">{{
                  formatDate(raw.revealDate)
                }}</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-title">{{ $t('dapps.bidMask') }}</span>
                <span class="detail-value">{{ raw.bidMask }} ETH</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-title">{{ $t('dapps.auctionEnd') }}</span>
                <span class="detail-value">{{
                  formatDate(raw.auctionDateEnd)
                }}</span>
              </div>

              <div class="json-container">
                <div class="json-label-container">
                  <span class="json-title">{{ $t('dapps.jsonString') }}</span>
                  <button class="title-button" @click="copyString">
                    {{ $t('common.copy') }}
                  </button>
                </div>
                <textarea ref="json" v-model="jsonText" class="json-content" />
              </div>
            </div>
          </div>
        </b-collapse>
        <div class="buttons-container">
          <button
            v-if="$route.fullPath.includes('reveal')"
            class="json-string"
            @click.prevent="openJsonModal"
          >
            {{ $t('dapps.jsonString') }}
          </button>
          <button
            v-show="showInfo"
            name="submit"
            class="submit"
            role="tab"
            @click.prevent="
              $route.fullPath.includes('auction')
                ? startAuctionAndBid()
                : $route.fullPath.includes('bid')
                ? sendBid()
                : revealBid()
            "
          >
            <span v-if="loading === false"> Next </span>
            <i v-else class="fa fa-spinner fa-spin" />
          </button>
          <button
            v-show="showDetail"
            class="submit"
            role="tab"
            @click.prevent="downloadAndSend"
          >
            {{ $t('dapps.saveAndNext') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timer from '../../components/Timer';
import JsonStringModal from '../../components/JsonStringModal';
import { Misc } from '@/helpers';
import printJS from 'print-js';
import { mapGetters } from 'vuex';

export default {
  components: {
    timer: Timer,
    'json-string-modal': JsonStringModal
  },
  props: {
    domainName: {
      type: String,
      default: ''
    },
    bidAmount: {
      type: Number,
      default: 0.01
    },
    bidMask: {
      type: Number,
      default: 0.02
    },
    loading: {
      type: Boolean,
      default: false
    },
    generateKeyPhrase: {
      type: Function,
      default: function() {}
    },
    secretPhrase: {
      type: String,
      default: 'random strings generated'
    },
    startAuctionAndBid: {
      type: Function,
      default: function() {}
    },
    sendBid: {
      type: Function,
      default: function() {}
    },
    revealBid: {
      type: Function,
      default: function() {}
    },
    auctionDateEnd: {
      type: Number,
      default: 0
    },
    highestBidder: {
      type: String,
      default: ''
    },
    step: {
      type: Number,
      default: 1
    },
    raw: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      localSecretPhrase: this.secretPhrase,
      localBidAmount: this.bidAmount,
      localBidMask: this.bidMask,
      localStep: this.step,
      showDetail: false,
      showInfo: true,
      formatDate: Misc.formatDate,
      jsonText: ''
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3'
    })
  },
  watch: {
    localSecretPhrase(newVal) {
      this.$emit('updateSecretPhrase', newVal);
    },
    localBidAmount(newVal) {
      this.$emit('updateBidAmount', +newVal);
    },
    localBidMask(newVal) {
      this.$emit('updateBidMask', +newVal);
    },
    secretPhrase(newVal) {
      this.localSecretPhrase = newVal;
    },
    localStep(newVal) {
      this.showDetail = newVal === 1 ? false : true;
      this.showInfo = newVal === 2 ? false : true;
      this.$emit('updateStep', newVal);
    },
    step(newVal) {
      this.localStep = newVal;
    },
    raw(newVal) {
      this.parseRaw(newVal);
    }
  },
  mounted() {
    if (this.domainName === '')
      this.$router.replace('/interface/dapps/register-domain');
  },
  methods: {
    openJsonModal() {
      this.$refs.jsonStringModal.$refs.jsonString.show();
    },
    updateJson(val) {
      const json = JSON.parse(val);
      this.localSecretPhrase = json['secretPhrase'];
      this.localBidAmount = json['bidAmount'];
      this.localBidMask = json['bidMask'];
    },
    parseRaw(raw) {
      this.jsonText = JSON.stringify({
        name: raw.name,
        nameSHA3: raw.nameSHA3,
        bidAmount: raw.bidAmount,
        bidMask: raw.bidMask,
        value: this.web3.utils.toWei(raw.bidAmount.toString(), 'ether'),
        secretPhrase: raw.secretPhrase,
        secretPhraseSHA3: raw.secretPhraseSHA3
      });
    },
    editInputs() {
      this.localStep = 1;
    },
    copyString() {
      this.$refs['json'].select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    },
    downloadAndSend() {
      const raw = {
        data: this.raw['data'],
        from: this.raw['from'],
        to: this.raw['to'],
        value: this.raw['value'],
        gasPrice: this.raw['gasPrice'],
        gas: this.raw['gas'],
        nonce: this.raw['nonce']
      };
      if (!this.$route.fullPath.includes('reveal')) {
        printJS({
          printable: 'printableData',
          type: 'html',
          header: 'MyEtherWallet - ENS reveal bid'
        });
      }
      this.web3.eth.sendTransaction(raw);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'EnsBidContainer.scss';
</style>
