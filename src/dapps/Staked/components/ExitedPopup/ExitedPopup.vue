<template>
  <b-modal
    ref="exitedPopup"
    :title="$t('dappsStaked.exited-popup.title')"
    hide-footer
    centered
    static
    lazy
  >
    <div class="modal-contents">
      <p class="font-weight-bold">{{ $t('dappsStaked.exited-popup.desc') }}</p>
      <p class="">{{ $t('dappsStaked.exited-popup.p1') }}</p>
      <i18n tag="p" path="dappsStaked.exited-popup.p2"
        ><a
          slot="link"
          target="_blank"
          href="https://blog.staked.us/blog/eth2-post-mortem"
          >https://blog.staked.us/blog/eth2-post-mortem</a
        ></i18n
      >
      <p>{{ $t('dappsStaked.exited-popup.p3') }}</p>
      <i18n tag="p" path="dappsStaked.exited-popup.p4"
        ><a
          slot="contact-mew"
          target="_blank"
          href="mailto:support@myetherwallet.com"
          >{{ $t('dappsStaked.exited-popup.contact-mew') }}</a
        ></i18n
      >
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
@import 'ExitedPopup.scss';
</style>
