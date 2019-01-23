
const fs = require('fs')
const uuid = require('uuid/v4');

const fetch = require('node-fetch');
const web3 = require('web3');

const swapConfigFolder = './src/partners/partnersConfig'

class CompileSwapOptions{
  constructor(){
    this.web3 = new web3('https://api.myetherwallet.com/eth');

    this.decimalFunc = [{
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }]

this.needDecimalCheck = [];
  }


  async getDecimals(address){
    try {
      const methodObject = await new this.web3.eth.Contract(
        ERC20(),
        address.contractAddress
      ).methods.decimals().call();
      return methodObject;
    } catch (e) {
      console.error(e);
    }
  }


  async post(url = ``, data = {}, opts = {}) {
    const defaultOptions = {
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    };
    const options = {
      ...defaultOptions,
      ...opts,
      ...{ method: 'POST' }
    };
    return fetch(url, options).then(response => response.json());
  }

  async get(url = ``, opts = {}) {
    const defaultOptions = {
      mode: 'cors',
      cache: 'no-cache'
    };
    const options = {
      ...defaultOptions,
      ...opts,
      ...{ method: 'GET' }
    };
    return fetch(url, options).then(response => response.json());
  }

  buildPayload(method, data) {
    return {
      jsonrpc: '2.0',
      method: method,
      params: data,
      id: uuid()
    };
  }

  async getKyberSupported () {
    try {
      const tokenList = await this.get('https://tracker.kyber.network/api/tokens/supported');
      const tokenDetails = {};
      for (let i = 0; i < tokenList.length; i++) {
        if (
          tokenList[i].symbol &&
          tokenList[i].name &&
          tokenList[i].decimals &&
          tokenList[i].contractAddress
        ) {
          // otherwise the entry is invalid
          const symbol = tokenList[i].symbol.toUpperCase();
          tokenDetails[symbol] = tokenList[i];
        }
      }
      this.KyberCurrencies = tokenDetails;
      return {
        ETH: tokenDetails,
        other: {}
      };
    } catch (e) {
      console.error(e);
    }
  };

  async getChangellyCurrencies ()  {
    const results = await this.post(
      'https://swap.mewapi.io/changelly',
      this.buildPayload('getCurrenciesFull', {})
    );
    return results.result;
  };

   createEntry(item) {
    const matchRegEx = /(?<=https:\/\/etherscan\.io\/token\/)(.*)(?=\?)/;
    const match = matchRegEx.exec(item.addressUrl);
    let decimals = this.KyberCurrencies[item.name.toUpperCase()]
      ? this.KyberCurrencies[item.name.toUpperCase()].decimals
      : 0;

    if (match === null) {
      return {
        name: item.fullName,
        contractAddress: item.addressUrl,
        decimals: decimals
      };
    } else {
      if(decimals === 0 ){
        this.needDecimalCheck.push({symbol: item.name.toUpperCase(), contractAddress: match[0]})
      }
      return {
        name: item.fullName,
        contractAddress: match[0],
        decimals: decimals
      };
    }
  }

   processChangelly(accumulator, currentValue) {
    const regex = /https:\/\/etherscan\.io/;
    if (regex.test(currentValue.transactionUrl)) {
      accumulator.ETH[currentValue.name.toUpperCase()] = this.createEntry(
        currentValue
      );
    } else {
      if(!currentValue.extraIdName){
        accumulator.other[currentValue.name.toUpperCase()] = {
          name: currentValue.name,
          fullName: currentValue.fullName,
          addressLookup: currentValue.addressUrl,
          explorer: currentValue.transactionUrl
        };
      } else {
        console.log(currentValue); // todo remove dev item
      }
    }
    return accumulator;
  }

  async supplyChangellySupported (priorCollected = {
    ETH: {},
    other: {}
  }) {
    try {
      const currencyList = await this.getChangellyCurrencies();
      if (currencyList) {
        currencyList.sort((a, b) => {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        return currencyList.reduce(this.processChangelly.bind(this), priorCollected);
      }
      throw Error('Changelly get supported currencies failed to return a value');
    } catch (e) {
      console.error(e);
    }
  };

  async run() {
    const kyberTokens = await this.getKyberSupported();
    const withChangelly = await this.supplyChangellySupported(kyberTokens)

      for(let i=0; i< this.needDecimalCheck.length; i++){
        const decimals = await this.getDecimals(this.needDecimalCheck[i]);
        if(withChangelly.ETH[this.needDecimalCheck[i].symbol] && decimals){
          withChangelly.ETH[this.needDecimalCheck[i].symbol].decimals = +decimals;
        }
        // console.log(decimals); // todo remove dev item
      }
console.log(Object.keys(withChangelly.ETH).length); // todo remove dev item
    console.log(Object.keys(withChangelly.other).length); // todo remove dev item

    // console.log(withChangelly); // todo remove dev item
    fs.writeFileSync(`${swapConfigFolder}/EthereumTokens.js`, `export default ${JSON.stringify(withChangelly.ETH)} `);
    fs.writeFileSync(`${swapConfigFolder}/NonEthereumCrypto.js`,  `export default ${JSON.stringify(withChangelly.other)}`);
    fs.writeFileSync(`swapOptions.json`, JSON.stringify(withChangelly));
  }

}

const builder = new CompileSwapOptions();
builder.run();



function ERC20(){
  return [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address'
        },
        {
          name: '_to',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'transferFrom',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'transfer',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        },
        {
          name: '_spender',
          type: 'address'
        }
      ],
      name: 'allowance',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_from',
          type: 'address'
        },
        {
          indexed: true,
          name: '_to',
          type: 'address'
        },
        {
          indexed: false,
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'Transfer',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_owner',
          type: 'address'
        },
        {
          indexed: true,
          name: '_spender',
          type: 'address'
        },
        {
          indexed: false,
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'Approval',
      type: 'event'
    }
  ]
}
