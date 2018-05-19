<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card card-default">
                    <div class="card-header">NEO Wallet</div>
                    <transition name="fade">
                    <div v-if="!loggedin" class="card-body">
                        <input class="form-control" v-model="privateKey" placeholder="Private Key"/>
                        <input class="form-control" placeholder="Phrase" v-model="phrase" type="password">
                        <button v-on:click="createAccount()" class="btn btn-success">Login With Private Key</button>
                    </div>
                    <div v-else class="card-body">
                        <b>Address: </b>{{balance.address}}
                        <br>
                        <b>NEO: </b> {{parseInt(balance.assets.NEO.balance)}}
                        <br>
                        <b>GAS: </b> {{parseFloat(balance.assets.GAS.balance)}}
                        <br>
                        Total Balance USD: ${{(gasPrice * parseFloat(balance.assets.GAS.balance) + neoPrice * parseInt(balance.assets.NEO.balance)).toFixed(2) }}
                        <input placeholder="NEP-5 Script Hash" class="form-control" v-model="scriptHash">
                        <button class="btn btn-sm btn-success" v-on:click="addToken()">Add Token</button>
                        <ul>
                          <li v-for="token in tokens">{{token.symbol}}: {{parseFloat(token.balance)}}</li>
                        </ul>
                        <div class="form-group">
                          <button class="btn btn-sm btn-primary" v-on:click="sendAssetPrompt">Send</button>
                        </div>
                        <div class="form-group">
                          <button class="btn btn-sm btn-success" v-on:click="claimGas">Claim Gas</button>
                        </div>
                    </div>
                  </transition>
                </div>
            </div>
        </div>

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
                  <label for="neo-asset">NEO:</label>
                  <input id="neo-asset" type="number" v-model="neoSend" class="form-control">
                </div>
                <div class="form-group">
                  <label for="gas-asset">GAS:</label>
                  <input id="gas-asset" type="number" v-model="gasSend" class="form-control">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary"  v-on:click="sendAsset">Send <span class="glyphicon glyphicon-send"></span></button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close <span class="glyphicon glyphicon-remove"></span></button>
              </div>
            </div>

          </div>
        </div>
    </div>
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
            privateKey: '',
            phrase: '',
            loggedin:false,
            tokens: [],
            neoSend:0,
            gasSend:0,
            sendAddr:'',
            gasPrice: 0.00,
            neoPrice: 0.00
          }
        },
        created(){
          this.Neon = Neon.default;
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/background.js').then(function(registration) {

              }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
              });
            });
          }

        },
        methods:{
          createAccount:function(){

            this.account =new wallet.Account(this.privateKey).decrypt(this.phrase);
            var balance = new wallet.Balance({net: 'MainNet', address: this.account.address})
            var that = this;
            that.getBalance();


          },
          addToken:function(){
            /*
            const scriptHashes = [
              '34579e4614ac1a7bd295372d3de8621770c76cdc',
              'b951ecbbc5fe37a9c280a76cb0ce0014827294cf',
              'ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9'

            ];

            */
            var that = this;
            var getName = { scriptHash:this.scriptHash, operation: 'name', args: [] }
            var getDecimals = { scriptHash:this.scriptHash, operation: 'decimals', args: [] }
            var getSymbol = { scriptHash:this.scriptHash, operation: 'symbol', args: [] }
            var getTotalSupply = { scriptHash:this.scriptHash, operation: 'totalSupply', args: [] }
            var getBalance = {
              scriptHash: this.scriptHash,
              operation: 'balanceOf',
              args:[that.Neon.u.reverseHex(that.Neon.u.str2hexstring(that.account.address))]
            };
            var script = that.Neon.create.script([getName, getDecimals, getSymbol, getTotalSupply,getBalance]);
            Neon.rpc.Query.invokeScript(script)
            .execute('http://seed3.neo.org:20332')
            .then(res => {
              console.log(res) // You should get a result with state: "HALT, BREAK"
              if(res.result.state != "FAULT, BREAK"){
                var token ={name:that.Neon.u.hexstring2str(res.result.stack[0].value), decimals: res.result.stack[1].value,symbol:that.Neon.u.hexstring2str(res.result.stack[2].value),
                totalSupply:that.Neon.u.hexstring2str(res.result.stack[3].value),balance:that.Neon.u.hexstring2str(res.result.stack[4].value)};
                that.tokens.push(token);
              }

            });

          },
          sendAssetPrompt: function(){
            console.log('sendAsset Clicked!');
            $("#assetModal").modal()
          },
          sendAsset: function(){
                    // We want to send 1 NEO and 1 GAS to ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
          if(this.neoSend >0 && this.gasSend > 0){
            var intent = api.makeIntent({NEO:this.neoSend, GAS:this.gasSend}, this.sendAddr)

          }
          else if(this.neoSend >0 && this.gasSend <= 0){
          var intent = api.makeIntent({NEO:this.neoSend}, this.sendAddr)

          }
          else if(this.neoSend <=0 && this.gasSend > 0){
            var intent = api.makeIntent({GAS:this.gasSend}, this.sendAddr)

          }
          else{
            alert('Must send an asset bigger than 0!')
          }
          console.log(intent) // This is an array of 2 Intent objects, one for each asset

          const config = {
            net: 'MainNet', // The network to perform the action, MainNet or TestNet.
            address: this.account.address,  // This is the address which the assets come from.
            privateKey: this.account.privateKey,
            intents: intent
          }
          var that = this;
          this.Neon.sendAsset(config)
          .then(config => {
            alert("Success txid: "+config.response.txid)

            that.getBalance();
        })
      },
      getBalance:function(){
        var that = this;
        api.cmc.getPrice('GAS').then(res => {
          that.gasPrice = res;
        })
        api.cmc.getPrice('NEO').then(res => {
          that.neoPrice = res;
        })
        api.neonDB.getBalance('MainNet',this.account.address).then(obj => {
          that.balance = obj;
          that.loggedin = true;
      })
      .catch(config => {
        console.log(config)
      })
    },
          claimGas: function(){

            this.Neon.claimGas({net: 'MainNet',address:this.account.address,privateKey: this.account.privateKey})
            .then(config => {
              console.log(config.response)
              alert('Gas CLAIMED!')
              this.getBalance();
            })
            .catch(config => {
              console.log(config)
            })
          }
        }
    }
</script>
