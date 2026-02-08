import { decryptData, encryptData } from "./EncryptionUtils.js";
import { StorageUtils } from './StorageUtile.js'
import { ethers } from "ethers";

let storage;
let unlockedWallet = null;
let provider = null;
let currentNetwork = "localhost";
let initialized;
let currlockedWallet = null;
self.onmessage = async (event) => {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case "INIT": {
        if(!storage || !storage.db){
          storage = new StorageUtils();
          await storage.init();
          initialized = true;
        }
        console.log("Storage initialized in worker");
        
        currentNetwork = payload?.network || "localhost";
        provider = initProvider(currentNetwork);
        unlockedWallet = storage.currWallet || null; 
        return reply(id, "INIT_OK");
      }

      case "SET_NETWORK": {
        currentNetwork = payload.network;
        provider = initProvider(currentNetwork);
        await storage.setNetwork(currentNetwork);
        return reply(id, "NETWORK_SET", provider);
      }

      case "GET_NETWORK":{
        return reply(id,"NETWORK_SET", provider);
      }

      case "UNLOCK": {
        const wallets = await storage.getAllWallets();
        const password = payload.key;
        if (!wallets.length) throw new Error("No wallets stored");
        console.log("Wallets available for unlocking:", wallets.map(w => w.address));
        console.log(storage.currWallet);
        const walletRecord = storage.currWallet;
        console.log("decrypting wallet with address:", currlockedWallet);
        const decrypted = await decryptData(walletRecord.ciphertext, password);
        console.log("decryption result:", decrypted);
        return reply(id, "UNLOCK_OK", { address: walletRecord.address });
      }

      case "LOCK": {
  // Store the currently unlocked wallet address before clearing it
  if (unlockedWallet) {
    currlockedWallet = unlockedWallet.address; // Should be just the address string
    console.log("Locking wallet, current locked wallet set to:", currlockedWallet);
  } else if (payload && payload.address) {
    // If address is provided in payload, use that
    currlockedWallet = payload.address; // Make sure this is just the address string
    console.log("Setting locked wallet to provided address:", currlockedWallet);
  }
  
  unlockedWallet = null;
  return reply(id, "LOCK_OK", { lockedAddress: currlockedWallet });
}
      case "GET_BALANCE": {
        requireUnlocked();
        const balance = await provider.getBalance(storage.currWallet.address);
        return reply(id, "BALANCE", ethers.formatEther(balance));
      }

        case "GET_BALANCE_SPEC": {
        const address = payload;
        requireUnlocked();
        const balance = await provider.getBalance(address);
        return reply(id, "BALANCE", ethers.formatEther(balance));
      }

      case "GET_TXS": {
        requireUnlocked();
        const txs = await storage.getTransactionsByAddress(unlockedWallet.address);
        return reply(id, "TXS", txs);
      }

      case "SEND_TX": {
        requireUnlocked();
        const {encryptedData, password, to, value, gasLimit, maxFeePerGas, maxPriorityFeePerGas} = payload;

        const privateKey = await decryptData(encryptedData, password);
        console.log("privateKEy decrypted");
        
        // Create wallet from decrypted private key
        const wallet = new ethers.Wallet(privateKey, provider);
        console.log(provider);
        console.log("wallet created tho");
        // Send transaction
        const tx = await wallet.sendTransaction({
            to: to,
            value: ethers.parseEther(value),
            gasLimit,
            maxFeePerGas,
            maxPriorityFeePerGas
        });
        
        console.log('Transaction sent:', tx.hash);

        const receipt = await tx.wait();

        await storage.saveTransaction(
          receipt,
          wallet.address,
          payload.to,
          value
        );
        let x = ethers.parseEther(value);

        return reply(id, "TX_SENT", {rec: receipt, to: payload.to, from: wallet.address, value: x});
      }

      case "SAVE_WALLET": {
        const { password, name } = payload;
        const wallet = await ethers.Wallet.createRandom().connect(currentNetwork);
        const encryptedData = await encryptData(wallet.privateKey, password);
        const encryptedPassword = await encryptData(password, password);
        const hashedPassword = await hashPassword(password);
        await storage.saveWallet(encryptedData, wallet.address, encryptedPassword, name, hashedPassword);
        storage.currWallet = wallet;
        console.log("Wallet saved with address: ", wallet.address);
        return reply(id, "WALLET_SAVED",{address: wallet.address, mnemonic: wallet.mnemonic} );
      }

      case "GET_ALL_WALLETS":{
        const result = await storage.getAllWallets();
        if(result){
          return reply(id, "WALLETS_RETURNED",result);
        }
        else{
          return reply(id, "FAILED");
        }
      }
      case "GET_CURRWALLET" :{
        let result = storage.currWallet;
        if(!result){
          try{
            const wallets = await storage.getAllWallets();
            result = wallets[0];
            storage.currWallet = wallets[0]
          }
          catch(e){
            result = null;
            return reply(id, "CURRWALLETFAIL", result);
          }
          
        }
        return reply(id,"CURRWALLET",result);
      }

      case "SET_CURRWALLET":{
        const address = payload;
        storage.currWallet = await storage.getWallet(address);
        return reply(id,"SUCCESS", address);
      }
      case "GET_WALLET":{
        const address = payload; 
        const wallet = await storage.getWallet(address);
        if(wallet){
          return reply(id, "ALREADYHERE", wallet);
        }
        else{
          return reply(id, "NON", "");
        }
      }

      case "IMPORT_PK":{
        const {seed,password, name} = payload;
        console.log(payload);
        const wallet = new ethers.Wallet(seed,currentNetwork);
           const existingWallet = await storage.getWallet(wallet.address);

        if (existingWallet) {  // Check if it exists
         return reply(id, "WALLETALREADYHERE", "Wallet already created");
        }
        else{
        const encryptedData = await encryptData(wallet.privateKey, password);
        const encryptedPassword = await encryptData(password, password);
        const hashedKey = await hashPassword(password);
        await storage.saveWallet(encryptedData, wallet.address, encryptedPassword, name, hashedKey);  
        storage.currWallet = wallet;          
        return reply(id,"SUCCESS", wallet.address);
        }

      }

  case "IMPORT_SEED":{
    const {seed,password, name} = payload;
    const wallet = new ethers.Wallet(seed, currentNetwork);
    const existingWallet = await storage.getWallet(wallet.address);
    if (existingWallet) {  // Check if it exists
     return reply(id, "WALLETALREADYHERE", "Wallet already created");
    }
    else{
      const encryptedData = await encryptData(wallet.privateKey, password);
      const encryptedPassword = await encryptData(password, password);
      const hashedKey = await hashPassword(password);
      await storage.saveWallet(encryptedData, wallet.address, encryptedPassword, name,hashedKey);         
      storage.currWallet = wallet; 
      return reply(id,"SUCCESS", wallet.address);
    }

    }
  case "CHECK_PASS":{
    const password = payload; 
    const res = await hashPassword(password);
    console.log(storage.currWallet);
    console.log(res);
    if(res == storage.currWallet.hashedKey){
      return reply(id,"SUCCESS", "true");
    }
    else{
      return reply(id, "FAIL", "false");
    }
  }

    case "CHECK_PASS_ADDRESS":{
    const {password,address} = payload; 
    const res = await hashPassword(password);
    const curr = await storage.getWallet(address);
    console.log(curr);
    console.log(res); 
    console.log("NYA");
    if(res == curr.hashedKey){
      return reply(id,"SUCCESS", "true");
    }
    else{
      return reply(id, "FAIL", "false");
    }
  }

  case "DELETE_WALLET":{
    const address = payload;
    const res = await storage.deleteWallet(address);
    storage.currWallet = (await storage.getAllWallets())[0] || null;
    return reply(id, "succ");
  };
  
  case "SELF_DESTRUCT" :{
    await storage.clearDatabase();
    return reply(id , "YAY");
  }

  case "CHANGE_PW": {
    const {address,password, oldPassword} = payload; 
    console.log(payload);
    console.log("changing");
    const x = await storage.changePassword(address,password, oldPassword);
    return reply(id, "PW_CHANGED");
  }

  case "ESTIMATE_GAS": {
  requireUnlocked();
  const { to, value } = payload;

  const tx = {
    to,
    value,
  };

  const gasLimit = await provider.estimateGas(tx);
  const feeData = await provider.getFeeData();

  return reply(id, "GAS_ESTIMATE", {
    gasLimit: gasLimit.toString(),
    maxFeePerGas: feeData.maxFeePerGas?.toString(),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
  });
}


    default:
      throw new Error(`Unknown command: ${type}`);
    }
  } catch (err) {
    console.error("Worker error:", err);
    reply(id, "ERROR", err.message);
  }
};

function reply(id, type, payload) {
  console.log("Reply sending:", { id, type, payload });
  self.postMessage({ id, type, payload });
  
}

function requireUnlocked() {
  if (!unlockedWallet) throw new Error("Wallet is locked");
}

function initProvider(networkKey) {
  switch (networkKey) {
    case "localhost":
      return new ethers.JsonRpcProvider("http://127.0.0.1:9545");

    case "sepolia":
      return new ethers.JsonRpcProvider(import.meta.env.VITE_SEPOLIA_RPC_URL);

    case "hardhatMainnet":
      return new ethers.JsonRpcProvider(); 

    default:
      throw new Error(`Unknown network: ${networkKey}`);
  }
}


export async function getETHPriceFromAPI() {
    try {
        // Coingecko API +
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        return data.ethereum.usd;
        
    } catch (error) {
        console.error('Coingecko API failed:', error);
        
     {            
            // Final fallback to Binance
            try {
                const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
                const data = await response.json();
                return parseFloat(data.price);
            } catch (error3) {
                console.error('All APIs failed, using default:', error3);
                return 3500; // Default fallback price
            }
        }
    }
};

async function hashPassword(password) {
    // Convert password to byte array
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Hash with SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string for storage
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}


