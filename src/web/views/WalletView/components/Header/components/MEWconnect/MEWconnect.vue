<template>
  <div>
    <MewWalletStatus>
      <div class="d-flex align-center cursor--pointer">
        <img src="@/assets/images/icons/icon-mew-connect.svg" />
        <div class="mew-connect-text ml-1">
          <div>MEWconnect</div>
          <div>Connected...</div>
        </div>
      </div>
    </MewWalletStatus>
  </div>
</template>

<script>
import MewWalletStatus from '@/web/components/Popups/MewWalletStatus';

export default {
  components: { MewWalletStatus },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.mew-connect-text div {
  font-size: 11px;
  line-height: 13px;
  color: var(--v-emerald-base);
}
</style>
