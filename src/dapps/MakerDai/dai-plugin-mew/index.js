import MewSubProvider from './mew-subprovider';

export default function(web3, address, options) {
  const subprovider = MewSubProvider(web3, address, options);

  return maker => {
    maker.service('accounts', true).addAccountType('mew', async settings => {
      console.log('maker.service settings', settings); // todo remove dev item
      address = await new Promise((resolve, reject) =>
        subprovider.getAccounts((err /*, addresses*/) =>
          err ? reject(err) : resolve(address)
        )
      );
      return { subprovider, address };
    });
  };
}
