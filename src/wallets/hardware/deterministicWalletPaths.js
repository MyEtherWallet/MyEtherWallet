const paths = [
  {
    chain: 'hwUbqPath',
    valid: ['ledger', 'trezor'],
    values: { symbol: 'UBQ', label: 'Ubiq (UBQ)', dpath: "m/44'/108'/0'/0" }
  }, // first address: m/44'/40'/0'/0/0
  {
    chain: 'hwExpansePath',
    valid: ['ledger', 'trezor'],
    values: { symbol: 'EXP', label: 'Expanse (EXP)', dpath: "m/44'/40'/0'/0" }
  }, // first address: m/44'/40'/0'/0/0
  {
    chain: 'hwEllaismPath',
    valid: ['trezor'],
    values: {
      symbol: 'ELLA',
      label: 'Ellaism (ELLA)',
      dpath: "m/44'/163'/0'/0"
    }
  }, // first address: m/44'/163'/0'/0/0
  {
    chain: 'hwEtherGemPath',
    valid: ['trezor'],
    values: {
      symbol: 'EGEM',
      label: 'EtherGem (EGEM)',
      dpath: "m/44'/1987'/0'/0"
    }
  }, // first address: m/44'/1987'/0'/0/0
  {
    chain: 'hwCallistoPath',
    valid: ['trezor'],
    values: { symbol: 'CLO', label: 'Callisto (CLO)', dpath: "m/44'/820'/0'/0" }
  }, // first address: m/44'/820'/0'/0/0
  {
    chain: 'hwSocialPath',
    valid: ['trezor'],
    values: {
      symbol: 'ETSC',
      label: 'Ethereum Social (ETSC)',
      dpath: "m/44'/1128'/0'/0"
    }
  }, // first address: m/44'/1128'/0'/0/0
  {
    chain: 'hwMusicoinPath',
    valid: ['trezor'],
    values: {
      symbol: 'MUSIC',
      label: 'Musicoin (MUSIC)',
      dpath: "m/44'/184'/0'/0"
    }
  }, // first address: m/44'/184'/0'/0/0
  {
    chain: 'singularDTVPath',
    valid: ['trezor'],
    values: {
      symbol: 'SingularDTV',
      label: 'SingularDTV ',
      dpath: "m/0'/0'/0'"
    }
  }, // first address: m/0'/0'/0'/0
  {
    chain: 'goPath',
    valid: ['trezor'],
    values: { symbol: 'GO', label: 'GoChain (GO)', dpath: "m/44'/6060'/0'/0" }
  }, // first address: m/44'/6060'/0'/0/0
  {
    chain: 'hwEOSClassicPath',
    valid: ['trezor'],
    values: {
      symbol: 'EOS',
      label: 'EOS Classic (EOS)',
      dpath: "m/44'/2018'/0'/0"
    }
  }, // first address: m/44'/2018'/0'/0/0
  {
    chain: 'hwAkromaPath',
    valid: ['ledger', 'trezor'],
    values: {
      symbol: 'AKA',
      label: 'Akroma (AKA)',
      dpath: "m/44'/200625'/0'/0"
    }
  }, // first address: m/44'/200625'/0'/0/0
  {
    chain: 'hwESNetworkPath',
    valid: ['trezor'],
    values: {
      symbol: 'ESN',
      label: 'EtherSocial (ESN)',
      dpath: "m/44'/31102'/0'/0"
    }
  }, // first address: m/44'/31102'/0'/0/0
  {
    chain: 'hwPirlPath',
    valid: ['ledger'],
    values: { symbol: 'PIRL', label: 'PIRL (PIRL)', dpath: "m/44'/164'/0'/0" }
  }, // first address: m/44'/164'/0'/0/0
  {
    chain: 'hwEther1Path',
    valid: ['ledger'],
    values: {
      symbol: 'ETHO',
      label: 'Ether-1 (ETHO)',
      dpath: "m/44'/1313114'/0'/0"
    }
  } // first address: m/44'/1313114'/0'/0/0
];

export default paths;
