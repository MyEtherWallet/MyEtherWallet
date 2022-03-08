import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { ethers } from 'ethers';

function hashLeaf([address, entry]) {
  return ethers.utils.solidityKeccak256(
    ['address', 'uint256'],
    [address, entry.balance]
  );
}

export function getIndex(address, entry, proof) {
  let index = 0;
  let computedHash = hashLeaf([address, entry]);

  for (let i = 0; i < proof.length; i++) {
    index *= 2;
    const proofElement = proof[i];

    if (computedHash <= proofElement) {
      // Hash(current computed hash + current element of the proof)
      computedHash = ethers.utils.solidityKeccak256(
        ['bytes32', 'bytes32'],
        [computedHash, proofElement]
      );
    } else {
      // Hash(current element of the proof + current computed hash)
      computedHash = ethers.utils.solidityKeccak256(
        ['bytes32', 'bytes32'],
        [proofElement, computedHash]
      );
      index += 1;
    }
  }
  return index;
}

class ShardedMerkleTree {
  constructor(fetcher, shardNybbles, root) {
    this.fetcher = fetcher;
    this.shardNybbles = shardNybbles;
    this.root = root;
    this.shards = {};
    this.trees = {};
  }

  getProof(address) {
    const shardid = address.slice(2, 2 + this.shardNybbles).toLowerCase();
    let shard = this.shards[shardid];
    if (shard === undefined) {
      shard = this.shards[shardid] = this.fetcher(shardid);
      this.trees[shardid] = new MerkleTree(
        Object.entries(shard.entries).map(hashLeaf),
        keccak256,
        { sort: true }
      );
    }
    const entry = shard.entries[address];
    const leaf = hashLeaf([address, entry]);
    const proof = this.trees[shardid]
      .getProof(leaf)
      .map(entry => '0x' + entry.data.toString('hex'));
    return [entry, proof.concat(shard.proof), leaf];
  }
}

export default ShardedMerkleTree;
