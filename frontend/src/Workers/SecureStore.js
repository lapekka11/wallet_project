export class SecureStore {

    constructor() {
        // unified names
        this.dbName = 'crypto_wallet_store';
        this.dbVersion = 2;
        this.db1 = null;
        this.initPromise = null;
    }

    init() {
        if (this.initPromise) return this.initPromise;
        this.initPromise = new Promise((resolve, reject) => {
            const request = self.indexedDB.open(this.dbName, this.dbVersion);

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
                this.db1 = event.target.result;
                resolve(this.db1);
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


  
 async clearDatabase() {
    if (this.db) {
      try { this.db.close(); } catch (e) { }
      this.db1 = null;
    }
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(this.dbName);
      req.onsuccess = () => {
        console.log(`Database ${this.dbName} deleted`);
        this.initPromise = null;
        this.db1 = new SecureStore();
        const newDb = this.db1.init();
        resolve(newDb);
      };
      req.onerror = (e) => reject(e.target.error);
      req.onblocked = () => {
        console.warn('Deletion blocked — other tabs/connections open');
        location.reload();
        window.router.navigate("/");
      };
    });
  }

    
}
export default SecureStore;