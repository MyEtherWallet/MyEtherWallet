export default {
  eth: {
    sendTransaction(params) {
      console.log('params', params);
    },
    getTransactionCount(params) {
      console.log('params', params);
      return '0000';
    },
    estimateGas(params) {
      return new Promise((resolve, reject) => {
        if (params) {
          return resolve('21000');
        }
        return reject();
      });
    },
    getCoinbase() {
      return '0x00';
    },
    Contract(abi) {
      console.log('abi', abi);
      return {
        methods: {
          transfer() {
            return true;
          }
        }
      };
    }
  }
};
