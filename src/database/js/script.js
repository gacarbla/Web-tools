class IndexedDBManager {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    async init(schemas) {
        this.db = await this._openDB(schemas);
    }

    _openDB(schemas) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                schemas.forEach((schema) => {
                    if (!db.objectStoreNames.contains(schema.name)) {
                        const store = db.createObjectStore(schema.name, { keyPath: schema.keyPath });
                        if (schema.indices) {
                            schema.indices.forEach((index) => store.createIndex(index.name, index.keyPath, { unique: index.unique }));
                        }
                    }
                });
            };

            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    _transaction(storeName, mode) {
        return this.db.transaction(storeName, mode).objectStore(storeName);
    }

    add(storeName, data) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readwrite');
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    get(storeName, key) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readonly');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    getAll(storeName) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readonly');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    update(storeName, data) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readwrite');
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readwrite');
            const request = store.delete(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
}
