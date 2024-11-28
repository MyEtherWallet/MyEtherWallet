export const govABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address'
      }
    ],
    name: 'AddressEmptyCode',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CheckpointUnorderedInsertion',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'ERC1967InvalidImplementation',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1967NonPayable',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'voter',
        type: 'address'
      }
    ],
    name: 'GovernorAlreadyCastVote',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'GovernorAlreadyQueuedProposal',
    type: 'error'
  },
  {
    inputs: [],
    name: 'GovernorDisabledDeposit',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'proposer',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'votes',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'threshold',
        type: 'uint256'
      }
    ],
    name: 'GovernorInsufficientProposerVotes',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'targets',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'calldatas',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'values',
        type: 'uint256'
      }
    ],
    name: 'GovernorInvalidProposalLength',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'quorumNumerator',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'quorumDenominator',
        type: 'uint256'
      }
    ],
    name: 'GovernorInvalidQuorumFraction',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'voter',
        type: 'address'
      }
    ],
    name: 'GovernorInvalidSignature',
    type: 'error'
  },
  {
    inputs: [],
    name: 'GovernorInvalidVoteType',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'votingPeriod',
        type: 'uint256'
      }
    ],
    name: 'GovernorInvalidVotingPeriod',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'GovernorNonexistentProposal',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'GovernorNotQueuedProposal',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'GovernorOnlyExecutor',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'GovernorOnlyProposer',
    type: 'error'
  },
  {
    inputs: [],
    name: 'GovernorQueueNotImplemented',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'proposer',
        type: 'address'
      }
    ],
    name: 'GovernorRestrictedProposer',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'enum IGovernor.ProposalState',
        name: 'current',
        type: 'uint8'
      },
      {
        internalType: 'bytes32',
        name: 'expectedStates',
        type: 'bytes32'
      }
    ],
    name: 'GovernorUnexpectedProposalState',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'currentNonce',
        type: 'uint256'
      }
    ],
    name: 'InvalidAccountNonce',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'OwnableInvalidOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error'
  },
  {
    inputs: [],
    name: 'QueueEmpty',
    type: 'error'
  },
  {
    inputs: [],
    name: 'QueueFull',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'bits',
        type: 'uint8'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'SafeCastOverflowedUintDowncast',
    type: 'error'
  },
  {
    inputs: [],
    name: 'UUPSUnauthorizedCallContext',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'slot',
        type: 'bytes32'
      }
    ],
    name: 'UUPSUnsupportedProxiableUUID',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'EIP712DomainChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'ProposalCanceled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'proposer',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'signatures',
        type: 'string[]'
      },
      {
        indexed: false,
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'voteStart',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'voteEnd',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string'
      }
    ],
    name: 'ProposalCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'ProposalExecuted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'etaSeconds',
        type: 'uint256'
      }
    ],
    name: 'ProposalQueued',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldProposalThreshold',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newProposalThreshold',
        type: 'uint256'
      }
    ],
    name: 'ProposalThresholdSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldQuorumNumerator',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newQuorumNumerator',
        type: 'uint256'
      }
    ],
    name: 'QuorumNumeratorUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oldTimelock',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newTimelock',
        type: 'address'
      }
    ],
    name: 'TimelockChange',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'support',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'reason',
        type: 'string'
      }
    ],
    name: 'VoteCast',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'support',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'reason',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'params',
        type: 'bytes'
      }
    ],
    name: 'VoteCastWithParams',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldVotingDelay',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newVotingDelay',
        type: 'uint256'
      }
    ],
    name: 'VotingDelaySet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldVotingPeriod',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newVotingPeriod',
        type: 'uint256'
      }
    ],
    name: 'VotingPeriodSet',
    type: 'event'
  },
  {
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'actualVersion',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]'
      },
      {
        internalType: 'bytes32',
        name: 'descriptionHash',
        type: 'bytes32'
      }
    ],
    name: 'cancel',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8'
      }
    ],
    name: 'castVote',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: 'voter',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes'
      }
    ],
    name: 'castVoteBySig',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8'
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string'
      }
    ],
    name: 'castVoteWithReason',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8'
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string'
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes'
      }
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'uint8',
        name: 'support',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: 'voter',
        type: 'address'
      },
      {
        internalType: 'string',
        name: 'reason',
        type: 'string'
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes'
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes'
      }
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'clock',
    outputs: [
      {
        internalType: 'uint48',
        name: '',
        type: 'uint48'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      {
        internalType: 'bytes1',
        name: 'fields',
        type: 'bytes1'
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'version',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'verifyingContract',
        type: 'address'
      },
      {
        internalType: 'bytes32',
        name: 'salt',
        type: 'bytes32'
      },
      {
        internalType: 'uint256[]',
        name: 'extensions',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]'
      },
      {
        internalType: 'bytes32',
        name: 'descriptionHash',
        type: 'bytes32'
      }
    ],
    name: 'execute',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'getStateAndVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'againstVotes',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'forVotes',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'abstainVotes',
        type: 'uint256'
      },
      {
        internalType: 'enum IGovernor.ProposalState',
        name: 'proposalState',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'timepoint',
        type: 'uint256'
      }
    ],
    name: 'getVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'timepoint',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes'
      }
    ],
    name: 'getVotesWithParams',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'guardian',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'hasVoted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]'
      },
      {
        internalType: 'bytes32',
        name: 'descriptionHash',
        type: 'bytes32'
      }
    ],
    name: 'hashProposal',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IVotes',
        name: 'voteToken',
        type: 'address'
      },
      {
        internalType: 'contract TimelockControllerUpgradeable',
        name: 'timelockController',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'initialOwner',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    name: 'onERC1155BatchReceived',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proposalCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'proposalDeadline',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'proposalDetails',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes[]',
        name: '',
        type: 'bytes[]'
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'proposalDetailsAt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes[]',
        name: '',
        type: 'bytes[]'
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'proposalEta',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'proposalNeedsQueuing',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'proposalProposer',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'proposalSnapshot',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proposalThreshold',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'proposalVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: 'againstVotes',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'forVotes',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'abstainVotes',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]'
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string'
      }
    ],
    name: 'propose',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'targets',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes[]',
        name: 'calldatas',
        type: 'bytes[]'
      },
      {
        internalType: 'bytes32',
        name: 'descriptionHash',
        type: 'bytes32'
      }
    ],
    name: 'queue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'queue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256'
      }
    ],
    name: 'quorum',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'quorumDenominator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'timepoint',
        type: 'uint256'
      }
    ],
    name: 'quorumNumerator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'quorumNumerator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_guardian',
        type: 'address'
      }
    ],
    name: 'setGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newProposalThreshold',
        type: 'uint256'
      }
    ],
    name: 'setProposalThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint48',
        name: 'newVotingDelay',
        type: 'uint48'
      }
    ],
    name: 'setVotingDelay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'newVotingPeriod',
        type: 'uint32'
      }
    ],
    name: 'setVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'state',
    outputs: [
      {
        internalType: 'enum IGovernor.ProposalState',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'timelock',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract IERC5805',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newQuorumNumerator',
        type: 'uint256'
      }
    ],
    name: 'updateQuorumNumerator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract TimelockControllerUpgradeable',
        name: 'newTimelock',
        type: 'address'
      }
    ],
    name: 'updateTimelock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'votingDelay',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'votingPeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
];
