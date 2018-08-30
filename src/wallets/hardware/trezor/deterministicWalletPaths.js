import * as nodes from '../../../networks/types';
import store from 'store';
import derivationPaths from './derivationPaths';

function getDerivationPath(networkName) {
  if (!networkName) {
    if (store.get('network') !== undefined) {
      networkName = store.get('network').type.name;
    }
  }
  if (paths[networkName]) {
    return { dpath: paths[networkName], label: nodes[networkName].name_long };
  }
  return {
    dpath: paths[nodes.ETH.name],
    label: nodes[nodes.ETH.name].name_long
  };
}

const paths = {};

Object.keys(derivationPaths).forEach(key => {
  paths[derivationPaths[key]] = {
    dpath: paths[key],
    label: nodes[key].name_long
  };
});

export { paths, getDerivationPath };
