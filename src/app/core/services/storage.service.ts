import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';

const STORAGE_KEY = 'sticky_notes_app_data_v1';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private isAvailable: boolean = true;

  constructor() {
    this.checkAvailability();
  }

  private checkAvailability(): void {
    try {
      const testKey = '__sticky_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      this.isAvailable = true;
    } catch {
      this.isAvailable = false;
    }
  }

  public getIsAvailable(): boolean {
    return this.isAvailable;
  }

  public loadNotes(): Note[] | null {
    if (!this.isAvailable) {
      return null;
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Basic schema sanitization to prevent runtime crashes
        return parsed.map((item) => ({
          id: String(item.id || Date.now().toString()),
          title: String(item.title || ''),
          content: String(item.content || ''),
          color: item.color || 'yellow',
          tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
          pinned: Boolean(item.pinned),
          archived: Boolean(item.archived),
          createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
          updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : Date.now(),
        }));
      }
      return null;
    } catch (error) {
      console.error('Failed to load notes from LocalStorage:', error);
      return null;
    }
  }

  public saveNotes(notes: Note[]): { success: boolean; error?: string } {
    if (!this.isAvailable) {
      return { success: false, error: 'LocalStorage is not supported or restricted in your browser.' };
    }

    try {
      const serialized = JSON.stringify(notes);
      localStorage.setItem(STORAGE_KEY, serialized);
      return { success: true };
    } catch (error) {
      console.error('Failed to save notes to LocalStorage:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Storage limit reached or permission denied.',
      };
    }
  }

  public clearStorage(): void {
    if (this.isAvailable) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
    }
  }
}
