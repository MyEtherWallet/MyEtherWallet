import MewSubProvider from './mew-subprovider';

export default function(web3, address, options) {
  const subprovider = MewSubProvider(web3, address, options);

  return maker => {
    maker.service('accounts', true).addAccountType('mew', async () => {
      address = await new Promise((resolve, reject) =>
        subprovider.getAccounts(err => (err ? reject(err) : resolve(address)))
      );
      return { subprovider, address };
    });
  };
}
