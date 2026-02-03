

class SecureStore {

    constructor() {
    this.DB_NAME = 'crypto_wallet_store';
    this.DB_VERSION = 2;
    this.db = null;
    this.initPromies = this.init();
    }


    async init() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

        request.onerror = (event) => {
        console.error('RIP DB error:', event.target.errorCode);
        reject(event.target.errorCode);
        }
        request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
        }
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('wallets')) {
               const walletStore = db.createObjectStore('wallets', { keyPath: 'address'});
               walletStore.createIndex('created_at', 'created_at', { unique: false });
            }

        // Transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const store = db.createObjectStore('transactions', { 
            keyPath: 'hash',
            autoIncrement: false 
          });
          store.createIndex('from_address', 'from', { unique: false });
          store.createIndex('to_address', 'to', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('address_timestamp', ['from', 'timestamp'], { unique: false });
        }
        
        // Preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          const store = db.createObjectStore('preferences', { keyPath: 'id' });
        }
        
        // Tokens store (ERC-20 tokens)
        if (!db.objectStoreNames.contains('tokens')) {
          const store = db.createObjectStore('tokens', { 
            keyPath: ['address', 'networkId'] 
          });
          store.createIndex('networkId', 'networkId', { unique: false });
        }
        
        // Contact Address store
        if (!db.objectStoreNames.contains('contacts')) {
          const store = db.createObjectStore('contacts', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          store.createIndex('address', 'address', { unique: true });
        }
      };
    });
  }
  
  async saveWallet(encryptedWallet) {
    await this.initPromise;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['wallets'], 'readwrite');
      const store = transaction.objectStore('wallets');
      
      const walletData = {
        ...encryptedWallet,
        address: encryptedWallet.address,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      const request = store.put(walletData);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getWallet(address) {
    await this.initPromise;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['wallets'], 'readonly');
      const store = transaction.objectStore('wallets');
      const request = store.get(address);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAllWallets() {
    await this.initPromise;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['wallets'], 'readonly');
      const store = transaction.objectStore('wallets');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
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
}

export default SecureStore;