const STORAGE_NAME = "content_visualized";

const storage = (typeof browser !== "undefined" && browser.storage) || chrome.storage;

export const storageWrapper = {
  async get(): Promise<StorageData> {
    return new Promise((resolve) => {
      storage.local.get([STORAGE_NAME], (result: any) => {
        resolve(result[STORAGE_NAME] ?? []);
      });
    });
  },

  async set(data: StorageData): Promise<void> {
    return new Promise((resolve) => {
      storage.local.set({ [STORAGE_NAME]: data }, () => resolve());
    });
  },
};


export class Database {
  static #instance: Database;

  private constructor() { }

  public static get instance(): Database {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }

    return this.#instance;
  }

  public async get(): Promise<StorageData> {
    // const result = localStorage.getItem(STORAGE_NAME);

    // if (result == null) {
    //   this.update([]);
    //   return [];
    // }

    // return JSON.parse(result) as StorageData

    return await storageWrapper.get();
  }

  public async update(data: StorageData): Promise<void> {
    // localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
    await storageWrapper.set(data);
  }
}