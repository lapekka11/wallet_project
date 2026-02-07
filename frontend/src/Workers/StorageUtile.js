import SecureStore from "./SecureStore"
let allWallets;
let currWallet;
let recentTransactions;
let contactBook;
let locked = false;
import { encryptData,decryptData    } from "./EncryptionUtils";
export class StorageUtils{
    constructor(){
        this.db = new SecureStore();
        

    }

    async init(){
       if (this.initialized) {
            return this.db;
        }
        locked = false;
        this.db = await this.db.init(); 
        
        this.initialized = true;
        
        this.allWallets = await this.getAllWallets();
        this.currWallet = this.allWallets[0] || null;
        this.recentTransactions = this.currWallet ? await this.getTransactionsByAddress(this.currWallet.address) : [];
        this.contactBook = [];

        return this.db; 
    }


    async  deleteWallet(address){
       if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readwrite');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.delete(address);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async saveWallet(ciphertext, address, key,  name, hashedKey) {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readwrite');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.add({ address, ciphertext, key, name , createdAt: Date.now(), hashedKey});
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }
  
  async  getAllWallets() {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readonly');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }

      async  getLocking() {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('locking', 'readonly');
        const store = tx.objectStore('locking');
        return new Promise((resolve, reject) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async setLocking(value) {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('locking', 'readwrite');
        const store = tx.objectStore('locking');
        return new Promise((resolve, reject) => {
            const req = store.update({id: 0, value: value});
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }
  
  async  saveTransaction(txData, from, to, amountelem, blockNumber) {
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');
      
      const txToSave = {
        
        addressFrom: from,
        addressTo:to,
        savedAt: Date.now(),
        timestamp: txData.timestamp || Date.now(),
        amount: amountelem.value,
        blockNumber: blockNumber || null
      };
      
      const request = store.put(txToSave);
      
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getTransactionsByAddress(address, limit = 50) {
  if (!this.db) throw new Error('DB not initialized');

  return new Promise((resolve, reject) => {
    const tx = this.db.transaction(['transactions'], 'readonly');
    const store = tx.objectStore('transactions');
    const request = store.getAll();
    
    
    request.onsuccess = () => {
        console.log(request);
      const allTxs = request.result ;
      const addr = address.toLowerCase();

      const filteredTxs = allTxs.filter(tx => {
        const fromMatch = tx.addressFrom && tx.addressFrom.toLowerCase() === addr;
        const toMatch = tx.addressTo && tx.addressTo.toLowerCase() === addr;
        return fromMatch || toMatch;
      });
      console.log(filteredTxs);

      const sortedTxs = filteredTxs.sort((a, b) => {
        const timeA = a.timestamp || a.savedAt || 0;
        const timeB = b.timestamp || b.savedAt || 0;
        return timeB - timeA;
      });
      console.log(sortedTxs);

      resolve(sortedTxs.slice(0,limit));
    };

    request.onerror = () => reject(request.error);
  });
}

  async savePreference(key, value) {
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['preferences'], 'readwrite');
      const store = transaction.objectStore('preferences');
      
      const prefData = {
        id: key,
        value: value,
        updatedAt: Date.now()
      };
      
      const request = store.put(prefData);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getPreference(key) {
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['preferences'], 'readonly');
      const store = transaction.objectStore('preferences');
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  async getWallet(address) {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readonly');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.get(address);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = (e) => reject(e.target.error);
        });
    }
async changePassword(address, newPassword, oldPassword) {
    if (!this.db) throw new Error('DB not initialized');
    
    // Get all wallets first (outside transaction)
    const tx1 = this.db.transaction('wallets', 'readonly');
    const store1 = tx1.objectStore('wallets');
    
    const allWallets = await new Promise((resolve, reject) => {
        const req = store1.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = (err) => reject(err.target.error);
    });
    
    // Find the wallet
    const wallet = allWallets.find(w => w.address === address);
    if (!wallet) {
        console.log("Wallet not found");
        return false;
    }
    
    // Do all async work OUTSIDE any transaction
    const newHashedKey = await hashPassword(newPassword);
    console.log("new hashed key: ", newHashedKey);
    
    // Decrypt and re-encrypt
    const decryptedData = await decryptData(wallet.ciphertext, oldPassword);
    const reEncryptedData = await encryptData(decryptedData, newPassword);
    console.log("re-encrypted data: ", reEncryptedData);
    
    // Update wallet object
    const updatedWallet = {
        ...wallet,
        hashedKey: newHashedKey,
        ciphertext: reEncryptedData
    };
    
    // Now do the update in a NEW transaction
    const tx2 = this.db.transaction('wallets', 'readwrite');
    const store2 = tx2.objectStore('wallets');
    
    return new Promise((resolve, reject) => {
        const putReq = store2.put(updatedWallet);
        
        putReq.onsuccess = () => {
            console.log("Password changed successfully");
            resolve(true);
        };
        
        putReq.onerror = (err) => {
            console.error("Failed to update wallet:", err.target.error);
            reject(err.target.error);
        };
    });
}

    async  updateWallets(){
    allWallets = await this.getAllWallets();
}
updateCurrWallet(wallet){
    this.currWallet = wallet;
}

async updateRecentTransactions(wallet){
    console.log(wallet);
    console.log("nianianianiania");
    this.recentTransactions = await this.getTransactionsByAddress(wallet.address);
    return this.recentTransactions;
}

updateContacts(contact){
    contactBook.push(contact);
}

async setNetwork(networkKey) {
  await this.savePreference("selectedNetwork", networkKey);
}

async getNetwork() {
  return (await this.getPreference("selectedNetwork")) || "localhost";
}


    
}


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
