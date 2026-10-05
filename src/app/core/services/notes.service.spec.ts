import { TestBed } from '@angular/core/testing';
import { NotesService } from './notes.service';
import { StorageService } from './storage.service';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesService);
  });

  it('should be created and load seed data when storage empty', () => {
    expect(service).toBeTruthy();
    expect(service.notes().length).toBeGreaterThan(0);
  });

  it('should create new note editor draft', () => {
    service.openNewNoteEditor('ideas');
    expect(service.isEditorOpen()).toBe(true);
    expect(service.editingNote()).toBeTruthy();
    expect(service.editingNote()?.tags).toContain('ideas');
  });

  it('should save a new note and update computed counts', () => {
    const initialCount = service.notes().length;
    service.openNewNoteEditor();
    service.saveEditingNote({
      title: 'Test Note',
      content: 'Testing content saving functionality.',
      color: 'yellow',
      tags: ['test'],
    });

    expect(service.notes().length).toBe(initialCount + 1);
    expect(service.notes()[0].title).toBe('Test Note');
  });

  it('should toggle pin state of note', () => {
    const firstNote = service.notes()[0];
    const initialPinned = firstNote.pinned;
    service.togglePin(firstNote.id);
    const updated = service.notes().find((n) => n.id === firstNote.id);
    expect(updated?.pinned).toBe(!initialPinned);
  });

  it('should delete note and support undo', () => {
    const firstNote = service.notes()[0];
    const initialCount = service.notes().length;
    service.deleteNote(firstNote.id);
    expect(service.notes().length).toBe(initialCount - 1);
    expect(service.deletedToast()).toBeTruthy();

    service.undoDelete();
    expect(service.notes().length).toBe(initialCount);
    expect(service.deletedToast()).toBe(null);
  });
});
