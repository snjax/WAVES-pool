const fetch = require("node-fetch");
const { broadcast, waitForTx, setScript, invokeScript } = require("@waves/waves-transactions");
const { address, base58Encode, publicKey } = require("@waves/waves-crypto");
const fs = require("fs");




const env = process.env;
if (env.NODE_ENV !== 'production') {
  require('dotenv').load();
}




const seed = env.MNEMONIC;
const rpc = env.WAVES_RPC;
const chainId = env.WAVES_CHAINID;
const dApp = address(env.MNEMONIC, chainId);

const ridetpl = fs.readFileSync("ride/pool.ride", {encoding:"utf8"});





(async () => {
  let vk = fs.readFileSync("../pool-crypto/verification_key.txt", {encoding:"utf8"});
  const ridescript = ridetpl.replace("let transferVK=base64''", `let transferVK=base64'${vk}'`);
 
  
  let request = await fetch(`${env.WAVES_RPC}utils/script/compile`, { method: "POST", body: ridescript })
  let t = await request.json();
  console.log(t);
  const {script} = t;
  

  let tx = setScript({ script, fee: 1400000, chainId}, seed);
  await broadcast(tx, rpc);
  await waitForTx(tx.id, { apiBase: rpc });

  console.log(`Dapp is deployed with public key ${publicKey(seed)}. Specify DAPP property at .env file.`)

  process.exit();
})();