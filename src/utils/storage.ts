const PREFIX = "VUE_ADMIN_";

interface StorageData<T> {
  value: T;
  expire?: number;
}

class Storage {
  private storage: globalThis.Storage;

  constructor(storage: globalThis.Storage) {
    this.storage = storage;
  }

  private getKey(key: string): string {
    return PREFIX + key;
  }

  set<T>(key: string, value: T, expire?: number): void {
    const data: StorageData<T> = {
      value,
      expire: expire ? Date.now() + expire * 1000 : undefined
    };
    this.storage.setItem(this.getKey(key), JSON.stringify(data));
  }

  get<T>(key: string): T | null {
    const data = this.storage.getItem(this.getKey(key));
    if (!data) return null;

    try {
      const { value, expire }: StorageData<T> = JSON.parse(data);
      if (expire && expire < Date.now()) {
        this.remove(key);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  clear(): void {
    this.storage.clear();
  }
}

export const localCache = new Storage(localStorage);
export const sessionCache = new Storage(sessionStorage);
export default localCache;
