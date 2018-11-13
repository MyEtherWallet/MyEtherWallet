<template>
  <div class="modal-container">

    <b-modal
      ref="logout"
      title="Settings"
      hide-footer
      centered
      class="bootstrap-modal nopadding">
      <div class="modal-contents">
        Logout
      </div>
    </b-modal>    
  </div>
</template>

<script>
export default {
  name: 'Lougout',
  components: {

  },
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
@import 'LogoutModal.scss';
</style>
