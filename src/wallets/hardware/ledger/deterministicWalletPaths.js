import store from 'store';
import * as nodes from '../../../networks/types';
import derivationPaths from './derivationPaths';

function getDerivationPath(networkName) {
  if (!networkName) {
    if (store.get('network') !== undefined) {
      networkName = store.get('network').type.name;
    }
  }
  if (paths[networkName]) {
    return {
      dpath: derivationPaths[networkName],
      label: derivationPaths[networkName].name_long
    };
  }
  return {
    dpath: derivationPaths[nodes.ETH.name],
    label: nodes[nodes.ETH.name].name_long
  };
}

function buildPathsObject() {
  const paths = {};

  Object.keys(derivationPaths).forEach(key => {
    paths[derivationPaths[key]] = {
      dpath: derivationPaths[key],
      label: nodes[key].name_long
    };
  });
  return paths;
}

const paths = buildPathsObject();

export { paths, getDerivationPath };
