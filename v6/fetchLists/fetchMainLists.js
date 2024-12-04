const configs = require('./configs');
const fetch = require('node-fetch');
const fs = require('fs');

const fetchLists = async () => {
  const contractList = await fetch(
    'https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/dist/contracts'
  )
    .then(res => res.json())
    .catch(console.error);
  const tokensList = await fetch(
    'https://api.github.com/repos/MyEtherWallet/ethereum-lists/contents/dist/tokens'
  )
    .then(res => res.json())
    .catch(console.error);
  fs.writeFileSync(
    configs.MAIN_LISTS_PATH + '/contracts.json',
    JSON.stringify(contractList)
  );
  fs.writeFileSync(
    configs.MAIN_LISTS_PATH + '/tokens.json',
    JSON.stringify(tokensList)
  );
};
(async () => {
  try {
    await fetchLists();
    console.log('Done');
  } catch (e) {
    console.error('Fetch list errored!', e);
  }
})();
