import axios from 'axios';
import BigNumber from 'bignumber.js';

import configNetworkTypes from './configNetworkTypes';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import handleError from '@/modules/confirmation/handlers/errorHandler';

/**
 * ABI to get fees
 * from batch contract
 */
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
    fetch(`${this.endpoint}/info`)
      .then(res => res.json())
      .then(res => {
        this.apr = BigNumber(res.apr).times(100).toString();
        this.totalStaked = res.total_staked;
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
          this.getExitableValidators([]);
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
