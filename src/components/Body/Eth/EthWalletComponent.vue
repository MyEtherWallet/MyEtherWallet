<template>

      <section class="back-cover">
    <div class="home homepage-home">
      <vue-header></vue-header>
        <div class="row justify-content-center">
            <div class="col-md-11">
                <div class="card card-default">
                    <transition name="fade">
                    <div v-if="!loggedin" class="card-body">
                      <div class="form-group">
                        <label for="json-file">Upload Keystore</label>
                        <input type="file" id="json-file"/>
                        </div>
                        <div class="form-group">
                          <div class="form-check">
                            <label class="form-check-label">
                              <input type="radio" class="form-check-input" value="true" selected v-model="testnet">TestNet
                            </label>
                          </div>
                          <div class="form-check">
                            <label class="form-check-label">
                              <input type="radio" class="form-check-input" value="false" disabled v-model="testnet">MainNet
                            </label>
                          </div>
                          <button v-on:click="loginToWallet()" class="btn btn-primary btn-gap btn-custom">Login With Private Keystore</button>
                          <button v-on:click="createNewEthWallet()" class="btn btn-primary btn-gap btn-custom">Create Wallet</button>

                        </div>


                    </div>
                    <div v-else class="card-body">
                      <div class="row">
                        <div class="col-md-1"><span class="small-logo"><img src="static/images/logo-small.png"></span></div>
                        <div class="col-md-4 balance-section">
                        <h2>Account Balance:</h2>
                        <span class="luv-count">{{parseFloat(balance)}} ETH</span>
                        </div>
                        <div class="col-md-7">
                            <div class="address-title">Address</div>
                            <div class="address-section">{{wallet.address}}</div>
                        </div>
                    </div>


                        <input placeholder="erc-20 Script Hash" class="form-control" v-model="scriptHash">
                        <ul v-if="tokens.length > 0">
                          <li v-for="token in tokens">{{token.name}} - {{token.balance}}</li>
                        </ul>
                        <button class="btn btn-primary btn-gap btn-custom" v-on:click="addToken()">Add Token</button>
                        <button class="btn btn-primary btn-gap btn-custom" v-on:click="sendAssetPrompt">Send <i class="icon" data-icon="d"></i></button>
                        <button class="btn btn-primary btn-gap btn-custom" data-toggle="modal" data-target="#transactionModal">Get Transactions</button>
                        <ul>
                          <li v-for="token in tokens">{{token.symbol}}: {{token.balance}}</li>
                        </ul>
                    </div>
                  </transition>
                </div>
            </div>
        </div>
        <!-- Transactions -->
        <!-- Modal -->
          <div id="transactionModal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">

              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">My Transactions</h4>
                </div>
                <div class="modal-body table-responsive">
                  <table class="table">
                  <thead>
                    <tr>
                      <th>Hash</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="transaction in transactions">
                      <td>{{transaction.hash}}</td>
                      <td>{{transaction.from}}</td>
                      <td>{{transaction.to}}</td>
                      <td>{{transaction.value}}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>

        <!---- Transactions -->
        <!-- Modal -->
        <div id="assetModal" class="modal fade" role="dialog">
          <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Send Asset</h4>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label for="sendAddr">Address</label>
                  <input id="sendAddr" v-model="sendAddr" class="form-control">
                </div>
                <div class="form-group">
                  <label for="neo-asset">ETH:</label>
                  <select class="form-control" v-model="erc20Token">
                    <option value="eth" >ETH</option>
                    <option v-for="token in tokens" :value="token" >{{token.name}}</option>
                  </select>
                  <input id="neo-asset" type="number" v-model="ethSend" class="form-control" placeholder="Amount">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary"  v-on:click="sendAsset">Send <span class="glyphicon glyphicon-send"></span></button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close <span class="glyphicon glyphicon-remove"></span></button>
              </div>
            </div>

          </div>
        </div>
        <br>
        <vue-footer></vue-footer>
    </div>
  </section>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        },
        data(){
          return {
            Neon: {},
            account: null,
            wallet: null,
            balance: null,
            loggedin:false,
            tokens: [],
            sendAddr:'',
            testnet: false,
            transactions:{},
            scriptHash: '',
            web3: {},
            eth: {},
            phrase: {},
            privateKey:{},
            file: {},
            mainNet: 'https://infuranet.infura.io',
            testNet: 'https://homestead.infura.io',
            keyStore: {},
            ethers: null,
            tokens: [],
            erc20Token: ''

          }
        },
        created(){
          this.ethers = require('ethers');
        },
        methods:{
          getTransactions: function(){
            axios.get('http://api.etherscan.io/api?module=account&action=txlist&address='+this.eth.address+'&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken').then((data) => {
              this.transactions = data.data.result;
            })
          },
          createNewEthWallet: function(){
            var ans = prompt('Create Password');
            var that = this;
            if (ans != ''){
            /*  this.web3 = new Web3(new Web3.providers.HttpProvider(this.mainNet));
              this.eth = this.web3.eth.accounts.create();
              sessionStorage.address = this.eth.address;
              sessionStorage.privateKey = this.eth.privateKey;
              sessionStorage.password = ans;
              this.eth = this.web3.eth.accounts.encrypt(this.eth.privateKey, ans);
              sessionStorage.ethEncrypt = JSON.stringify(this.eth);
              */
              this.wallet = this.ethers.Wallet.createRandom();
              this.wallet.provider = new this.ethers.providers.EtherscanProvider('homestead','FEUQI8J8SPJKS3Q1I989I31DW5SFGEB6J3')
              //encrypt Wallet
              this.wallet.encrypt(ans).then(data => {
                console.log(data);
                this.eth = JSON.parse(data);
                this.downloadKeystore();
                this.getBalance();
              });
            }
            else{
            alert('Must create a password!');
            }
            },
          downloadKeystore: function () {
            var FileSaver = require('file-saver')
            var blob = new Blob([JSON.stringify(this.eth)], {type: 'application/json'})
            FileSaver.saveAs(blob, this.eth.address+'.json')
          },
          ethSend: function(){},
          sendAsset: function(){
            console.log(this.erc20Token)
            if(this.erc20Token == 'eth'){

            var transaction = {
            nonce: 0,
            gasLimit: 21000,
            gasPrice: this.ethers.utils.bigNumberify("20000000000"),

            to: this.sendAddr,

            value: this.ethers.utils.parseEther(this.eth),
            data: "0x",

            // This ensures the transaction cannot be replayed on different networks
            chainId: this.ethers.providers.networks.homestead.chainId

        };

        var signedTransaction = this.wallet.sign(transaction);

        console.log(signedTransaction);
        // "0xf86c808504a817c8008252089488a5c2d9919e46f883eb62f7b8dd9d0cc45bc2" +
        //   "90880de0b6b3a7640000801ca0d7b10eee694f7fd9acaa0baf51e91da5c3d324" +
        //   "f67ad827fbe4410a32967cbc32a06ffb0b4ac0855f146ff82bef010f6f2729b4" +
        //   "24c57b3be967e2074220fca13e79"

        // This can now be sent to the Ethereum network
        var provider = this.ethers.providers.getDefaultProvider();
        provider.sendTransaction(signedTransaction).then(function(hash) {
            console.log('Hash: ' + hash);
            alert(hash);
            // Hash:
        }).catch(err => {
          alert(err)
        });


            }else{
              var contract = new this.ethers.Contract(this.erc20Token.scriptHash, this.erc20Token.abi, this.wallet);



              // Send tokens
              contract.transfer(this.sendAddr, this.ethSend).then(function(tx) {
                  console.log(tx);
                  alert(tx);
              }).catch(err => {
                alert(err);
              });
            }
          },
          loginToWallet: function(){
            var Web3 = require("web3")
            var ans = prompt('Keystore Password')
            if(ans != ''){
              var that = this;
              this.file = document.getElementById('json-file').files[0];
              var reader = new FileReader();
              reader.onload = (event) => {
                that.keyStore = JSON.parse(event.target.result);
                that.web3 = new Web3(new Web3.providers.HttpProvider(this.mainNet));
                that.wallet = that.web3.eth.accounts.decrypt(that.keyStore, ans);

                that.getBalance();

              };

              reader.readAsText(this.file);

            }
            else{
              alert('You must supply a password to decrypt your wallet.');
            }
          },
          sendAssetPrompt: function(){
            $("#assetModal").modal()
          },
          addToken: function(){


            var contract,abi;
            var token = {
              name: '',
              balance: 0,
              scriptHash: '',
              abi: null
            }
            var that = this;
            var url = 'https://api.etherscan.io/api?module=contract&action=getabi&address='+this.scriptHash+'&apikey=YourApiKeyToken'
            axios.get(url).then(data =>{
            //////////////
            console.log(data);
            that.abi = JSON.parse(data.data.result);
            token.abi = that.abi
            console.log(that.abi);
            var provider = this.ethers.providers.getDefaultProvider('homestead');

            var contract = new this.ethers.Contract(that.scriptHash, that.abi, provider);
            console.log(contract.functions);
            token.scriptHash = that.scriptHash;
            contract.balanceOf(this.wallet.address).then(data => {
              console.log(data);
              token.balance = that.ethers.utils.toNumber(data._bn)
            }).catch(err => {
              console.log(err.reason);
              console.log(err.code);
              console.log(err);
            });

            contract.name().then(data => {
              console.log(data);
              token.name = data;
              that.tokens.push(token);
            })
            });
          },
          getBalance: function(){
            var that = this;
            var provider = this.ethers.providers.getDefaultProvider('homestead');
            provider.getBalance(this.wallet.address).then(data => {
              console.log(data);
              that.balance = that.ethers.utils.formatEther(data);
              that.loggedin = true;
            });
            this.getTransactions();

          }
        }
    }
</script>
<style lang="scss" scoped>
  @import "EthWallet.scss";
</style>
