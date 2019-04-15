const { detect } = require('detect-browser');
import * as types from './types';
import * as nodes from './nodes';
const nodeList = {};
const browser = detect();
Object.keys(types).forEach(key => {
  nodeList[types[key].name] = [];
});

Object.keys(nodes).forEach(key => {
  if (nodes[key].service === nodes['xdc'].service) {
    nodeList[nodes[key].type.name].splice(0, 0, nodes[key]);
  } else if (
    nodes[key].service === 'infura.io' &&
    browser &&
    browser.name &&
    browser.name === 'firefox'
  )
    return;
  // temp until infura fix https://github.com/INFURA/infura/issues/174
  else {
    nodeList[nodes[key].type.name].push(nodes[key]);
  }
});

export default nodeList;
