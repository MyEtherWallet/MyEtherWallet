const platform = require('platform');
import * as types from './types';
import * as nodes from './nodes';

let nodeList = {};
Object.keys(types).forEach(key => {
  nodeList[types[key].name] = [];
});

Object.keys(nodes).forEach(key => {
  if (nodes[key].service === nodes['ethmew'].service) {
    nodeList[nodes[key].type.name].splice(0, 0, nodes[key]);
  } else if (
    nodes[key].service === 'infura.io' &&
    platform.name &&
    platform.name === 'firefox'
  )
    return;
  // temp until infura fix https://github.com/INFURA/infura/issues/174
  else {
    nodeList[nodes[key].type.name].push(nodes[key]);
  }
});

if (BUILD_TYPE === 'mewcx') {
  const obj = {};
  Object.keys(nodeList).forEach(network => {
    obj[network] = nodeList[network].filter(item => {
      return item.service.includes('-ws');
    });
  });

  Object.keys(obj).forEach(network => {
    if (obj[network].length === 0) {
      delete obj[network];
    }
  });

  nodeList = Object.assign({}, obj);
}

export default nodeList;
