import * as proofShards from './merkleproofs';
import ShardedMerkleTree, { getIndex } from './merkle';
import { toBN } from 'web3-utils';
import ENSTokenABI from '../handlers/abi/ENSToken';

export const getENSTokenContractAddress =
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72';

export const generateMerkleShardUrl = address =>
  proofShards[`x${address?.slice(2, 4)}`];

export const hasClaimed = async (address, web3) => {
  try {
    address = address.toLowerCase();
    const shardJson = generateMerkleShardUrl(address);
    const { root, shardNybbles, total } = proofShards.root;
    const shardedMerkleTree = new ShardedMerkleTree(
      () => shardJson,
      shardNybbles,
      root,
      toBN(total)
    );
    const ENSTokenContract = new web3.eth.Contract(
      ENSTokenABI,
      getENSTokenContractAddress
    );
    const [entry, proof] = shardedMerkleTree.getProof(address);
    const index = getIndex(address, entry, proof);
    const result = await ENSTokenContract.methods.isClaimed(index).call();
    return { claimed: result, balance: entry.balance, proof };
  } catch (error) {
    return false;
  }
};

export const submitClaim = async (balance, proof, address, web3) => {
  const ENSTokenContract = new web3.eth.Contract(
    ENSTokenABI,
    getENSTokenContractAddress
  );
  const fromAccount = await web3.eth.getCoinbase();
  return ENSTokenContract.methods
    .claimTokens(balance, address, proof)
    .send({ from: fromAccount });
};
