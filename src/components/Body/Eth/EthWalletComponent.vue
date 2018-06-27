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
                            <div class="address-section">{{eth.address}}</div>
                        </div>
                    </div>


                        <input placeholder="erc-20 Script Hash" class="form-control" v-model="scriptHash">
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
                  <input id="neo-asset" type="number" v-model="ethSend" class="form-control">
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
            testNet: 'https://ropsten.infura.io',
            keyStore: {}

          }
        },
        created(){

        },
        methods:{
          getTransactions: function(){
            axios.get('http://api.etherscan.io/api?module=account&action=txlist&address='+this.eth.address+'&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken').then((data) => {
              this.transactions = data.data.result;
            })
          },
          createNewEthWallet: function(){
            var ans = prompt('Create Password');
            var Web3 = require("web3")
            var that = this;
            if (ans != ''){
              this.web3 = new Web3(new Web3.providers.HttpProvider(this.testNet));
              this.eth = this.web3.eth.accounts.create();
              sessionStorage.address = this.eth.address;
              sessionStorage.privateKey = this.eth.privateKey;
              sessionStorage.password = ans;
              this.eth = this.web3.eth.accounts.encrypt(this.eth.privateKey, ans);
              sessionStorage.ethEncrypt = JSON.stringify(this.eth);

              this.getBalance();
              this.downloadKeystore();

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
          sendAsset: function(){},
          loginToWallet: function(){
            var Web3 = require("web3")
            var ans = prompt('Keystore Password')
            if(ans != ''){
              var that = this;
              this.file = document.getElementById('json-file').files[0];
              var reader = new FileReader();
              reader.onload = (event) => {
                that.keyStore = JSON.parse(event.target.result);
                that.web3 = new Web3(new Web3.providers.HttpProvider(this.testNet));
                that.eth = that.web3.eth.accounts.decrypt(that.keyStore, ans);
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
            var contract;
            var abi = [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_releaseTime","type":"uint256"}],"name":"mintTimelocked","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
            contract = new this.web3.eth.Contract(abi, this.scriptHash, {from: '0x'+this.eth.address})
            console.log(contract);
            contract.methods.balanceOf(this.eth.address).call().then(function(result){
              console.log(result)
            });
          },
          getBalance: function(){
            var that = this;
            this.web3.eth.getBalance(this.eth.address).then(data => {
              console.log(data);
              that.balance = data;
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
