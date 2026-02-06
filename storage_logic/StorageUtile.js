import SecureStore from "./SecureStore"
let allWallets;
let currWallet;
let recentTransactions;
let contactBook;
export class StorageUtils{
    constructor(){
        this.db = new SecureStore();

    }

    async init(){
       if (this.initialized) {
            return this.db;
        }
        
        
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

    async  saveWallet(ciphertext, address, key, name) {
        if (!this.db) throw new Error('DB not initialized');
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
  
  async  saveTransaction(txData, from, to, amountelem) {
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');
      
      const txToSave = {
        
        addressFrom: from,
        addressTo:to,
        savedAt: Date.now(),
        timestamp: txData.timestamp || Date.now(),
        amount: amountelem.value
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

    async changePassword(address, newPassword) {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readwrite');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.get(address);
            req.onsuccess = (e) => {
                const rec = e.target.result;
                if (!rec) return resolve(false);
                rec.key = newPassword;
                const putReq = store.put(rec);
                putReq.onsuccess = () => resolve(true);
                putReq.onerror = (err) => reject(err.target?.error || err);
            };
            req.onerror = (err) => reject(err.target?.error || err);
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
  return (await this.getPreference("selectedNetwork")) || "sepolia";
}

    
}
