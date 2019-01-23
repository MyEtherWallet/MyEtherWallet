<template>
  <div>
    <issue-log-modal ref="issueLog" :stack-trace="issueTrace" />
    <reveal-json-modal ref="revealJson" :update-json-string="callback" />
    <error-modal ref="errorModal" :message="errorMsg" />
    <print-modal
      ref="printModal"
      :print-type="printType"
      :print-data="printData"
    />
  </div>
</template>
<script>
import IssueLogModal from './components/IssueLogModal';
import ErrorModal from './components/ErrorModal';
import PrintModal from './components/PrintModal';
import RevealJsonModal from './components/RevealJsonModal';
export default {
  name: 'ModalContainer',
  components: {
    'issue-log-modal': IssueLogModal,
    'error-modal': ErrorModal,
    'print-modal': PrintModal,
    'reveal-json-modal': RevealJsonModal
  },
  data() {
    return {
      errorMsg: '',
      issueTrace: '',
      printType: '',
      printData: {},
      callback: () => {}
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
    this.$eventHub.$on('revealJsonModal', callback => {
      this.callback = callback;
      this.$refs.revealJsonModal.$refs.errorModal.show();
    });
    // eslint-disable-next-line
    this.$eventHub.$on('printModal', (type, printData, resolve, reject) => {
      this.printData = printData ? printData : {};
      this.printType = type;
      this.$refs.printModal.$refs.print.show();
      if (type === 'ens') {
        this.$refs.printModal.$refs.print.$on('hidden', resolve);
      }
    });
  }
};
</script>
<style lang="scss" scoped>
@import 'ModalContainer.scss';
</style>
