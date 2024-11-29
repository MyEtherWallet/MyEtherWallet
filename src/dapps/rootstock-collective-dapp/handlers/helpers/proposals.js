import { ethers } from 'ethers';
import { treasuryABI } from './abi/treasuryABI';

const blockscout = {
  30: 'https://rootstock.blockscout.com',
  31: 'https://rootstock-testnet.blockscout.com'
};

export const fetchProposals = async (chainId, govAddress) => {
  const topic =
    '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0';
  const baseUrl = blockscout[chainId];
  let fromBlock = '';

  const cachedProposals = localStorage.getItem(topic);
  try {
    const response = await fetch(
      `${baseUrl}/api?module=account&action=txlist&address=${govAddress}&sort=asc`
    );

    if (response.ok && response.status === 200) {
      const data = await response.json();
      const [firstTx] = data.result;

      if (firstTx) {
        fromBlock = firstTx.blockNumber?.toString();
      }

      const responseEvents = await fetch(
        `${baseUrl}/api?module=logs&action=getLogs&address=${govAddress}&toBlock=latest&fromBlock=${fromBlock}&topic0=${topic}`
      );

      if (responseEvents.ok && responseEvents.status === 200) {
        const eventsData = await responseEvents.json();
        localStorage.setItem(topic, JSON.stringify(eventsData.result));
        return Promise.resolve(eventsData.result);
      }
      return Promise.resolve([]);
    }

    if (cachedProposals) {
      const parsedProposals = JSON.parse(cachedProposals);
      return Promise.resolve(parsedProposals);
    }
    return Promise.resolve([]);
  } catch (e) {
    return Promise.resolve({ error: e });
  }
};

export const convertToTimeRemaining = seconds => {
  const days = Math.floor(seconds / (24 * 60 * 60)); // Number of days
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)); // Remaining hours
  const minutes = Math.floor((seconds % (60 * 60)) / 60); // Remaining minutes
  const remainingSeconds = Math.floor(seconds % 60); // Remaining seconds

  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
};

export const ProposalState = [
  'Pending',
  'Active',
  'Canceled',
  'Defeated',
  'Succeeded',
  'Queued',
  'Expired',
  'Executed'
];

export const ProposalStateClass = [
  'bg-st-pending',
  'bg-st-active',
  'bg-st-canceled',
  'bg-st-defeated',
  'bg-st-succeeded',
  'bg-st-queued',
  'bg-st-expired',
  'bg-st-executed'
];

export const zeroAddress = '0x0000000000000000000000000000000000000000';

const encodeFunctionData = (name, args) => {
  return new ethers.utils.Interface(treasuryABI).encodeFunctionData(name, args);
};

export const decodeFunctionData = (abi, name, tx) => {
  return new ethers.utils.Interface(abi).decodeFunctionData(name, tx);
};

export const encodeTreasuryTransfer = (address, amountToTransfer) => {
  return encodeFunctionData('withdraw', [
    address,
    ethers.utils.parseEther(amountToTransfer)
  ]);
};

export const encodeTreasuryERC20Transfer = (
  address,
  amountToTransfer,
  rifTokenAddress
) => {
  return encodeFunctionData('withdrawERC20', [
    rifTokenAddress,
    address,
    ethers.utils.parseEther(amountToTransfer)
  ]);
};

const solidityPackedKeccak256 = (t, v) => {
  const pack = ethers.utils.solidityPack(t, v);

  return ethers.utils.keccak256(pack);
};

export const createProposal = (calldata, description, TreasuryAddress) => {
  const proposal = [[TreasuryAddress], [0n], calldata, description];
  const descriptionHash = solidityPackedKeccak256(['string'], [description]);
  const proposalToRunHash = [...proposal.slice(3), descriptionHash];
  return {
    proposal,
    proposalToRunHash
  };
};
