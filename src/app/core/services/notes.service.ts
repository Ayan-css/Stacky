import { Injectable, signal, computed, effect } from '@angular/core';
import { Note, NoteColor, FilterCategory, SortOption, TagWithCount } from '../models/note.model';
import { StorageService } from './storage.service';

const SEED_NOTES: Note[] = [
  {
    id: 'seed-1',
    title: 'PROJECT IDEAS',
    content: 'Build a lightweight sticky note app in Angular with neo-brutalist styling.\n\n• Zero complex SaaS clutter\n• Pure keyboard velocity\n• Fast browser LocalStorage persistence\n• High contrast tactile aesthetics',
    color: 'yellow',
    tags: ['projects', 'ideas'],
    pinned: true,
    archived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    updatedAt: Date.now() - 1000 * 60 * 15, // 15 mins ago
  },
  {
    id: 'seed-2',
    title: 'READING LIST',
    content: '1. Designing Data-Intensive Applications\n2. Refactoring UI (Wathan & Schoger)\n3. Angular Signals & State Patterns\n4. Neo-Brutalism Design Systems Manual',
    color: 'blue',
    tags: ['reading', 'books'],
    pinned: true,
    archived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
  },
  {
    id: 'seed-3',
    title: 'WEEKLY GOALS',
    content: 'Finalize college Angular project submissions.\n• Ensure zero console errors\n• Test mobile layout drawer & full screen editor\n• Validate offline support & LocalStorage recovery',
    color: 'orange',
    tags: ['work', 'college'],
    pinned: false,
    archived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 1, // 1 hour ago
  },
  {
    id: 'seed-4',
    title: 'QUICK SHORTCUTS',
    content: 'Press [N] anywhere to spawn a new note.\nPress [/] to jump to instant search.\nPress Ctrl+Enter inside editor to save.\nPress Esc to cancel or close.',
    color: 'cream',
    tags: ['tips'],
    pinned: false,
    archived: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  // State Signals
  readonly notes = signal<Note[]>([]);
  readonly selectedCategory = signal<FilterCategory>('all');
  readonly selectedTag = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  readonly sortBy = signal<SortOption>('updated-desc');

  // Editor Signals
  readonly isEditorOpen = signal<boolean>(false);
  readonly editingNote = signal<Note | null>(null);

  // Toast Signal for Undo
  readonly deletedToast = signal<{ note: Note; timerId: any } | null>(null);

  // Storage warning signal
  readonly storageError = signal<string | null>(null);

  constructor(private storageService: StorageService) {
    this.initNotes();

    // Automatically persist changes to LocalStorage whenever notes change
    effect(() => {
      const currentNotes = this.notes();
      if (currentNotes.length > 0 || this.storageService.loadNotes() !== null) {
        const result = this.storageService.saveNotes(currentNotes);
        if (!result.success) {
          this.storageError.set(result.error || 'Failed to save notes to LocalStorage.');
        } else {
          this.storageError.set(null);
        }
      }
    });
  }

  private initNotes(): void {
    if (!this.storageService.getIsAvailable()) {
      this.storageError.set('LocalStorage is unavailable. Changes will not persist after page refresh.');
      this.notes.set(SEED_NOTES);
      return;
    }

    const savedNotes = this.storageService.loadNotes();
    if (savedNotes && savedNotes.length > 0) {
      this.notes.set(savedNotes);
    } else {
      // Seed data for initial launch
      this.notes.set(SEED_NOTES);
      this.storageService.saveNotes(SEED_NOTES);
    }
  }

  // Computed Values
  readonly counts = computed(() => {
    const list = this.notes();
    return {
      all: list.filter((n) => !n.archived).length,
      pinned: list.filter((n) => !n.archived && n.pinned).length,
      archived: list.filter((n) => n.archived).length,
    };
  });

  readonly allTags = computed<TagWithCount[]>(() => {
    const list = this.notes().filter((n) => !n.archived);
    const tagMap = new Map<string, number>();
    list.forEach((n) => {
      n.tags.forEach((tag) => {
        const normalized = tag.toLowerCase().trim();
        if (normalized) {
          tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
        }
      });
    });

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  });

  readonly filteredNotes = computed(() => {
    const category = this.selectedCategory();
    const tag = this.selectedTag();
    const query = this.searchQuery().toLowerCase().trim();
    const sort = this.sortBy();

    let result = this.notes();

    // 1. Category filter
    if (category === 'all') {
      result = result.filter((n) => !n.archived);
    } else if (category === 'pinned') {
      result = result.filter((n) => !n.archived && n.pinned);
    } else if (category === 'archived') {
      result = result.filter((n) => n.archived);
    }

    // 2. Tag filter
    if (tag) {
      result = result.filter((n) => n.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }

    // 3. Search query filter
    if (query) {
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          n.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // 4. Sorting
    result = [...result].sort((a, b) => {
      // In 'all' category without search query, pinned notes come first!
      if (category === 'all' && !query && a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      switch (sort) {
        case 'updated-desc':
          return b.updatedAt - a.updatedAt;
        case 'created-desc':
          return b.createdAt - a.createdAt;
        case 'created-asc':
          return a.createdAt - b.createdAt;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

    return result;
  });

  // Action Methods
  openNewNoteEditor(initialTag?: string): void {
    const newNote: Note = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: '',
      content: '',
      color: 'yellow',
      tags: initialTag ? [initialTag] : [],
      pinned: false,
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.editingNote.set(newNote);
    this.isEditorOpen.set(true);
  }

  openEditNoteEditor(note: Note): void {
    // Pass a copy so editing doesn't mutate before saving
    this.editingNote.set({ ...note, tags: [...note.tags] });
    this.isEditorOpen.set(true);
  }

  closeEditor(): void {
    this.isEditorOpen.set(false);
    this.editingNote.set(null);
  }

  saveEditingNote(noteData: Partial<Note>): void {
    const current = this.editingNote();
    if (!current) return;

    const title = (noteData.title || '').trim();
    const content = (noteData.content || '').trim();

    // Don't save completely empty notes unless user typed something
    if (!title && !content) {
      this.closeEditor();
      return;
    }

    const updatedNote: Note = {
      ...current,
      title: title || 'Untitled Note',
      content: content,
      color: noteData.color || current.color,
      tags: noteData.tags || current.tags,
      pinned: noteData.pinned !== undefined ? noteData.pinned : current.pinned,
      archived: noteData.archived !== undefined ? noteData.archived : current.archived,
      updatedAt: Date.now(),
    };

    const existingIndex = this.notes().findIndex((n) => n.id === updatedNote.id);
    if (existingIndex >= 0) {
      const updatedList = [...this.notes()];
      updatedList[existingIndex] = updatedNote;
      this.notes.set(updatedList);
    } else {
      this.notes.set([updatedNote, ...this.notes()]);
    }

    this.closeEditor();
  }

  deleteNote(id: string): void {
    const noteToDelete = this.notes().find((n) => n.id === id);
    if (!noteToDelete) return;

    // Remove from notes list
    this.notes.set(this.notes().filter((n) => n.id !== id));

    // Close editor if editing this note
    if (this.editingNote()?.id === id) {
      this.closeEditor();
    }

    // Clear previous toast timer if any
    const prevToast = this.deletedToast();
    if (prevToast) {
      clearTimeout(prevToast.timerId);
    }

    // Set new undo toast with 6s timeout
    const timerId = setTimeout(() => {
      this.deletedToast.set(null);
    }, 6000);

    this.deletedToast.set({ note: noteToDelete, timerId });
  }

  undoDelete(): void {
    const toast = this.deletedToast();
    if (!toast) return;

    clearTimeout(toast.timerId);
    this.notes.set([toast.note, ...this.notes()]);
    this.deletedToast.set(null);
  }

  dismissToast(): void {
    const toast = this.deletedToast();
    if (toast) {
      clearTimeout(toast.timerId);
      this.deletedToast.set(null);
    }
  }

  togglePin(id: string): void {
    this.notes.set(
      this.notes().map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n
      )
    );
  }

  toggleArchive(id: string): void {
    this.notes.set(
      this.notes().map((n) =>
        n.id === id ? { ...n, archived: !n.archived, updatedAt: Date.now() } : n
      )
    );
  }

  updateNoteColor(id: string, color: NoteColor): void {
    this.notes.set(
      this.notes().map((n) =>
        n.id === id ? { ...n, color, updatedAt: Date.now() } : n
      )
    );
  }

  setCategory(category: FilterCategory): void {
    this.selectedCategory.set(category);
    this.selectedTag.set(null); // reset tag selection when category changes
  }

  setTag(tag: string | null): void {
    this.selectedTag.set(tag);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setSortBy(sort: SortOption): void {
    this.sortBy.set(sort);
  }

  resetSeedData(): void {
    this.notes.set(SEED_NOTES);
  }
}
