import SecureStore from "./SecureStore"
import { encryptData,decryptData    } from "./EncryptionUtils";
let allWallets;
let currWallet = null;
let recentTransactions;
let contactBook;
let locked = false;
let store = null;
let initialized = false;
export class StorageUtils{
    constructor(){
        this.db = new SecureStore();
    }

    async init(){
       if (this.initialized) {
            return this.db;
        }
        locked = false;
        this.store = this.db;
        this.db = await this.db.init(); 
        
        this.initialized = true;
        
        this.allWallets = await this.getAllWallets();
        this.currWallet = this.allWallets[0] || null;
        this.recentTransactions = this.currWallet ? await this.getTransactionsByAddress(this.currWallet.address) : [];
        this.contactBook = [];

        return this.db; 
    }

    async clearDatabase(){

        this.db = this.store.clearDatabase();
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

    async saveWallet(ciphertext, address, key,  name) {
        if (!this.db) throw new Error('DB not initialized');
        console.log("Saving wallet to DB with address: ", address);
        const tx = this.db.transaction('wallets', 'readwrite');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.add({ address, ciphertext, key, name , createdAt: Date.now()});
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
        amount: amountelem,
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
      const allTxs = request.result ;
      const addr = address.toLowerCase();

      const filteredTxs = allTxs.filter(tx => {
        const fromMatch = tx.addressFrom && tx.addressFrom.toLowerCase() === addr;
        const toMatch = tx.addressTo && tx.addressTo.toLowerCase() === addr;
        return fromMatch || toMatch;
      });

      const sortedTxs = filteredTxs.sort((a, b) => {
        const timeA = a.timestamp || a.savedAt || 0;
        const timeB = b.timestamp || b.savedAt || 0;
        return timeB - timeA;
      });

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
        console.log("Address to get wallet: ", address);  
        const tx = this.db.transaction('wallets', 'readonly');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.get(address);
            
            req.onsuccess = () => {
            resolve(req.result || null);
        };
        
        req.onerror = (e) => {
            console.error("Error getting wallet:", e.target.error);
            reject(e.target.error);
        };
        
        // Prevent transaction from auto-closing
        tx.oncomplete = () => {
            console.log("Transaction completed for getWallet");
        };
        
        tx.onerror = (e) => {
            console.error("Transaction error for getWallet:", e.target.error);
            reject(e.target.error);
        };
        });
    }
async changePassword(address, newPassword, oldPassword) {
    if (!this.db) throw new Error('DB not initialized');
    
    const tx1 = this.db.transaction('wallets', 'readonly');
    const store1 = tx1.objectStore('wallets');
    
    const allWallets = await new Promise((resolve, reject) => {
        const req = store1.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = (err) => reject(err.target.error);
    });
    
    const wallet = allWallets.find(w => w.address === address);
    if (!wallet) {
        console.log("Wallet not found");
        return false;
    }
    
    
    const decryptedData = await decryptData(wallet.ciphertext, oldPassword);
    const reEncryptedData = await encryptData(decryptedData, newPassword);
    
    const updatedWallet = {
        ...wallet,
        ciphertext: reEncryptedData
    };
    
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
