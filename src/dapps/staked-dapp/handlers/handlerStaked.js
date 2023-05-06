import axios from 'axios';
import BigNumber from 'bignumber.js';
import { toBN } from 'web3-utils';

import configNetworkTypes from './configNetworkTypes';
import calculateEth2Rewards from './helpers';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import handleError from '@/modules/confirmation/handlers/errorHandler';

/**
 * ABI to get fees
 * from batch contract
 */
const ABI_GET_VALIDATORS = [
  {
    inputs: [],
    name: 'get_deposit_count',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];
const ABI_GET_FEES = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'numValidators',
        type: 'uint256'
      }
    ],
    name: 'getFees',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

/**
 * Validator status types
 */
const STATUS_TYPES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  CREATED: 'created',
  DEPOSITED: 'deposited',
  FAILED: 'failed',
  EXITED: 'exited',
  EXITING: 'exiting'
};

export { ABI_GET_FEES, STATUS_TYPES };
export default class Staked {
  constructor(web3, network, address) {
    /**
     * set up the variables
     */
    this.web3 = web3;
    this.network = network;
    this.address = address;
    this.totalStaked = '';
    this.apr = '';
    this.validatorsCount = '';
    this.pollingStatus = {};
    this.transactionData = {};
    this.myValidators = [];
    this.loadingValidators = false;
    this.myETHTotalStaked = 0;
    this.pendingTxHash = '';
    this.txReceipt = false;
    this.endpoint = configNetworkTypes.network[this.network.type.name].endpoint;
    /**
     * get the initial data (total staked, apr, validators)
     */
    this.getTotalStakedAndAPR();
    this.getValidators();
  }
  /**
   * Get the total staked and current APR
   */
  getTotalStakedAndAPR() {
    this.eth2ContractAddress =
      configNetworkTypes.network[this.network.type.name].depositAddress;
    const depositContract = new this.web3.eth.Contract(
      ABI_GET_VALIDATORS,
      this.eth2ContractAddress
    );
    depositContract.methods
      .get_deposit_count()
      .call()
      .then(lebytes => {
        const numValidators = toBN(
          '0x' + Buffer.from(lebytes.substr(2), 'hex').reverse().toString('hex')
        );
        this.totalStaked = numValidators.muln(32).toString();
        this.apr = new BigNumber(
          calculateEth2Rewards({ totalAtStake: this.totalStaked })
        )
          .times(100)
          .toFixed();
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  /**
   * Get validators that can be exited by current address
   * have to be fetched separately due to validators
   * that was assigned to a different address
   */
  getExitableValidators(data) {
    this.loadingValidators = true;
    return axios
      .get(`${this.endpoint}/history?withdrawalCredentials=${this.address}`, {
        header: { 'Content-Type': 'application/json' }
      })
      .then(res => {
        let filteredExitable = [];
        // validators and withdrawal credentials found
        if (data.length > 0) {
          /**
           * remove current validators that are
           * returned in the withdrawalCredentials call
           *
           * set can_exit to false
           */
          const filteredArray = data.reduce((arr, item) => {
            /**
             * updates current item's raw
             * removing validators found in withdrawalCredentials call
             */
            const newRaw = item.raw.filter(rawItem => {
              let found;
              // loop through response
              res.data.forEach(wItem => {
                /**
                 * check if current rawItem
                 * matches any of the withdrawal raw items
                 * set found to true and exit;
                 */
                wItem.raw.forEach(wRawItem => {
                  if (wRawItem.decoded.pubkey === rawItem.decoded.pubkey) {
                    found = true;
                    return; // exit forEach 2
                  }

                  if (found) return; // exit forEach 1
                });
              });

              if (!found) {
                rawItem['can_exit'] = false;
              }
              return !found;
            });
            item.raw = newRaw;
            arr.push(item);
            return arr;
          }, []);

          /**
           * set 'can_exit' key with value based on if
           * withdrawal_credentials_are_eth1Address is true
           * for all exitable validators
           */
          const exitableValidators = res.data.map(validator => {
            const newRaw = validator.raw.map(item => {
              item['can_exit'] = item.withdrawal_credentials_are_eth1Address;
              return item;
            });
            validator.raw = newRaw;

            return Object.assign({}, validator);
          });

          filteredExitable = filteredArray.concat(exitableValidators);
        } else {
          // no validators found but has withdrawal credentials
          filteredExitable = res.data.map(validator => {
            const newRaw = validator.raw.map(item => {
              item['can_exit'] = item.withdrawal_credentials_are_eth1Address;
              return item;
            });
            validator.raw = newRaw;

            return Object.assign({}, validator);
          });
        }
        this.myValidators = filteredExitable;
        this.loadingValidators = false;
      })
      .catch(() => {
        // no withdrawal credentials found
        this.myValidators = data.map(item => {
          const newRaw = item.raw.map(item => {
            item['can_exit'] = false;
            return item;
          });
          item.raw = newRaw;

          return Object.assign({}, item);
        });
        this.loadingValidators = false;
      });
  }
  /**
   * Get clients validators
   * and get clients total staked
   */
  getValidators() {
    this.loadingValidators = true;
    return axios
      .get(`${this.endpoint}/history?address=${this.address}`, {
        header: {
          'Content-Type': 'application/json'
        }
      })
      .then(resp => {
        this.myETHTotalStaked = resp.data.reduce((total, val) => {
          const raw = val.raw[0];
          const balanceETH =
            raw.status.toLowerCase() === STATUS_TYPES.ACTIVE && raw.balance
              ? this.convertToEth1(raw.balance).toFixed()
              : 0;
          return new BigNumber(total).plus(balanceETH);
        }, 0);
        // check withdrawals
        this.getExitableValidators(resp.data);
      })
      .catch(err => {
        if (
          err.response &&
          err.response.status === 404 &&
          err.response.data.msg === 'No matching history found'
        ) {
          // try to see if withdrawals are set
          this.getExitableValidators([
            {
              info: {
                amount: '0x6f05b59d3b2000000',
                fees: '0x058acfcdd9800000'
              },
              transaction: {
                to: '0xF243A92eB7D4B4F6A00A57888B887bd01ec6fd12',
                data: '0xca0bfcce000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000044000000000000000000000000000000000000000000000000000000000000006e00000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000030943df4372c1497be19e5c8ebd44a03682508b5a62b7a6d416a42413d146d221d6fd672400caab6f7b0c61212b94bee71000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030a70fd7a5853bc853389648bf952e03805ccf5c64ee9d8c4fbe052910ad82ee829269d47f5b8cef22df3e3989821ce20b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030a24b0df7d98afb5c5b1444bcd509dfa2e46f5733242b6b2bbf56418b664ca557127efcf78fad67dd6912d463ea711b58000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030914b429c8755f1bf926dd7ed4509bd8829feb225268e2fd1b60b685be432e346ce0aac68870c50cc3eda9ffde6f99b10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002000f42e279233ecef48fcc226b9f86c14a9e79162c207e0913ad4de3c09b1589d000000000000000000000000000000000000000000000000000000000000002000f42e279233ecef48fcc226b9f86c14a9e79162c207e0913ad4de3c09b1589d000000000000000000000000000000000000000000000000000000000000002000f42e279233ecef48fcc226b9f86c14a9e79162c207e0913ad4de3c09b1589d000000000000000000000000000000000000000000000000000000000000002000f42e279233ecef48fcc226b9f86c14a9e79162c207e0913ad4de3c09b1589d000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000060ae12fdb68e55330c51ca49e532eec39c3e9453e86db85511e43cb76303f3d8e2eb0780a5ca7a6c58c4930df94697990d190fafb82b463381aa6bd2940b040915c6ccf78b0d2399d2ca417ba822f39f08a37eb1cd7ec3dc8abccd3e39e5efdd4700000000000000000000000000000000000000000000000000000000000000608ec746bea8f6179eaabbb080273a19e7bfcde164ce7e9581de19b5eccd334df09def456d6c94f3073c2e49a447c3c01a0dca2d1b082adb5e220c2b94b693270725074a7376e9512bacc1350baf5f62a09c45c23c0d83df844064a90977909b130000000000000000000000000000000000000000000000000000000000000060ac9af1b9a27bc087da5d2fad99bbe5ce40523b5633738e088ed193785cef0a46798acde523a5b79b05cd8799331bd6450211f1926ed8bcf445c123da9e0a860492abc784875e8f45d471c8ce130dabacf6ea6cac4ed2c0a370aff64670c598fc00000000000000000000000000000000000000000000000000000000000000608a07efe44afae534f1a0a73efd58f899d133b73cc175e5bf8c407b43795369ec14cd69a0780e60e9aa4eb48d6e595a2002a3636695d52a2c4f6bdb5e161dbf7eebfea9bdc4e7f25e65f34f9c84d21324f648675908d507da8ac8b763a7d54e6d00000000000000000000000000000000000000000000000000000000000000048e5b5d33510c8f048b60b7dca349d2dd5211a8db494a66d58430bb9c22da6e771884078b731de39dc3906e326d0130f7061b0a14e0cacb714f640da8ee5eb1327e93a5e9d6114af6d3ecd36b7be62cadbfc66238c67ecad30401f7e94a0f2abed0cf96fe9ad232add23acb8094a2f8032ad26fd6d6aa3b3953ca39f6f346c17c',
                value: '0x6f5e629a18b800000',
                gas: '0x3ebe2'
              },
              raw: [
                {
                  id: 20017,
                  address:
                    'a70fd7a5853bc853389648bf952e03805ccf5c64ee9d8c4fbe052910ad82ee829269d47f5b8cef22df3e3989821ce20b',
                  chain: 'ETH2',
                  amount: '32',
                  created: '2021-02-03T19:35:52',
                  status: 'ACTIVE',
                  provisioning_request_uuid:
                    '9d5183e7-8cc7-4e09-89d5-b3a24a21a646',
                  validator_index: 91605,
                  deposit_input:
                    '22895118000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001201884078b731de39dc3906e326d0130f7061b0a14e0cacb714f640da8ee5eb1320000000000000000000000000000000000000000000000000000000000000030a70fd7a5853bc853389648bf952e03805ccf5c64ee9d8c4fbe052910ad82ee829269d47f5b8cef22df3e3989821ce20b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000f42e279233ecef48fcc226b9f86c14a9e79162c207e0913ad4de3c09b1589d00000000000000000000000000000000000000000000000000000000000000608ec746bea8f6179eaabbb080273a19e7bfcde164ce7e9581de19b5eccd334df09def456d6c94f3073c2e49a447c3c01a0dca2d1b082adb5e220c2b94b693270725074a7376e9512bacc1350baf5f62a09c45c23c0d83df844064a90977909b13',
                  validator_key:
                    'a70fd7a5853bc853389648bf952e03805ccf5c64ee9d8c4fbe052910ad82ee829269d47f5b8cef22df3e3989821ce20b',
                  decoded: {
                    pubkey:
                      'a70fd7a5853bc853389648bf952e03805ccf5c64ee9d8c4fbe052910ad82ee829269d47f5b8cef22df3e3989821ce20b',
                    withdrawal_credentials:
                      '00f42e279233ecef48fcc226b9f86c14a9e79162c207e0913ad4de3c09b1589d',
                    signature:
                      '8ec746bea8f6179eaabbb080273a19e7bfcde164ce7e9581de19b5eccd334df09def456d6c94f3073c2e49a447c3c01a0dca2d1b082adb5e220c2b94b693270725074a7376e9512bacc1350baf5f62a09c45c23c0d83df844064a90977909b13',
                    deposit_data_root:
                      '1884078b731de39dc3906e326d0130f7061b0a14e0cacb714f640da8ee5eb132'
                  },
                  withdrawal_credentials:
                    '0100000000000000000000006b6b9eb1402a47a0e51b28c0aa345159cd3a46f5',
                  withdrawal_credentials_are_eth1Address: true,
                  detailed_balance_info: {
                    address:
                      'a70fd7a5853bc853389648bf952e03805ccf5c64ee9d8c4fbe052910ad82ee829269d47f5b8cef22df3e3989821ce20b',
                    balance: '32394632093630355334',
                    total_reward_and_fees: '394632093630355334',
                    reward_and_fees: '394632093630355334',
                    total_reward: '3698973042000000000',
                    reward: '3698973042000000000',
                    total_fees: '388310664630355334',
                    fees: '388310664630355334',
                    total_gross_return:
                      '0.01233225292594868939544117125706179649569094181060791015625',
                    gross_return:
                      '0.01233225292594868939544117125706179649569094181060791015625',
                    annualized_gross_return:
                      '0.0054814436657046050616060028914944268763065338134765625',
                    conversion_factor_power: 18
                  },
                  balance: '32394632093',
                  positionInActivationQueue: '0',
                  can_exit: true
                }
              ]
            }
          ]);
          return;
        }
        this.loadingValidators = false;
        this.myValidators = [];
        Toast(err, {}, ERROR);
      });
  }
  /**
   * Start provisioning and get the
   * provisoning request uuid to start polling
   */
  async startProvision(params) {
    this.validatorsCount = params.count;
    await axios
      .post(
        this.endpoint + '/v2/provision',
        {
          address: this.address,
          eth1Address: params.eth2Address,
          validatorsCount: params.count
        },
        {
          header: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(response => {
        return response && response.data.provisioning_request_uuid
          ? this.startPolling(response.data.provisioning_request_uuid)
          : Toast(this.$t('dappsStaked.error-try-again'), {}, ERROR);
      })
      .catch(err => {
        this.pollingStatus = { success: false, error: err };
      });
  }
  /**
   * Start polling every 5000 ms
   * sets pollingStatus for UI
   */
  startPolling(uuid) {
    let prevReqComplete = true;
    const interval = setInterval(() => {
      if (!prevReqComplete) return;
      prevReqComplete = false;
      return axios
        .get(`${this.endpoint}/status?provisioning_request_uuid=${uuid}`, {
          header: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          prevReqComplete = true;
          if (
            response &&
            response.data &&
            response.data.raw.length === parseInt(this.validatorsCount)
          ) {
            this.pollingStatus = { success: true };
            this.transactionData = response.data.transaction;
            clearInterval(interval);
          }
        })
        .catch(err => {
          prevReqComplete = true;
          if (
            (err.response &&
              err.response.status === 424 &&
              err.response.data.msg ===
                'Not all validators have been provisioned') ||
            (err.response &&
              err.response.status === 404 &&
              err.response.data.msg ===
                'Requested provisioning_request_uuid not found')
          ) {
            return;
          }
          this.pollingStatus = { success: false, error: err.response };
        });
    }, 5000);
  }
  /**
   * Send tx to confirm staking
   */
  sendTransaction() {
    this.transactionData.from = this.address;
    this.transactionData.to =
      configNetworkTypes.network[this.network.type.name].batchContract;
    this.web3.eth
      .sendTransaction(this.transactionData)
      .on('transactionHash', res => {
        this.pendingTxHash = res;
      })
      .on('receipt', () => {
        this.txReceipt = true;
      })
      .catch(err => {
        const error = handleError(err);
        if (error) Toast(err, {}, ERROR);
      });
  }
  /**
   * @returns BigNumber
   * Converts the unit to ETH1 from ETH2
   */
  convertToEth1(balance) {
    return new BigNumber(balance).div(new BigNumber(10).pow(9));
  }
}
