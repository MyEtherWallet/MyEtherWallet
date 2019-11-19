import BigNumber from 'bignumber.js';

export const ServiceRoles = {
  CDP_MANAGER: 'mcd:cdpManager',
  CDP_TYPE: 'mcd:cdpType',
  AUCTION: 'mcd:auction',
  SYSTEM_DATA: 'mcd:systemData',
  QUERY_API: 'mcd:queryApi',
  SAVINGS: 'mcd:savings'
};

export const WAD = new BigNumber('1e18');
export const RAY = new BigNumber('1e27');
export const RAD = new BigNumber('1e45');

export const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
