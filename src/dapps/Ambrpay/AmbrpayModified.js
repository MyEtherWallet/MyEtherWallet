/* eslint-disable */
/*!
 * ambrpay JavaScript Library v0.2.2
 * https://ambrpay.io/
 */

export default function Ambrpay(account, web3) {
  if(!apiEndpoint) {
    var apiEndpoint = 'https://ambrpay.io/api';
  }
  
  var _web3 = web3;
  var ethAddress = account.address;
  var ambrpay = {
    apiKey: false,
    testMode: false,
    contractAddress: false,
    contractAddresses: false,
    network: "auto",
    setApiKey: function(apiKey) {

      ambrpay.apiKey = apiKey;

      if(ambrpay.apiKey.indexOf("test_public") != -1) {
        ambrpay.testMode = true;
      } else if(ambrpay.apiKey.indexOf("api_public") != -1) {
        ambrpay.testMode = false;
      } else {
        throw "invalid public api key";
      }
    },
    getContractAddresses: function() {

      return new Promise(function(resolve, reject) {

        if(ambrpay.contractAddress) {
          return resolve(ambrpay.contractAddress);
        }

        if(!_web3) {
          reject( "MetaMask is not installed. Download it at https://metamask.io/" );
        }

        if(!ambrpay.contractAddresses) {
          var url = apiEndpoint + '/smartContractAddresses';

          return ambrpay.getRequest(url, ambrpay.apiKey)
            .then(function(contractAddresses) {

              ambrpay.contractAddresses = JSON.parse(contractAddresses);

              return resolve(ambrpay.contractAddresses);
            });
        } else {
          return resolve(ambrpay.contractAddresses);
        }
      })
        .then(() => {
          var networkName;

          switch (account.netId) {
            case "1":
              // throw "mainnet is currently not available";

              if(ambrpay.network == 'mainnet' || ambrpay.network == 'auto') {

                networkName = "Mainnet";
                ambrpay.contractAddress = ambrpay.contractAddresses.mainnet.smartContractAddress;
                ambrpay.ABI = {
                  "abi": JSON.parse(ambrpay.contractAddresses.mainnet.abi)
                }
              } else {
                throw "your wallets network (mainnet) does not match the selected network for the transaction (" + ambrpay.network + ")";
              }
              break;
            case "2":
              throw "Morden testnet is not available. Try ropsten testnet.";
              networkName = "Morden Testnet";
              break;
            case "3":
              if(ambrpay.network == 'ropsten' || ambrpay.network == 'auto') {
                networkName = "Ropsten Testnet";
                ambrpay.contractAddress = ambrpay.contractAddresses.ropsten.smartContractAddress;
                ambrpay.ABI = {
                  "abi": JSON.parse(ambrpay.contractAddresses.ropsten.abi)
                }
              } else {
                throw "your wallets network (ropsten) does not match the selected network for the transaction (" + ambrpay.network + ")";
              }
              break;
            case "4":
              throw "Rinkeby testnet is not available. Try ropsten testnet.";
              networkName = "Rinkeby Testnet";
              break;
            case "42":
              throw "Kovan testnet is not available. Try ropsten testnet.";
              networkName = "Kovan Testnet";
              break;
            default:
              throw "Uknown testnet. Try ropsten testnet.";
              networkName = "Unknown";
          }

          return ambrpay.contractAddress;
        });
    },
    getMetaMaskPermission: async function() {

      if(typeof ethereum !== 'undefined') {

        await ethereum.enable();
      } else {
        return true;
      }
    },
    getSubscriptionPlan: function(id) {

      var url = apiEndpoint + '/plan/' + id;

      return ambrpay.getRequest(url)
        .then(function(o) {
          return JSON.parse(o);
        });
    },
    subscribe: function(data) {

      var senderWallet;
      var receiverWallet;
      var subscriptionPlan;
      var subscriptionAmount;
      var customPrice;
      var priceLimitPercentage = 1.50;
      var transferOut = false;
      var subscriptionFeeAmount;

      if(data.network) {
        ambrpay.network = data.network;
      }

      return ambrpay.getContractAddresses()
        .then(() => {
          return ambrpay.getMetaMaskPermission();
        })
        .then(() => {
          return ambrpay.metaMaskLoaded()
        })
        .then(() => {
          return ambrpay.metaMaskLocked()
        })
        .then(() => {
          return ambrpay.getMetaMaskAccount()
        })
        .then((account) => {

          senderWallet = account;

          return ambrpay.getSubscriptionPlan(data.subscriptionPlan);
        })
        .then((plan) => {

          subscriptionPlan = plan;

          if(!subscriptionPlan.wallet && !data.receiverWallet) {

            // cant continue without a wallet to subscribe to
            throw "Subscription plan has no wallet assigned to it, therefore param 'receiverWallet' is required when calling ambrpay.subscribe()";

          } else if(!subscriptionPlan.wallet) {

            // subscription plan has no receiver wallet, overwrite it with the one from ambrpay.subscribe()
            receiverWallet = data.receiverWallet;

          } else {

            receiverWallet = subscriptionPlan.wallet;
          }

          if(!_web3.utils.isAddress(receiverWallet)) {

            throw "receiverAddress is not a valid address";
          }

          if(subscriptionPlan.daysInterval == -1 && !data.interval) {
            throw "Subscription plan has interval set to custom, therefore param 'interval' is required when calling ambrpay.subscribe()";
          }

          // todo: only for CRYPTO plans?
          if(subscriptionPlan.daysInterval == -1 && data.interval && parseInt(data.interval) >= 1 && parseInt(data.interval) <= 365) {

            subscriptionPlan.daysInterval = parseInt(data.interval);

          } else if(subscriptionPlan.daysInterval == -1 && data.interval) {

            throw "interval must be between 1 and 365";
          }

          if(data.transferOut && subscriptionPlan.transferOut == 1) {

            transferOut = true;

          } else {

            transferOut = false;
          }

          if(subscriptionPlan.acceptedCryptoCurrencies.Ethereum.price > 0) {

            return subscriptionPlan.acceptedCryptoCurrencies.Ethereum.price;

          } else {

            if(data.amount) {

              customPrice = data.amount;

              if(subscriptionPlan.currencyCode == 'ETH') {

                if(data.amount < 0.01) {
                  throw "the minimum amount is 0.01 ETH";
                }
              } else {

                if(customPrice < 1) {
                  throw "the minimum amount is " + subscriptionPlan.currencyCode + " 1.00 ";
                }

                return ambrpay.getExchangePrice(subscriptionPlan.currencyCode, 'ETH', customPrice)
                  .then((price) => {
                    return price;
                  });
              }

              return data.amount;
            }
          }
        })
        .then((amount) => {

          subscriptionAmount = amount;

          subscriptionFeeAmount = amount / 100 * subscriptionPlan.fee;
          subscriptionFeeAmount = subscriptionFeeAmount * 1000000000000000000 / 1000000000000000000;

          if(_web3.utils.isAddress(subscriptionPlan.wallet)) {

            var subscriptionTotalAmount = parseFloat(subscriptionAmount);

          } else {

            var subscriptionTotalAmount = parseFloat(subscriptionAmount) + parseFloat(subscriptionFeeAmount);
          }

          var subscriptionPriceLimit = subscriptionTotalAmount * (1 + (subscriptionPlan.priceLimitPercentage/100));

          return new Promise(function(resolve, reject) {

            var instance = new _web3.eth.Contract(ambrpay.ABI.abi, ambrpay.contractAddress);

            return instance.methods.createSubscriptionWithTransfer(
              receiverWallet,
              subscriptionPlan.daysInterval,
              _web3.utils.toWei(subscriptionPriceLimit.toString(), 'ether'),
              transferOut,
              _web3.utils.toWei(subscriptionFeeAmount.toString(), 'ether'))
              .send({
                value: _web3.utils.toWei(subscriptionTotalAmount.toString(), 'ether'),
                gas: 500000,
                gasPrice: 1000000000,
                from: senderWallet
              })
              .then((res) =>{
                return resolve(res);
              })
              .catch((e) => {
                return reject(e);
              });
          });
        })
        .then((txHash) => {
          
          var customer = {
            subscriptionPlanId: subscriptionPlan.id,
            senderWallet: senderWallet,
            receiverWallet: receiverWallet,
            customerId: data.customerId,
            customerEmail: data.customerEmail,
            customerDescription: data.customerDescription,
            transactionHash: txHash,
            subscriptionCurrency: "ETH",
            subscriptionPrice: subscriptionAmount,
            customPrice: customPrice,
            interval: data.interval,
            transferOut: transferOut,
            smartContractAddress: ambrpay.contractAddress,
          };

          return ambrpay.createSubscription(customer)
            .then(() => {
              return txHash;
            });
        });
    },
    createSubscription: function(data) {

      var url = apiEndpoint + '/subscription';

      return ambrpay.postRequest(url, data)
        .then(function(o) {
          return JSON.parse(o);
        });
    },
    getExchangePrice: function(from, to, amount) {

      var url = apiEndpoint + '/price/' + from + '/' + to + '/' + amount;

      return ambrpay.getRequest(url);
    },
    getRequest: function(url) {

      if (!ambrpay.apiKey) {
        throw "ambrpay api key not set";
      }

      return new Promise(function(resolve, reject) {

        var http = new XMLHttpRequest();

        http.open('GET', url, true);
        http.setRequestHeader('Authorization', 'Bearer ' + ambrpay.apiKey);

        http.onreadystatechange = function() {
          if (http.readyState == 4 && http.status == 200) {
            return resolve(http.responseText);
          } else if (http.readyState == 4 && http.status != 200) {
            reject(http.responseText);
          }
        }

        http.send();
      });
    },
    postRequest: function(url, params) {

      if (!ambrpay.apiKey) {
        throw "ambrpay api key not set";
      }

      return new Promise(function(resolve, reject) {

        var http = new XMLHttpRequest();

        http.open('POST', url, true);
        http.setRequestHeader('Authorization', 'Bearer ' + ambrpay.apiKey);

        http.onreadystatechange = function() {

          if (http.readyState == 4 && http.status == 200) {
            resolve(http.responseText);
          } else if (http.readyState == 4 && http.status != 200) {
            reject(http.responseText);
          }
        }

        http.send(JSON.stringify(params));
      });
    },
    metaMaskLoaded: function() {
      return new Promise(function(resolve, reject) {

        if(_web3 == 'undefined') {
          reject("MetaMask is missing. Please download the MetaMask browser extension.");
        }
        return resolve(true);
      });
    },
    metaMaskLocked: function() {
      return new Promise(function(resolve, reject) {

        if(_web3.eth.accounts.length == 0) {
          reject("MetaMask is locked. Please login to your MetaMask account.");
        }
        return resolve(true);
      });
    },
    getMetaMaskAccount: function() {
      return new Promise(function(resolve, reject) {
        return resolve(ethAddress);
      });
    },
    getSubscriptionFunds: function() {
      return ambrpay.getContractAddresses()
        .then(() => {
          return ambrpay.getMetaMaskAccount();
        })
        .then((address) => {
          if(!address) {
            throw "Error retrieving your metamask wallet address. Make sure metamask is unlocked";
          }
          return new Promise(function(resolve, reject) {

            var instance = new _web3.eth.Contract(ambrpay.ABI.abi, ambrpay.contractAddress);
            var balance = instance.methods.getBalances(address).call();

            return resolve(balance);
          });
        });
    },
    getSubscriptions: function(address) {

      return new Promise(function(resolve, reject) {

        if(!address) {

          return ambrpay.getMetaMaskAccount()
            .then((metamaskAddress) => {

              var url = apiEndpoint + '/subscriptions/' + metamaskAddress;

              return ambrpay.getRequest(url, ambrpay.apiKey)
                .then(function(subscriptions) {

                  ambrpay.subscriptions = JSON.parse(subscriptions);

                  return resolve(ambrpay.subscriptions);
                });
            });
        } else {

          var url = apiEndpoint + '/subscriptions/' + address;

          return ambrpay.getRequest(url, ambrpay.apiKey)
            .then(function(subscriptions) {

              ambrpay.subscriptions = JSON.parse(subscriptions);

              return resolve(ambrpay.subscriptions);
            });
        }
      });
    },
    getMetaMaskBalance: function() {

      return new Promise(function(resolve, reject) {

        return ambrpay.getMetaMaskAccount()
          .then((address) => {
            return _web3.eth.getBalance(address, function(e, o) {
              if (e) return reject(e);
              var value = _web3.utils.fromWei(o, 'ether');
              value = web3.utils.toDecimal(value);
              return resolve(value);
            });
          });
      });
    },
    unsubscribe: function(pos, contractAddress) {

      return new Promise(function(resolve, reject) {
        var instance = new _web3.eth.Contract(ambrpay.ABI.abi, contractAddress);

        return ambrpay.getMetaMaskAccount()
          .then((address) => {

            return instance.methods.deactivateSubscription(pos)
              .send({ gas: 500000, from: address })
              .then((res) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          })
      });
    },
    addFunds: function(amount) {

      return new Promise(function(resolve, reject) {

        return ambrpay.getMetaMaskAccount()
          .then((address) => {
            var instance = new _web3.eth.Contract(ambrpay.ABI.abi, ambrpay.contractAddress);

            return instance.methods.addFunds(address)
                    .send({ value: _web3.utils.toWei(amount), gas: 500000, from: address })
                    .then((res) => {
                      return resolve(res);
                    })
                    .catch((err) => {
                      return reject(err);
                    });
          });
      });
    },
    withdrawFunds: function(amount) {

      return new Promise(function(resolve, reject) {

        return ambrpay.getMetaMaskAccount()
          .then((address) => {
            var instance = new _web3.eth.Contract(ambrpay.ABI.abi, ambrpay.contractAddress);

            return instance.methods.withdrawFunds(_web3.utils.toWei(amount))
                      .send({gas: 500000, from: address})
                      .then((res) => {
                        return resolve(res);
                      })
                      .catch((err) => {
                        return reject(err);
                      })
          });
      });
    },
  }

  ambrpay.setApiKey(account.publicApiKey);

  return ambrpay;
};
