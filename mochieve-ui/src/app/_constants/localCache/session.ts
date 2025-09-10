class PersistentSessionCache {
  private static instance: PersistentSessionCache;
  private cache: Map<string, any>;

  private constructor() {
    this.cache = new Map<string, any>();
    this.loadFromSessionStorage();
  }

  public static getInstance(): PersistentSessionCache {
    if (!PersistentSessionCache.instance) {
      PersistentSessionCache.instance = new PersistentSessionCache();
    }
    return PersistentSessionCache.instance;
  }

  private loadFromSessionStorage() {
    const raw = localStorage.getItem('sessionCache');
    if (raw) {
      try {
        const obj = JSON.parse(raw);
        Object.entries(obj).forEach(([key, value]) => {
          this.cache.set(key, value);
        });
      } catch {}
    }
  }

  private saveToSessionStorage() {
    const obj: Record<string, any> = {};
    this.cache.forEach((value, key) => {
      obj[key] = value;
    });
    localStorage.setItem('sessionCache', JSON.stringify(obj));
  }

  public get<T>(key: string): T | undefined {
    const cached = this.cache.get(key);
    if (cached) {
      if (cached.expire === 0 || cached.expire > Date.now()) {
        return cached.data as T;
      }
      this.cache.delete(key);
      this.saveToSessionStorage();
    }
    return undefined;
  }

  public set(key: string, value: any, expire: number = 0): void {
    const expireAt = expire ? Date.now() + expire : 0;
    this.cache.set(key, { data: value, expire: expireAt });
    this.saveToSessionStorage();
  }

  public delete(key: string): void {
    this.cache.delete(key);
    this.saveToSessionStorage();
  }
}

class StorageCache <T>{
  private key: string;
  private maxSize: number;
  private expire: number; // in seconds

  constructor(key: string, maxSize: number, expire: number = 0) {
    this.key = key;
    this.maxSize = maxSize;
    this.expire = expire;
  }

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public get(): T | undefined {
    if (!this.isClient()) return undefined;

    const cacheStr = localStorage.getItem(this.key);
    if (!cacheStr) return undefined;
    try {
        const cache = JSON.parse(cacheStr);
        if (cache.expire === 0 || cache.expire > Date.now()) {
          return cache.data as T;
        }
        localStorage.removeItem(this.key);
    } catch {}
  }

  public set(value: T): void {
    if (!this.isClient()) return;

    const expireAt = this.expire ? (Date.now() + this.expire) : 0;
    const cache = { data: value, expire: expireAt };
    localStorage.setItem(this.key, JSON.stringify(cache));
  }

  public clear(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.key);
  }
}