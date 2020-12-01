const currencies = [
  {
    name: 'bitcoin',
    symbol: 'btc'
  },
  {
    name: 'liteCoin',
    symbol: 'ltc'
  },
  {
    name: 'denarius',
    symbol: 'dnr'
  },
  {
    name: 'peerCoin',
    symbol: 'ppc'
  },
  {
    name: 'dogeCoin',
    symbol: 'doge'
  },
  {
    name: 'beaverCoin',
    symbol: 'bvc'
  },
  {
    name: 'freiCoin',
    symbol: 'frc'
  },
  {
    name: 'protoShares',
    symbol: 'pts'
  },
  {
    name: 'megaCoin',
    symbol: 'mec'
  },
  {
    name: 'primeCoin',
    symbol: 'xpm'
  },
  {
    name: 'auroraCoin',
    symbol: 'aur'
  },
  {
    name: 'nameCoin',
    symbol: 'nmc'
  }
];

const multiCoinCurrencies = [
  {
    name: 'Bitcoin',
    symbol: 'btc'
  },
  {
    name: 'BitcoinCash',
    symbol: 'bch'
  },
  {
    name: 'Bitcoin SV',
    symbol: 'bsv'
  },
  {
    name: 'LiteCoin',
    symbol: 'ltc'
  },
  {
    name: 'PeerCoin',
    symbol: 'ppc'
  },
  {
    name: 'DogeCoin',
    symbol: 'doge'
  },
  {
    name: 'BeaverCoin',
    symbol: 'bvc'
  },
  {
    name: 'FreiCoin',
    symbol: 'frc'
  },
  {
    name: 'ProtoShares',
    symbol: 'pts'
  },
  {
    name: 'MegaCoin',
    symbol: 'mec'
  },
  {
    name: 'PrimeCoin',
    symbol: 'xpm'
  },
  {
    name: 'AuroraCoin',
    symbol: 'aur'
  },
  {
    name: 'NameCoin',
    symbol: 'nmc'
  },
  {
    name: 'BioCoin',
    symbol: 'bio'
  },
  {
    name: 'GarliCoin',
    symbol: 'grlc'
  },
  {
    name: 'VertCoin',
    symbol: 'vtc'
  },
  {
    name: 'BitcoinGold',
    symbol: 'btg'
  },
  {
    name: 'Komodo',
    symbol: 'kmd'
  },
  {
    name: 'BitcoinZ',
    symbol: 'btcz'
  },
  {
    name: 'BitcoinPrivate',
    symbol: 'btcp'
  },
  {
    name: 'Hush',
    symbol: 'hush'
  },
  {
    name: 'SnowGem',
    symbol: 'sng'
  },
  {
    name: 'ZCash',
    symbol: 'zec'
  },
  {
    name: 'ZClassic',
    symbol: 'zcl'
  },
  {
    name: 'ZenCash',
    symbol: 'zen'
  },
  {
    name: 'VoteCoin',
    symbol: 'vot'
  },
  {
    name: 'Decred',
    symbol: 'dcr'
  },
  {
    name: 'GameCredits',
    symbol: 'game'
  },
  {
    name: 'PIVX',
    symbol: 'pivx'
  },
  {
    name: 'SolarCoin',
    symbol: 'slr'
  },
  {
    name: 'MonaCoin',
    symbol: 'mona'
  },
  {
    name: 'DigiByte',
    symbol: 'dgb'
  },
  {
    name: 'Tether',
    symbol: 'usdt'
  },
  {
    name: 'Ripple',
    symbol: 'xrp'
  },
  {
    name: 'Dash',
    symbol: 'dash'
  },
  {
    name: 'Neo',
    symbol: 'neo'
  },
  {
    name: 'NeoGas',
    symbol: 'gas'
  },
  {
    name: 'Qtum',
    symbol: 'qtum'
  },
  {
    name: 'Waves',
    symbol: 'waves'
  },
  {
    name: 'Ethereum',
    symbol: 'eth'
  },
  {
    name: 'EtherZero',
    symbol: 'etz'
  },
  {
    name: 'EthereumClassic',
    symbol: 'etc'
  },
  {
    name: 'Callisto',
    symbol: 'clo'
  },
  {
    name: 'Bankex',
    symbol: 'bkx'
  },
  {
    name: 'Cardano',
    symbol: 'ada'
  },
  {
    name: 'Monero',
    symbol: 'xmr'
  },
  {
    name: 'Aragon',
    symbol: 'ant'
  },
  {
    name: 'Basic Attention Token',
    symbol: 'bat'
  },
  {
    name: 'Bancor',
    symbol: 'bnt'
  },
  {
    name: 'Civic',
    symbol: 'cvc'
  },
  {
    name: 'District0x',
    symbol: 'dnt'
  },
  {
    name: 'Gnosis',
    symbol: 'gno'
  },
  {
    name: 'Golem',
    symbol: 'gnt'
  },
  {
    name: 'Matchpool',
    symbol: 'gup'
  },
  {
    name: 'Melon',
    symbol: 'mln'
  },
  {
    name: 'Numeraire',
    symbol: 'nmr'
  },
  {
    name: 'OmiseGO',
    symbol: 'omg'
  },
  {
    name: 'TenX',
    symbol: 'pay'
  },
  {
    name: 'Ripio Credit Network',
    symbol: 'rcn'
  },
  {
    name: 'Augur',
    symbol: 'rep'
  },
  {
    name: 'iExec RLC',
    symbol: 'rlc'
  },
  {
    name: 'Salt',
    symbol: 'salt'
  },
  {
    name: 'Status',
    symbol: 'snt'
  },
  {
    name: 'Storj',
    symbol: 'storj'
  },
  {
    name: 'Swarm City',
    symbol: 'swt'
  },
  {
    name: 'TrueUSD',
    symbol: 'tusd'
  },
  {
    name: 'Wings',
    symbol: 'wings'
  },
  {
    name: '0x',
    symbol: 'zrx'
  },
  {
    name: 'Expanse',
    symbol: 'exp'
  },
  {
    name: 'Viberate',
    symbol: 'vib'
  },
  {
    name: 'Odyssey',
    symbol: 'ocn'
  },
  {
    name: 'Polymath',
    symbol: 'poly'
  },
  {
    name: 'Storm',
    symbol: 'storm'
  },
  {
    name: 'Nano',
    symbol: 'nano'
  },
  {
    name: 'RaiBlocks',
    symbol: 'xrb'
  },
  {
    name: 'siacoin',
    symbol: 'sc'
  },
  {
    name: 'hyperspace',
    symbol: 'xsc'
  },
  {
    name: 'loki',
    symbol: 'loki'
  },
  {
    name: 'lbry',
    symbol: 'lbc'
  },
  {
    name: 'tron',
    symbol: 'trx'
  },
  {
    name: 'nem',
    symbol: 'xem'
  },
  {
    name: 'lisk',
    symbol: 'lsk'
  }
];

function canValidateMulticoin(currencyNameOrSymbol) {
  const nameOrSymbol = currencyNameOrSymbol.toLowerCase();
  return multiCoinCurrencies.find(function (currency) {
    return (
      currency.name.toLowerCase() === nameOrSymbol ||
      currency.symbol.toLowerCase() === nameOrSymbol
    );
  });
}

function canValidateCoin(currencyNameOrSymbol) {
  const nameOrSymbol = currencyNameOrSymbol.toLowerCase();
  return currencies.find(function (currency) {
    return (
      currency.name.toLowerCase() === nameOrSymbol ||
      currency.symbol.toLowerCase() === nameOrSymbol
    );
  });
}

export { canValidateMulticoin, canValidateCoin };
