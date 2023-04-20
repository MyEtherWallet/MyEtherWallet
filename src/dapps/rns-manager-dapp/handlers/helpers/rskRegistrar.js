import { Contract, utils, constants } from 'ethers';
import normalize from '@/core/helpers/normalise';

const generateSecret = () =>
  utils.hexZeroPad(
    '0x' + Buffer.from(utils.randomBytes(32)).toString('hex'),
    32
  );

const hashLabel = label => utils.keccak256(utils.toUtf8Bytes(label));

const normalizeName = name => normalize(name);

const validateAndNormalizeLabel = label => {
  const normalizedLabel = normalizeName(label);

  if (normalizedLabel.includes('.')) {
    throw new Error('Label cannot contain a dot');
  }

  if (normalizedLabel === '') {
    throw new Error('Label cannot be empty');
  }

  return normalizedLabel;
};

const rskOwnerAbi = [
  'function available(uint256 tokenId) public view returns(bool)',
  'function ownerOf(uint256 tokenId) public view returns (address)'
];

const fifsAddrRegistrarAbi = [
  'function price (string memory name, uint expires, uint duration) public view returns(uint)',
  'function makeCommitment (bytes32 label, address nameOwner, bytes32 secret) public pure returns (bytes32)',
  'function commit(bytes32 commitment) external',
  'function canReveal(bytes32 commitment) public view returns (bool)'
];

const erc677Abi = [
  'function transferAndCall(address to, uint256 value, bytes memory data) external returns (bool)'
];

// Reference: https://github.com/rsksmart/rns-sdk
export class RSKRegistrar {
  rskOwner;
  fifsAddrRegistrar;
  rifToken;
  signer;

  constructor(
    rskOwnerAddress,
    fifsAddrRegistrarAddress,
    rifTokenAddress,
    signer
  ) {
    this.rskOwner = new Contract(rskOwnerAddress, rskOwnerAbi).connect(signer);
    this.fifsAddrRegistrar = new Contract(
      fifsAddrRegistrarAddress,
      fifsAddrRegistrarAbi
    ).connect(signer);
    this.rifToken = new Contract(rifTokenAddress, erc677Abi).connect(signer);
    this.signer = signer;
  }

  available(label) {
    label = validateAndNormalizeLabel(label);
    return this.rskOwner.available(hashLabel(label));
  }

  ownerOf(label) {
    label = validateAndNormalizeLabel(label);

    return this.rskOwner.ownerOf(hashLabel(label));
  }

  price(label, duration) {
    label = validateAndNormalizeLabel(label);

    return this.fifsAddrRegistrar.price(label, constants.Zero, duration);
  }

  async commitToRegister(label, owner) {
    label = validateAndNormalizeLabel(label);

    const secret = generateSecret();
    const hash = await this.fifsAddrRegistrar.makeCommitment(
      hashLabel(label),
      owner,
      secret
    );
    const makeCommitmentTransaction = await this.fifsAddrRegistrar.commit(hash);

    return {
      secret,
      makeCommitmentTransaction,
      canReveal: () => this.fifsAddrRegistrar.canReveal(hash),
      hash
    };
  }

  async canReveal(hash) {
    return () => this.fifsAddrRegistrar.canReveal(hash);
  }

  async register(label, owner, secret, duration, amount, addr) {
    label = validateAndNormalizeLabel(label);

    /* Encoding:
        | signature  |  4 bytes      - offset  0
        | owner      | 20 bytes      - offset  4
        | secret     | 32 bytes      - offest 24
        | duration   | 32 bytes      - offset 56
        | addr       | 20 bytes      - offset 88
        | name       | variable size - offset 108
      */

    const _signature = '0x5f7b99d5';
    const _owner = owner.slice(2).toLowerCase();
    const _secret = secret.slice(2);
    const _duration = utils.hexZeroPad(duration.toHexString(), 32).slice(2);
    const _addr = addr ? addr.slice(2).toLowerCase() : _owner;
    const _name = Buffer.from(utils.toUtf8Bytes(label)).toString('hex');

    const data = `${_signature}${_owner}${_secret}${_duration}${_addr}${_name}`;

    return this.rifToken.transferAndCall(
      this.fifsAddrRegistrar.address,
      amount,
      data
    );
  }
}
