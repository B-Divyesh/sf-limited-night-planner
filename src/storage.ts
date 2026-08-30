import type { Plan } from './domain';

export type StorageScope = 'real' | 'demo';

const DB_NAME = 'limited-night-planner';
const DB_VERSION = 1;

function databaseName(scope: StorageScope): string {
  return scope === 'demo' ? `${DB_NAME}-demo` : DB_NAME;
}

function openDatabase(scope: StorageScope): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName(scope), DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('plans')) db.createObjectStore('plans', { keyPath: 'key' });
      if (!db.objectStoreNames.contains('archives')) db.createObjectStore('archives', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Local storage request failed.'));
  });
}

export async function loadCurrentPlan(scope: StorageScope = 'real'): Promise<Plan | null> {
  const db = await openDatabase(scope);
  const tx = db.transaction('plans', 'readonly');
  const record = await requestResult<{ key: string; plan: Plan } | undefined>(tx.objectStore('plans').get('current'));
  db.close();
  return record?.plan ?? null;
}

export async function saveCurrentPlan(plan: Plan, scope: StorageScope = 'real'): Promise<void> {
  const db = await openDatabase(scope);
  const tx = db.transaction('plans', 'readwrite');
  tx.objectStore('plans').put({ key: 'current', plan });
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not save this plan.'));
  });
  db.close();
}

export async function clearCurrentPlan(scope: StorageScope = 'real'): Promise<void> {
  const db = await openDatabase(scope);
  const tx = db.transaction('plans', 'readwrite');
  tx.objectStore('plans').delete('current');
  await new Promise<void>((resolve) => { tx.oncomplete = () => resolve(); });
  db.close();
}

export function clearDemoData(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(databaseName('demo'));
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Could not clear demo storage.'));
    request.onblocked = () => reject(new Error('Demo storage is still open.'));
  });
}

export async function listArchives(scope: StorageScope = 'real'): Promise<Plan[]> {
  const db = await openDatabase(scope);
  const plans = await requestResult<Plan[]>(db.transaction('archives', 'readonly').objectStore('archives').getAll());
  db.close();
  return plans.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function archivePlan(plan: Plan, scope: StorageScope = 'real'): Promise<void> {
  const db = await openDatabase(scope);
  const copy = structuredClone(plan);
  copy.id = crypto.randomUUID();
  copy.updatedAt = new Date().toISOString();
  const tx = db.transaction('archives', 'readwrite');
  tx.objectStore('archives').put(copy);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Could not archive this plan.'));
  });
  db.close();
}

export async function deleteArchive(id: string, scope: StorageScope = 'real'): Promise<void> {
  const db = await openDatabase(scope);
  const tx = db.transaction('archives', 'readwrite');
  tx.objectStore('archives').delete(id);
  await new Promise<void>((resolve) => { tx.oncomplete = () => resolve(); });
  db.close();
}
