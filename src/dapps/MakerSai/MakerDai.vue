<template>
  <div class="container-maker">
    <back-button :path="'/interface/dapps/'"> </back-button>
    <div class="maker-announcement">
      {{$t('dappsMaker.shutdown')}}

      <div class="maker-info">
        <b> {{$t('dappsMaker.what-does-shutdown-mean')}}</b>
        <br />
        {{$t('dappsMaker.what-does-shutdown-mean-reason')}}
      </div>

      <br />
      {{$t('dappsMaker.shutdown-learn-more')}}
      <br />
      <a
        class="maker-link"
        href="https://blog.makerdao.com/a-guide-to-single-collateral-dai-sai-shutdown/"
        target="_blank"
        ><b>{{$t('dappsMaker.guide-to-shutdown')}} </b>
      </a>
      <br />
      {{$t('dappsMaker.or')}}
      <br />
      <a
        class="maker-link"
        href="https://forum.makerdao.com/t/sequential-process-for-scd-shutdown/1823"
        target="_blank"
        ><b>{{$t('dappsMaker.shutdown-process')}}</b></a
      >
    </div>

    <div class="buttons-container"></div>

    <router-view> </router-view>
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';

export default {
  components: {
    'back-button': BackButton
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerDai.scss';
</style>
