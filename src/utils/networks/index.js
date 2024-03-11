import plafrom from 'platform';
import * as types from './types';
import * as nodes from './nodes';

const nodeList = {};
Object.keys(types).forEach(key => {
  nodeList[types[key].name] = [];
});

Object.keys(nodes).forEach(key => {
  if (
    nodes[key].service === 'infura.io' &&
    platform.name &&
    platform.name === 'firefox'
  )
    return;
  // temp until infura fix https://github.com/INFURA/infura/issues/174

  nodeList[nodes[key].type.name].push(nodes[key]);
});

export default nodeList;
