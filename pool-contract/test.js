const { broadcast, waitForTx, setScript, invokeScript, nodeInteraction } = require("@waves/waves-transactions");
const { address, base58Encode, base58Decode, publicKey, privateKey } = require("@waves/waves-crypto");


const fs = require("fs");
const env = process.env;
if (env.NODE_ENV !== 'production') {
  require('dotenv').load();
}



const sleep = m => new Promise(r => setTimeout(r, m));

let seed = env.MNEMONIC;
const rpc = env.WAVES_RPC;
const chainId = env.WAVES_CHAINID;


const dAppPk = env.DAPP;
const dApp = address({publicKey:dAppPk}, chainId);
const userAddress = address(seed, chainId);

const fee = 900000;



(async()=>{
  

let tx = invokeScript({
  dApp,
  chainId,
  payment: [],
  call: {
  function: "transfer",
  args: [{ type: "binary", value:fs.readFileSync("../rollup-crypto/proof.txt", {encoding:"utf8"})},
  { type: "binary", value:fs.readFileSync("../rollup-crypto/inputs.txt", {encoding:"utf8"})}]
  }, fee
}, seed);
let t = await broadcast(tx, rpc);
console.log(t);
console.log(`Waiting for ${tx.id}`);
t = await waitForTx(tx.id, { apiBase: rpc });
console.log(t);
console.log(`transaction complete`)


})();