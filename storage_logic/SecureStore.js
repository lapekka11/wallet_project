export class SecureStore {

    constructor() {
        // unified names
        this.dbName = 'crypto_wallet_store';
        this.dbVersion = 2;
        this.db = null;
        this.initPromise = null;
    }

    init() {
        if (this.initPromise) return this.initPromise;
        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('wallets')) {
                    db.createObjectStore('wallets', { keyPath: 'address' });
                }
                if (!db.objectStoreNames.contains('transactions')) {
                    const txStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
                    txStore.createIndex('address_timestamp', ['address', 'timestamp']);
                }
                if (!db.objectStoreNames.contains('preferences')) {
                    db.createObjectStore('preferences', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onblocked = () => {
                console.warn('IndexedDB open blocked');
            };
        });

        return this.initPromise;
    }

    async deleteWallet(address){
       if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readwrite');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.delete(address);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async saveWallet(ciphertext, address, key, name) {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readwrite');
        const store = tx.objectStore('wallets');

        return new Promise((resolve, reject) => {
            const req = store.add({ address, ciphertext, key, name });
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }
  
  async getAllWallets() {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readonly');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject(e.target.error);
        });
    }
  
  async saveTransaction(txData) {
    await this.initPromise;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['transactions'], 'readwrite');
      const store = transaction.objectStore('transactions');
      
      const txToSave = {
        ...txData,
        savedAt: Date.now()
      };
      
      const request = store.put(txToSave);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getTransactionsByAddress(address, limit = 50) {
    await this.initPromise;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['transactions'], 'readonly');
      const store = transaction.objectStore('transactions');
      const index = store.index('address_timestamp');
      
      // Get transactions where 'from' = address
      const keyRange = IDBKeyRange.bound(
        [address, 0],
        [address, Date.now()]
      );
      
      const request = index.getAll(keyRange);
      
      request.onsuccess = () => {
        const txs = request.result
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
        resolve(txs);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  async savePreference(key, value) {
    await this.initPromise;
    
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
    await this.initPromise;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['preferences'], 'readonly');
      const store = transaction.objectStore('preferences');
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }
  
 async clearDatabase() {
    if (this.db) {
      try { this.db.close(); } catch (e) { }
      this.db = null;
    }
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(this.dbName);
      req.onsuccess = () => {
        console.log(`Database ${this.dbName} deleted`);
        this.initPromise = null;
        this.db = null;
        resolve();
      };
      req.onerror = (e) => reject(e.target.error);
      req.onblocked = () => {
        console.warn('Deletion blocked — other tabs/connections open');
        reject(new Error('Database deletion blocked. Close other tabs/connections.'));
      };
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
}
export default SecureStore;