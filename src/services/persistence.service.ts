
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  setItem(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (e) {
      console.error('Error getting from localStorage', e);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch(e) {
        console.error('Error removing from localStorage', e);
    }
  }
}
