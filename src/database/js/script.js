/**
 * @typedef {Object} Schema
 * @property {string} name - The name of the element to be replaced.
 * @property {string} style - The styles to be inserted for the element.
 * @property {string} value - The new HTML structure to replace the original element.
 * @property {function} [beforeCreate] - Function to execute before creating the new element.
 * @property {function} [onClick] - Function to execute when the new element is clicked.
 * @property {function} [onInput] - Function to execute when text is input in the new element.
 * @property {function} [afterCreate] - Function to execute after the new element is created.
 */

/**
 * IndexedDBManager class to manage the databases indexed on the user navigator
 */
class IndexedDBManager {
    /**
     * 
     * @param {string} dbName - Database name
     * @param {number} version - Database version
     */
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    /**
     * 
     * @param {Schema[]} schemas - Database schemas
     */
    async init(schemas) {
        this.db = await this._openDB(schemas);
    }

    /**
     * 
     * @param {Schema[]} schemas - Database schemas
     * @returns 
     */
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

    /**
     * 
     * @param {string} storeName 
     * @param {string} mode 
     * @returns 
     */
    _transaction(storeName, mode) {
        return this.db.transaction(storeName, mode).objectStore(storeName);
    }

    /**
     * 
     * @param {string} storeName - Table name
     * @param {Object} data - Data to be stored on the table
     * @returns
     */
    add(storeName, data) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readwrite');
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * 
     * @param {string} storeName - Table name
     * @param {string} key - Data to be getted on the table
     * @returns 
     */
    get(storeName, key) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readonly');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * 
     * @param {string} storeName 
     * @returns 
     */
    getAll(storeName) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readonly');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * 
     * @param {string} storeName 
     * @param {Object} data 
     * @returns 
     */
    update(storeName, data) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readwrite');
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * 
     * @param {string} storeName 
     * @param {string} key 
     * @returns 
     */
    delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const store = this._transaction(storeName, 'readwrite');
            const request = store.delete(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
}
