<template>
  <div>
    <issue-log-modal ref="issueLog" :stack-trace="issueTrace" />
    <error-modal ref="errorModal" :message="errorMsg" />
    <print-modal ref="printModal" :type="printType" />
  </div>
</template>
<script>
import IssueLogModal from './components/IssueLogModal';
import ErrorModal from './components/ErrorModal';
import PrintModal from './components/PrintModal';
export default {
  name: 'ModalContainer',
  components: {
    'issue-log-modal': IssueLogModal,
    'error-modal': ErrorModal,
    'print-modal': PrintModal
  },
  data() {
    return {
      errorMsg: '',
      issueTrace: '',
      printType: ''
    };
  },
  mounted() {
    this.$eventHub.$on('issueOccured', issueTrace => {
      this.issueTrace = issueTrace;
      this.$refs.issueLog.$refs.issuelog.show();
    });
    this.$eventHub.$on('errorOccured', errorMsg => {
      this.errorMsg = errorMsg;
      this.$refs.errorModal.$refs.errorModal.show();
    });
    this.$eventHub.$on('printModal', type => {
      this.printType = type;
      this.$refs.printModal.$refs.print.show();
    });
  }
};
</script>
<style lang="scss" scoped>
@import 'ModalContainer.scss';
</style>
