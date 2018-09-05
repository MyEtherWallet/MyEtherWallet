/* Accepts string, returns boolean */
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

function doesExist(val) {
  return val !== undefined && val !== null;
}

function padLeftEven(hex) {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
}

function nameHash(name, web3) {
  let node =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  if (name !== '') {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      node = web3.utils.sha3(node + web3.utils.sha3(labels[i]).slice(2), {
        encoding: 'hex'
      });
    }
  }

  return node.toString();
}

export default { isJson, doesExists, padLeftEven, nameHash };
