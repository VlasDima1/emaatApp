const DB_NAME = 'eMaatDB';
const STORE_NAME = 'assets';
const VERSION = 1;

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Check if IndexedDB is supported
    if (!('indexedDB' in window)) {
      reject("IndexedDB not supported");
      return;
    }

    const request = indexedDB.open(DB_NAME, VERSION);
    
    request.onerror = () => reject(`Error opening IndexedDB: ${request.error}`);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const setAsset = async (key: string, value: string): Promise<void> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(`Error writing to IndexedDB: ${request.error}`);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => reject(`Transaction error writing to IndexedDB: ${transaction.error}`);
    } catch (error) {
        db.close();
        reject(error);
    }
  });
};

export const getAsset = async (key: string): Promise<string | undefined> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result as string | undefined);
      request.onerror = () => reject(`Error reading from IndexedDB: ${request.error}`);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => reject(`Transaction error reading from IndexedDB: ${transaction.error}`);
    } catch (error) {
        db.close();
        reject(error);
    }
  });
};

export const clearDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => {
      console.log("Database deleted successfully");
      resolve();
    };
    request.onerror = (event) => {
      console.error("Error deleting database:", event);
      reject(`Error deleting database: ${request.error}`);
    };
    request.onblocked = () => {
        // This can happen if other tabs have the DB open. The page reload will likely fix this.
        console.warn("Database deletion blocked. Please close other tabs with this app open.");
        resolve();
    };
  });
};
