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
  EXITED: 'exited'
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
          const filteredArray = data.filter(currValidator => {
            const foundInWithdrawal = res.data.find(
              exitValidator =>
                exitValidator.raw[0].decoded.pubkey ===
                currValidator.raw[0].decoded.pubkey
            );

            if (!foundInWithdrawal) return true;
          });

          /**
           * combines validators (filtered for duplicates) and
           * the response from withdrawalCredentials
           *
           * adds 'can_exi't key with value based on if
           * withdrawal_credentials_are_eth1Address is true
           */
          filteredExitable = filteredArray.concat(res.data).map(validator => {
            validator.raw[0]['can_exit'] =
              validator.raw[0].withdrawal_credentials_are_eth1Address;

            return Object.assign({}, validator);
          });
        } else {
          // no validators found but has withdrawal credentials
          filteredExitable = res.data.map(item => {
            item.raw[0]['can_exit'] =
              item.raw[0].withdrawal_credentials_are_eth1Address;
            return Object.assign({}, item);
          });
        }
        this.myValidators = filteredExitable;
        this.loadingValidators = false;
      })
      .catch(() => {
        // no withdrawal credentials found
        this.myValidators = data.map(item => {
          item.raw[0]['can_exit'] = false;
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
