<template>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card card-default">
                <div class="card-header">Tokhn Wallet</div>

                <transition name="fade">
                    <div v-if="!loggedin" class="card-body">
                        <label class="file-select">
                            <div class="select-button">
                                <span v-if="value">Selected File: {{value.name}}</span>
                                <span v-else>Select File</span>
                            </div>
                            <input type="file" @change="handleFileChange" />
                        </label>
                        <button type="submit" class="btn btn-success" v-on:click="createWallet">
                            Generate Wallet</button>
                    </div>
                    <div v-else class="card-body">
                        <b>Network: </b>Luv
                        <br>
                        <b>address: </b>{{Token.address}}
                        <br>
                        <b>Ballance: </b> 0
                        <br>



                        <div class="form-group">
                            <button class="btn btn-sm btn-primary" v-on:click="sendAssetPrompt">Send</button>
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
                        <label for="asset">luv:</label>
                        <input id="asset" type="number" v-model="neoSend" class="form-control">
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" v-on:click="sendAsset">Send <span class="glyphicon glyphicon-send"></span></button>
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
        data() {
            return {
                value: File,
                account: null,
                wallet: null,
                privateKey: '',
                loggedin: false,
                withdraw: false,
                tokens: [],
                neoSend: 0,
                sendAddr: '',
                tokens: [],
                Token: {
                    Network: 2,
                    balance: 0,
                    address: [],
                    privateKey: [],
                    publicKey: [],
                    utxos: []

                }
            }
        },
        methods: {
            sendAssetPrompt: function() {
                console.log('sendAsset Clicked!');
                $("#assetModal").modal()
            },
            sendAsset: function() {},
            createWallet: function() {
                const SHA2 = require("sha2");
                const crypto = require('crypto');

                const EC = require('elliptic').ec;

                const RIPEMD160 = require('ripemd160');

                const bs58 = require('bs58');

                const buffer = require('buffer');

                const ec = new EC('p192');



                function hash(data) {

                    return SHA2.sha512_t(256, data);

                }
                const addrVer = Buffer.alloc(1, 0x02); // 0x00 P2PKH Mainnet, 0x6f P2PKH Testnet

                const wifByte = Buffer.alloc(1, 0x02); // 0x80 Mainnet, 0xEF Testnet
                var key = ec.genKeyPair();
                var privateKey = key.getPrivate().toString('hex');
                var pubPoint = key.getPublic();
                var x = pubPoint.getX(); // elliptic x
                var y = pubPoint.getY(); // elliptic y
                // var bufPrivKey = Buffer.from(privKey, 'hex');
                // var wifBufPriv = Buffer.concat([wifByte, bufPrivKey], wifByte.length + bufPrivKey.length);
                // var wifHashFirst = hash(wifBufPriv);
                // var wifHashSecond = hash(wifHashFirst);
                // var wifHashSig = wifHashSecond.slice(0, 4);
                // var wifBuf = Buffer.concat([wifBufPriv, wifHashSig], wifBufPriv.length + wifHashSig.length);
                //
                // var wifFinal = bs58.encode(wifBuf);
                var publicKey = pubPoint.encode('hex');

                var publicKeyInitialHash = hash(Buffer.from(publicKey, 'hex'));

                var publicKeyRIPEHash = new RIPEMD160().update(Buffer.from(publicKeyInitialHash, 'hex')).digest('hex');

                var hashBuffer = Buffer.from(publicKeyRIPEHash, 'hex');

                var concatHash = Buffer.concat([addrVer, hashBuffer], addrVer.length + hashBuffer.length);

                var hashExtRipe = hash(concatHash);

                var hashExtRipe2 = hash(hashExtRipe);

                var hashSig = hashExtRipe2.slice(0, 4);

                var bitcoinBinaryStr = Buffer.concat([concatHash, hashSig], concatHash.length + hashSig.length);
                var tokhnAddress = bs58.encode(Buffer.from(bitcoinBinaryStr));
                var utxos = [];
                console.log(" Address : %s", tokhnAddress.toString('hex'));
                var file = '/tmp/Wallet.json'
                var wallet = {
                    "address": tokhnAddress,
                    "publicKey": publicKey,
                    "privateKey": privateKey,
                    "utxos": utxos
                };
                var walletJSON = JSON.stringify(wallet);

                console.log(walletJSON);
                this.save('Wallet.json', walletJSON)
            },
            save: function(filename, data) {
                var blob = new Blob([data], {
                    type: 'text/csv'
                });
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var elem = window.document.createElement('a');
                    elem.href = window.URL.createObjectURL(blob);
                    elem.download = filename;
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);
                }

            },
            handleFileChange(e) {
                this.$emit('input', e.target.files[0])
                var input = e.target;

                var reader = new FileReader();
                var text;
                reader.onload = function() {
                    text = reader.result;
                    console.log(text.substring(0, 200));
                };
                reader.readAsText(input.files[0]);
                var wallet = JSON.parse(text);
                var account = this.Token;
                account.address = wallet.address;
                account.publicKey = wallet.publicKey;
                account.privateKey = wallet.privateKey;
                account.utxos = wallet.utxos;
                console.log(wallet);
                this.updateBallance(account.address, 0x02);
                this.loggedin = true;

            },
            updateBallance: function(address, network) {
                var PROTO_PATH = __dirname; // + '/../../../protos/route_guide.proto';
                // var grpc = require('grpc');
                // var protoDescriptor = grpc.load(PROTO_PATH);
                // The protoDescriptor object has the full package hierarchy
                //  var routeguide = protoDescriptor.routeguide;
                console.log("PROTO_PATH");
                console.log(PROTO_PATH);
                //var stub = new helloworld.Greeter('localhost:50051', grpc.credentials.createInsecure());

            }

        }
}
< /script>

< style scoped >
    .file - select > .select - button {
        padding: 1 rem;

        color: white;
        background - color: #2EA169;

        border-radius: .3rem;

        text-align: center;
        font-weight: bold;
      }

      .file-select > input[type= "file"] {
        display: none;
    }
   < /style>
