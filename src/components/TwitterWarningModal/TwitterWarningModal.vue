<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="twitterWarning"
      :title="$t('common.addr')"
      hide-footer
      hide-header
      centered
      static
      lazy
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <p>
          {{ $t('header.twitter-modal.pt1') }}
          <br /><br />
          {{ $t('header.twitter-modal.pt2') }}
        </p>
        <a
          href="https://twitter.com/intent/retweet?tweet_id=1290353025358295040"
          target="_blank"
        >
          <i class="fa fa-retweet" />
          {{ $t('header.twitter-modal.retweet') }}
        </a>
      </div>
    </b-modal>
  </div>
</template>
<script></script>

<style lang="scss" scoped>
@import './TwitterWarningModal.scss';
</style>
