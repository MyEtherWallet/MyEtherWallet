export const BackersManagerAbi = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'allocate',
    inputs: [
      {
        name: 'gauge_',
        type: 'address',
        internalType: 'contract GaugeRootstockCollective'
      },
      {
        name: 'allocation_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'allocateBatch',
    inputs: [
      {
        name: 'gauges_',
        type: 'address[]',
        internalType: 'contract GaugeRootstockCollective[]'
      },
      {
        name: 'allocations_',
        type: 'uint256[]',
        internalType: 'uint256[]'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'backerTotalAllocation',
    inputs: [
      {
        name: 'backer',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: 'allocation',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'builderRegistry',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract BuilderRegistryRootstockCollective'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'canWithdraw',
    inputs: [
      {
        name: 'targetAddress_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'claimBackerRewards',
    inputs: [
      {
        name: 'gauges_',
        type: 'address[]',
        internalType: 'contract GaugeRootstockCollective[]'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'claimBackerRewards',
    inputs: [
      {
        name: 'rewardToken_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'gauges_',
        type: 'address[]',
        internalType: 'contract GaugeRootstockCollective[]'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'cycleData',
    inputs: [],
    outputs: [
      {
        name: 'previousDuration',
        type: 'uint32',
        internalType: 'uint32'
      },
      {
        name: 'nextDuration',
        type: 'uint32',
        internalType: 'uint32'
      },
      {
        name: 'previousStart',
        type: 'uint64',
        internalType: 'uint64'
      },
      {
        name: 'nextStart',
        type: 'uint64',
        internalType: 'uint64'
      },
      {
        name: 'offset',
        type: 'uint24',
        internalType: 'uint24'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'cycleNext',
    inputs: [
      {
        name: 'timestamp_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'cycleStart',
    inputs: [
      {
        name: 'timestamp_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'distribute',
    inputs: [],
    outputs: [
      {
        name: 'finished_',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'distributionDuration',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint32',
        internalType: 'uint32'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'endDistributionWindow',
    inputs: [
      {
        name: 'timestamp_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getCycleStartAndDuration',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'governanceManager',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IGovernanceManagerRootstockCollective'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'haltGaugeShares',
    inputs: [
      {
        name: 'gauge_',
        type: 'address',
        internalType: 'contract GaugeRootstockCollective'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'indexLastGaugeDistributed',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: 'governanceManager_',
        type: 'address',
        internalType: 'contract IGovernanceManagerRootstockCollective'
      },
      {
        name: 'builderRegistry_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'rewardToken_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'stakingToken_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'cycleDuration_',
        type: 'uint32',
        internalType: 'uint32'
      },
      {
        name: 'cycleStartOffset_',
        type: 'uint24',
        internalType: 'uint24'
      },
      {
        name: 'distributionDuration_',
        type: 'uint32',
        internalType: 'uint32'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'notifyRewardAmount',
    inputs: [
      {
        name: 'amount_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'onDistributionPeriod',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'optInRewards',
    inputs: [
      {
        name: 'backer_',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'optOutRewards',
    inputs: [
      {
        name: 'backer_',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'periodFinish',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'resumeGaugeShares',
    inputs: [
      {
        name: 'gauge_',
        type: 'address',
        internalType: 'contract GaugeRootstockCollective'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'rewardToken',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'rewardTokenApprove',
    inputs: [
      {
        name: 'gauge_',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'value_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'rewardsCoinbase',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'rewardsERC20',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'rewardsOptedOut',
    inputs: [
      {
        name: 'backer',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: 'hasOptedOut',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'setCycleDuration',
    inputs: [
      {
        name: 'newCycleDuration_',
        type: 'uint32',
        internalType: 'uint32'
      },
      {
        name: 'cycleStartOffset_',
        type: 'uint24',
        internalType: 'uint24'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setDistributionDuration',
    inputs: [
      {
        name: 'newDistributionDuration_',
        type: 'uint32',
        internalType: 'uint32'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'stakingToken',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'startDistribution',
    inputs: [],
    outputs: [
      {
        name: 'finished_',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [
      {
        name: 'interfaceId_',
        type: 'bytes4',
        internalType: 'bytes4'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'tempTotalPotentialReward',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'timeUntilNextCycle',
    inputs: [
      {
        name: 'timestamp_',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalPotentialReward',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'upgradeToAndCall',
    inputs: [
      {
        name: 'newImplementation',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes'
      }
    ],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'event',
    name: 'BackerRewardsOptedIn',
    inputs: [
      {
        name: 'backer_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'BackerRewardsOptedOut',
    inputs: [
      {
        name: 'backer_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'NewAllocation',
    inputs: [
      {
        name: 'backer_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'gauge_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'allocation_',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'NewCycleDurationScheduled',
    inputs: [
      {
        name: 'newCycleDuration_',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'cooldownEndTime_',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'NewDistributionDuration',
    inputs: [
      {
        name: 'newDistributionDuration_',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'by_',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'NotifyReward',
    inputs: [
      {
        name: 'rewardToken_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'sender_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'amount_',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RewardDistributed',
    inputs: [
      {
        name: 'sender_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RewardDistributionFinished',
    inputs: [
      {
        name: 'sender_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RewardDistributionStarted',
    inputs: [
      {
        name: 'sender_',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'AlreadyOptedInRewards',
    inputs: []
  },
  {
    type: 'error',
    name: 'BackerHasAllocations',
    inputs: []
  },
  {
    type: 'error',
    name: 'BackerOptedOutRewards',
    inputs: []
  },
  {
    type: 'error',
    name: 'BeforeDistribution',
    inputs: []
  },
  {
    type: 'error',
    name: 'CycleDurationTooShort',
    inputs: []
  },
  {
    type: 'error',
    name: 'DistributionDurationTooLong',
    inputs: []
  },
  {
    type: 'error',
    name: 'DistributionDurationTooShort',
    inputs: []
  },
  {
    type: 'error',
    name: 'DistributionModifiedDuringDistributionWindow',
    inputs: []
  },
  {
    type: 'error',
    name: 'DistributionPeriodDidNotStart',
    inputs: []
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'ERC1967NonPayable',
    inputs: []
  },
  {
    type: 'error',
    name: 'FailedInnerCall',
    inputs: []
  },
  {
    type: 'error',
    name: 'GaugeDoesNotExist',
    inputs: []
  },
  {
    type: 'error',
    name: 'InvalidInitialization',
    inputs: []
  },
  {
    type: 'error',
    name: 'NoGaugesForDistribution',
    inputs: []
  },
  {
    type: 'error',
    name: 'NotAuthorized',
    inputs: []
  },
  {
    type: 'error',
    name: 'NotEnoughStaking',
    inputs: []
  },
  {
    type: 'error',
    name: 'NotInDistributionPeriod',
    inputs: []
  },
  {
    type: 'error',
    name: 'NotInitializing',
    inputs: []
  },
  {
    type: 'error',
    name: 'NotValidChangerOrFoundation',
    inputs: []
  },
  {
    type: 'error',
    name: 'OnlyInDistributionWindow',
    inputs: []
  },
  {
    type: 'error',
    name: 'PositiveAllocationOnHaltedGauge',
    inputs: []
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'UUPSUnauthorizedCallContext',
    inputs: []
  },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [
      {
        name: 'slot',
        type: 'bytes32',
        internalType: 'bytes32'
      }
    ]
  },
  {
    type: 'error',
    name: 'UnequalLengths',
    inputs: []
  }
];
