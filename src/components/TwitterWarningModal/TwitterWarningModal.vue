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
          Our Twitter account has been inaccessible since the Twitter Hack on
          July 15th with no response from Twitter Support. <br /><br />
          We're calling on the MEW community for help! Re-tweet MEW founder’s
          message to restore MEW Twitter!
        </p>
        <a
          href="https://twitter.com/intent/retweet?tweet_id=1290353025358295040"
          target="_blank"
        >
          <i class="fa fa-retweet" />
          Retweet
        </a>
      </div>
    </b-modal>
  </div>
</template>
<script></script>

<style lang="scss">
@import './TwitterWarningModal.scss';
</style>
