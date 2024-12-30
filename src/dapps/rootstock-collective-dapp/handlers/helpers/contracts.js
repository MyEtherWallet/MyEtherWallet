import { ROOTSTOCK } from '@/utils/networks/types';

const RIF_TESTNET = '0x19f64674D8a5b4e652319F5e239EFd3bc969a1FE';
const RIF_MAINNET = '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5';

const STRIF_TESTNET = '0x4861198e9A6814EBfb152552D1b1a37426C54D23';
const STRIF_MAINNET = '0x5db91e24bd32059584bbdb831a901f1199f3d459';

const GOV_TESTNET = '0x2109FF4a9D5548a21F877cA937Ac5847Fde49694';
const GOV_MAINNET = '0x71ac6ff904a17f50f2c07b693376ccc1c92627f0';

const TREASURY_TESTNET = '0x2217E4d3Ae0A6E30075D1B5a7b8C1520E8009f49';
const TREASURY_MAINNET = '0xf016fa6b237bb56e3aee7022c6947a6a103e3c47';

export const ContractType = {
  RIF: 'RIF',
  STRIF: 'STRIF',
  GOV: 'GOV',
  TREASURY: 'TREASURY'
};

const CONTRACT_ADDRESSES = {
  [ContractType.RIF]: {
    mainnet: RIF_MAINNET,
    testnet: RIF_TESTNET
  },
  [ContractType.STRIF]: {
    mainnet: STRIF_MAINNET,
    testnet: STRIF_TESTNET
  },
  [ContractType.GOV]: {
    mainnet: GOV_MAINNET,
    testnet: GOV_TESTNET
  },
  [ContractType.TREASURY]: {
    mainnet: TREASURY_MAINNET,
    testnet: TREASURY_TESTNET
  }
};

export const getContractAddress = (contractType, chainId) => {
  if (typeof chainId !== 'number') {
    throw new TypeError('chainId must be a number');
  }

  if (!ContractType[contractType]) {
    throw new Error(`Invalid contract type: ${contractType}`);
  }

  const addresses = CONTRACT_ADDRESSES[contractType];
  return (
    chainId === ROOTSTOCK.chainID ? addresses.mainnet : addresses.testnet
  ).toLowerCase();
};
