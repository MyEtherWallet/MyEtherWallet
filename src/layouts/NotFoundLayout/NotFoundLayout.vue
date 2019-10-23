<template>
  <div class="not-found">
    <div class="wrap">
      <div class="page-container">
        <div class="content-block">
          <div class="block-title">404</div>
          <div class="block-text">{{ $t('home.lostTitle') }}</div>
          <div class="ailien-spaceship">
            <img src="~@/assets/images/icons/alien-spaceship.svg" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'NotFoundLayout.scss';
</style>
