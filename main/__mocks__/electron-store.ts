class Store {

  public store = { };

  constructor(public options: any) { }
  
  clear(): void {
    this.store = { };
  }

  delete(key): void {
    delete this.store[key];
  }

  get(key, defaultValue = null): any {
    return this.store[key] ?? defaultValue;
  }

  has(key): boolean {
    return !!this.store[key];
  }

  set(key, value?): void {
    if (!value)
      Object.assign(this.store, key);
    else this.store[key] = value;
  }

}

export = Store;
