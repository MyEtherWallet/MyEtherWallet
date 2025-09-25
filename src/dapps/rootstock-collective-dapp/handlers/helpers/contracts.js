import { ROOTSTOCK } from '@/utils/networks/types';

const RIF_TESTNET = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe';
const RIF_MAINNET = '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5';

const STRIF_TESTNET = '0xC4b091d97AD25ceA5922f09fe80711B7ACBbb16f';
const STRIF_MAINNET = '0x5db91e24bd32059584bbdb831a901f1199f3d459';

const GOV_TESTNET = '0xB1A39B8f57A55d1429324EEb1564122806eb297F';
const GOV_MAINNET = '0x71ac6ff904a17f50f2c07b693376ccc1c92627f0';

const TREASURY_TESTNET = '0x2217E4d3Ae0A6E30075D1B5a7b8C1520E8009f49';
const TREASURY_MAINNET = '0xf016fa6b237bb56e3aee7022c6947a6a103e3c47';

const BUILDER_REGISTRY_MAINNET = '0x8cb62c58AC3D1253c6467537FDDc563857eD76cb';
const BUILDER_REGISTRY_TESTNET = '0xad125E6D5C3B84329fa2466A8A6955F67906F4b2';

const BACKER_MANAGER_MAINNET = '0x7995C48D987941291d8008695A4133E557a11530';
const BACKER_MANAGER_TESTNET = '0x70AC0FE4F8BCA42Aa7e713E1EDA2E8166d0f8Ed8';

const REWARD_DISTRIBUTOR_MAINNET = '0x5603Ba40257e317e45BA13C3732819Af5E81a9A1';
const REWARD_DISTRIBUTOR_TESTNET = '0x35EB7d3e0907BCB838fbA3b08C4c65DB5431169f';

export const ContractType = {
  RIF: 'RIF',
  STRIF: 'STRIF',
  GOV: 'GOV',
  TREASURY: 'TREASURY',
  BUILDER_REGISTRY: 'BUILDER_REGISTRY',
  BACKER_MANAGER: 'BACKER_MANAGER',
  REWARD_DISTRIBUTOR: 'REWARD_DISTRIBUTOR'
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
  },
  [ContractType.BUILDER_REGISTRY]: {
    mainnet: BUILDER_REGISTRY_MAINNET,
    testnet: BUILDER_REGISTRY_TESTNET
  },
  [ContractType.BACKER_MANAGER]: {
    mainnet: BACKER_MANAGER_MAINNET,
    testnet: BACKER_MANAGER_TESTNET
  },
  [ContractType.REWARD_DISTRIBUTOR]: {
    mainnet: REWARD_DISTRIBUTOR_MAINNET,
    testnet: REWARD_DISTRIBUTOR_TESTNET
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
