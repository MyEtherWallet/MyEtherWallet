import nodeList from '../../../src/networks';
const _nodeList = {};
for (const net in nodeList) {
  const _net = [nodeList[net][0]];
  _net[0].type.contracts = [];
  _net[0].type.tokens = [];
  _nodeList[net] = _net;
}
module.exports = _nodeList;
