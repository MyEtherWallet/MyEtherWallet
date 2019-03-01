const MIN_DEPOSIT = 0.005;

const settings = {
  contentUrl: 'https://content.makerfoundation.com/content/dai-dashboard',
  chain: {
    KOV: {
      nodeURL: 'https://kovan.infura.io/v3/078596535bf243c6996d2ac196563d49',
      saiValuesAggregator: '0x040abcb09a5b46f9a5ebed320abe074e6e626cc5',
      otc: '0x4a6bc4e803c62081ffebcc8d227b5a87a58f1f8f',
      fromBlock: 5216602,
      service: 'https://sai-kovan.makerfoundation.com/v1',
      chart: false,
      proxyRegistry: '0x64a436ae831c1672ae81f674cab8b6775df3475c',
      saiProxyCreateAndExecute: '0x96fc005a8ba82b84b11e0ff211a2a1362f107ef0'
    },
    ETH: {
      nodeURL: 'https://mainnet.infura.io/v3/078596535bf243c6996d2ac196563d49',
      saiValuesAggregator: '0x83f6ed3d377674186d8898a89d9032216e07e659',
      otc: '0x39755357759ce0d7f32dc8dc45414cca409ae24e',
      fromBlock: 4752013,
      service: 'https://sai-mainnet.makerfoundation.com/v1',
      chart: false,
      proxyRegistry: '0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4',
      saiProxyCreateAndExecute: '0x526af336d614ade5cc252a407062b8861af998f5'
    }
  }
};

export { MIN_DEPOSIT, settings };
