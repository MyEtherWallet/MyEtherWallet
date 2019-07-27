export default [
  {
    constant: true,
    inputs: [{ name: '_interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_active', type: 'bool' }
    ],
    name: 'updateActive',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'priceInWeiToken',
    outputs: [{ name: '_priceInWei', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_tokenId', type: 'uint256' },
      { name: '_uri', type: 'string' }
    ],
    name: 'setTokenURI',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_koCommissionAccount', type: 'address' }],
    name: 'updateKoCommissionAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'InterfaceId_ERC165',
    outputs: [{ name: '', type: 'bytes4' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'editionData',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newBaseURI', type: 'string' }],
    name: 'updateTokenBaseURI',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_operator', type: 'address' },
      { name: '_role', type: 'uint8' }
    ],
    name: 'checkRole',
    outputs: [],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalPurchaseValueInWei',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_index', type: 'uint256' }
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_startDate', type: 'uint256' }
    ],
    name: 'updateStartDate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'artistCommission',
    outputs: [
      { name: '_artistAccount', type: 'address' },
      { name: '_artistCommission', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'tokenURIEdition',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_editionNumber', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalNumberAvailable',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_operator', type: 'address' },
      { name: '_role', type: 'uint8' }
    ],
    name: 'addAddressToAccessControl',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'priceInWeiEdition',
    outputs: [{ name: '_priceInWei', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenBaseURI',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'exists',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_rate', type: 'uint256' }
    ],
    name: 'updateArtistCommission',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'editionType',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'tokensOf',
    outputs: [{ name: '_tokenIds', type: 'uint256[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'purchaseDatesEdition',
    outputs: [
      { name: '_startDate', type: 'uint256' },
      { name: '_endDate', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_artistsAccount', type: 'address' }],
    name: 'artistsEditions',
    outputs: [{ name: '_editionNumbers', type: 'uint256[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'totalAvailableEdition',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'koCommissionAccount',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'editionNumber', type: 'uint256' }],
    name: 'detailsOfEdition',
    outputs: [
      { name: '_editionData', type: 'bytes32' },
      {
        name: '_editionType',
        type: 'uint256'
      },
      { name: '_startDate', type: 'uint256' },
      { name: '_endDate', type: 'uint256' },
      {
        name: '_artistAccount',
        type: 'address'
      },
      { name: '_artistCommission', type: 'uint256' },
      {
        name: '_priceInWei',
        type: 'uint256'
      },
      { name: '_tokenURI', type: 'string' },
      {
        name: '_totalSupply',
        type: 'uint256'
      },
      { name: '_totalAvailable', type: 'uint256' },
      { name: '_active', type: 'bool' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_uri', type: 'string' }
    ],
    name: 'updateEditionTokenURI',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'tokensOfEdition',
    outputs: [{ name: '_tokenIds', type: 'uint256[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_editionNumber', type: 'uint256' }
    ],
    name: 'underMint',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_priceInWei', type: 'uint256' }
    ],
    name: 'updatePriceInWei',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'editionOfTokenId',
    outputs: [{ name: '_editionNumber', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'pause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_editionNumber', type: 'uint256' }
    ],
    name: 'purchaseTo',
    outputs: [{ name: '', type: 'uint256' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      {
        name: '_editionData',
        type: 'bytes32'
      },
      { name: '_editionType', type: 'uint256' },
      { name: '_startDate', type: 'uint256' },
      {
        name: '_endDate',
        type: 'uint256'
      },
      { name: '_artistAccount', type: 'address' },
      {
        name: '_artistCommission',
        type: 'uint256'
      },
      { name: '_priceInWei', type: 'uint256' },
      {
        name: '_tokenURI',
        type: 'string'
      },
      { name: '_totalAvailable', type: 'uint256' }
    ],
    name: 'createActiveEdition',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ROLE_MINTER',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_operator', type: 'address' },
      { name: '_role', type: 'uint8' }
    ],
    name: 'hasRole',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_operator', type: 'address' },
      { name: '_role', type: 'uint8' }
    ],
    name: 'removeAddressFromAccessControl',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      {
        name: '_rate',
        type: 'uint256'
      },
      { name: '_recipient', type: 'address' }
    ],
    name: 'updateOptionalCommission',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ROLE_UNDER_MINTER',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      {
        name: '_editionData',
        type: 'bytes32'
      },
      { name: '_editionType', type: 'uint256' },
      { name: '_startDate', type: 'uint256' },
      {
        name: '_endDate',
        type: 'uint256'
      },
      { name: '_artistAccount', type: 'address' },
      {
        name: '_artistCommission',
        type: 'uint256'
      },
      { name: '_priceInWei', type: 'uint256' },
      { name: '_tokenURI', type: 'string' },
      {
        name: '_totalSupply',
        type: 'uint256'
      },
      { name: '_totalAvailable', type: 'uint256' }
    ],
    name: 'createInactivePreMintedEdition',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'reclaimEther',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_approved', type: 'bool' }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'highestEditionNumber',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_tokenIds', type: 'uint256[]' }
    ],
    name: 'batchTransfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      {
        name: '_editionData',
        type: 'bytes32'
      },
      { name: '_editionType', type: 'uint256' },
      { name: '_startDate', type: 'uint256' },
      {
        name: '_endDate',
        type: 'uint256'
      },
      { name: '_artistAccount', type: 'address' },
      {
        name: '_artistCommission',
        type: 'uint256'
      },
      { name: '_priceInWei', type: 'uint256' },
      { name: '_tokenURI', type: 'string' },
      {
        name: '_totalSupply',
        type: 'uint256'
      },
      { name: '_totalAvailable', type: 'uint256' }
    ],
    name: 'createActivePreMintedEdition',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_artistAccount', type: 'address' }
    ],
    name: 'updateArtistsAccount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'tokenData',
    outputs: [
      { name: '_editionNumber', type: 'uint256' },
      {
        name: '_editionType',
        type: 'uint256'
      },
      { name: '_editionData', type: 'bytes32' },
      { name: '_tokenURI', type: 'string' },
      {
        name: '_owner',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'totalSupplyEdition',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      {
        name: '_tokenId',
        type: 'uint256'
      },
      { name: '_data', type: 'bytes' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'purchaseDatesToken',
    outputs: [
      { name: '_startDate', type: 'uint256' },
      { name: '_endDate', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'editionActive',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'totalRemaining',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_totalAvailable', type: 'uint256' }
    ],
    name: 'updateTotalAvailable',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ROLE_KNOWN_ORIGIN',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'editionExists',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_editionType', type: 'uint256' }
    ],
    name: 'updateEditionType',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'editionOptionalCommission',
    outputs: [
      { name: '_rate', type: 'uint256' },
      { name: '_recipient', type: 'address' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_endDate', type: 'uint256' }
    ],
    name: 'updateEndDate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      {
        name: '_editionData',
        type: 'bytes32'
      },
      { name: '_editionType', type: 'uint256' },
      { name: '_startDate', type: 'uint256' },
      {
        name: '_endDate',
        type: 'uint256'
      },
      { name: '_artistAccount', type: 'address' },
      {
        name: '_artistCommission',
        type: 'uint256'
      },
      { name: '_priceInWei', type: 'uint256' },
      {
        name: '_tokenURI',
        type: 'string'
      },
      { name: '_totalAvailable', type: 'uint256' }
    ],
    name: 'createInactiveEdition',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_type', type: 'uint256' }],
    name: 'editionsOfType',
    outputs: [{ name: '_editionNumbers', type: 'uint256[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_operator', type: 'address' }
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_editionNumber', type: 'uint256' }],
    name: 'purchase',
    outputs: [{ name: '', type: 'uint256' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalNumberMinted',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      {
        name: '_tokenIds',
        type: 'uint256[]'
      }
    ],
    name: 'batchTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_editionNumber', type: 'uint256' },
      { name: '_totalSupply', type: 'uint256' }
    ],
    name: 'updateTotalSupply',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'tokenURISafe',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'constructor'
  },
  {
    payable: false,
    stateMutability: 'nonpayable',
    type: 'fallback'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_tokenId', type: 'uint256' },
      {
        indexed: true,
        name: '_editionNumber',
        type: 'uint256'
      },
      { indexed: true, name: '_buyer', type: 'address' },
      {
        indexed: false,
        name: '_priceInWei',
        type: 'uint256'
      }
    ],
    name: 'Purchase',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_tokenId', type: 'uint256' },
      {
        indexed: true,
        name: '_editionNumber',
        type: 'uint256'
      },
      { indexed: true, name: '_buyer', type: 'address' }
    ],
    name: 'Minted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_editionNumber', type: 'uint256' },
      {
        indexed: true,
        name: '_editionData',
        type: 'bytes32'
      },
      { indexed: true, name: '_editionType', type: 'uint256' }
    ],
    name: 'EditionCreated',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
  {
    anonymous: false,
    inputs: [],
    name: 'Unpause',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'previousOwner', type: 'address' }],
    name: 'OwnershipRenounced',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'previousOwner', type: 'address' },
      {
        indexed: true,
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
      { indexed: true, name: 'operator', type: 'address' },
      {
        indexed: false,
        name: 'role',
        type: 'uint8'
      }
    ],
    name: 'RoleAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'operator', type: 'address' },
      {
        indexed: false,
        name: 'role',
        type: 'uint8'
      }
    ],
    name: 'RoleRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      {
        indexed: true,
        name: '_to',
        type: 'address'
      },
      { indexed: true, name: '_tokenId', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_owner', type: 'address' },
      {
        indexed: true,
        name: '_approved',
        type: 'address'
      },
      { indexed: true, name: '_tokenId', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_owner', type: 'address' },
      {
        indexed: true,
        name: '_operator',
        type: 'address'
      },
      { indexed: false, name: '_approved', type: 'bool' }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  }
];
