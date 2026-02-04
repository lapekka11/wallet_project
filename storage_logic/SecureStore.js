

export class SecureStore {

    constructor() {
    this.DB_NAME = 'crypto_wallet_store';
    this.DB_VERSION = 2;
    this.db = null;
    
    }


   init() {
        if (this.db) return Promise.resolve(this.db);

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('wallets')) {
                    db.createObjectStore('wallets', { keyPath: 'address' });
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
    }

    async saveWallet(ciphertext, address, key) {
        if (!this.db) throw new Error('DB not initialized');
        const tx = this.db.transaction('wallets', 'readwrite');
        const store = tx.objectStore('wallets');
        return new Promise((resolve, reject) => {
            const req = store.add({ address, ciphertext, key });
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
    await this.initPromise;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.DB_NAME);
      
      request.onsuccess = () => {
        this.db = null;
        resolve();
      };
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
}



export default SecureStore;