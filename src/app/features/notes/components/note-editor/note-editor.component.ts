import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../../../core/services/notes.service';
import { NoteColor } from '../../../../core/models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)" role="dialog" aria-modal="true" aria-label="Note Editor">
      <div
        class="editor-modal"
        [class]="'color-' + selectedColor"
        (click)="$event.stopPropagation()"
      >
        <!-- EDITOR TOP TOOLBAR -->
        <div class="editor-header">
          <div class="color-picker" aria-label="Select sticky note color">
            @for (c of availableColors; track c.name) {
              <button
                type="button"
                class="color-pill"
                [class]="'color-' + c.name"
                [class.selected]="selectedColor === c.name"
                (click)="selectedColor = c.name"
                [title]="c.label + ' sticky paper'"
                [attr.aria-label]="c.label + ' sticky paper'"
              >
                @if (selectedColor === c.name) {
                  <span class="color-check">✓</span>
                }
              </button>
            }
          </div>

          <div class="editor-header-actions">
            <!-- Pin Toggle -->
            <button
              type="button"
              class="editor-icon-btn"
              [class.active]="isPinned"
              (click)="isPinned = !isPinned"
              [title]="isPinned ? 'Unpin note' : 'Pin note to top'"
              [attr.aria-label]="isPinned ? 'Unpin note' : 'Pin note to top'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="isPinned ? '#111111' : 'none'" stroke="#111111" stroke-width="2.5">
                <line x1="12" y1="17" x2="12" y2="22"></line>
                <path d="M5 17h14l-1.5-6H6.5L5 17z"></path>
                <path d="M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"></path>
              </svg>
            </button>

            <!-- Close Modal -->
            <button
              type="button"
              class="editor-icon-btn close-btn"
              (click)="close()"
              title="Close editor (Esc)"
              aria-label="Close editor"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- EDITOR INPUT FIELDS -->
        <div class="editor-body">
          <input
            #titleInput
            type="text"
            class="title-input"
            placeholder="Note title..."
            [(ngModel)]="title"
            aria-label="Note Title"
          />

          <textarea
            class="content-textarea"
            placeholder="Write your thoughts..."
            [(ngModel)]="content"
            aria-label="Note Content"
          ></textarea>
        </div>

        <!-- TAGS MANAGER SECTION -->
        <div class="tags-manager">
          <label class="tags-label">TAGS:</label>
          <div class="tags-pills-list">
            @for (tag of tags; track tag) {
              <span class="editor-tag-pill">
                #{{ tag }}
                <button type="button" class="remove-tag-btn" (click)="removeTag(tag)">✕</button>
              </span>
            }
            <input
              type="text"
              class="add-tag-input"
              placeholder="+ Add tag (press Enter)..."
              [(ngModel)]="newTagInput"
              (keydown.enter)="addTag($event)"
              (keydown.comma)="addTag($event)"
            />
          </div>
        </div>

        <!-- EDITOR FOOTER BAR -->
        <div class="editor-footer">
          <div class="footer-left">
            @if (editingNoteId) {
              <button
                type="button"
                class="btn-brutal btn-brutal-danger delete-note-btn"
                (click)="deleteCurrentNote()"
              >
                Delete
              </button>
              <button
                type="button"
                class="btn-brutal btn-brutal-secondary archive-note-btn"
                (click)="toggleCurrentArchive()"
              >
                {{ isArchived ? 'Unarchive' : 'Archive' }}
              </button>
            }
          </div>

          <div class="footer-right">
            <span class="shortcut-tip">
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to save
            </span>

            <button type="button" class="btn-brutal btn-brutal-secondary" (click)="close()">
              Cancel
            </button>

            <button type="button" class="btn-brutal save-btn" (click)="save()">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(17, 17, 17, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1rem;
      backdrop-filter: blur(2px);
    }

    .editor-modal {
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      border: 4px solid #111111;
      box-shadow: 8px 8px 0px #111111;
      padding: 1.25rem;
      gap: 1rem;
      animation: modalPop 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes modalPop {
      from {
        transform: scale(0.96) translateY(10px);
        opacity: 0;
      }
      to {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    }

    /* Note Color Themes */
    .color-yellow { background-color: var(--note-yellow-bg); }
    .color-orange { background-color: var(--note-orange-bg); }
    .color-green { background-color: var(--note-green-bg); }
    .color-blue { background-color: var(--note-blue-bg); }
    .color-pink { background-color: var(--note-pink-bg); }
    .color-cream { background-color: var(--note-cream-bg); }

    .editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #111111;
    }

    .color-picker {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .color-pill {
      width: 28px;
      height: 28px;
      border: 2px solid #111111;
      box-shadow: 2px 2px 0px #111111;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 100ms ease;
    }

    .color-pill:hover {
      transform: scale(1.1);
    }

    .color-pill.selected {
      border-width: 3px;
      box-shadow: 3px 3px 0px #111111;
    }

    .color-check {
      font-size: 0.85rem;
      font-weight: 900;
      color: #111111;
    }

    .editor-header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .editor-icon-btn {
      width: 32px;
      height: 32px;
      background: #ffffff;
      border: 2px solid #111111;
      box-shadow: 2px 2px 0px #111111;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      cursor: pointer;
      color: #111111;
    }

    .editor-icon-btn:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px #111111;
    }

    .editor-icon-btn.active {
      background-color: var(--accent-yellow);
    }

    .close-btn:hover {
      background-color: var(--accent-red);
      color: #ffffff;
    }

    .editor-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
      min-height: 240px;
    }

    .title-input {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 700;
      color: #111111;
      background: rgba(255, 255, 255, 0.6);
      border: 2.5px solid #111111;
      box-shadow: 3px 3px 0px #111111;
      padding: 0.6rem 0.8rem;
      outline: none;
    }

    .title-input:focus {
      background: #ffffff;
      box-shadow: 4px 4px 0px #111111;
    }

    .content-textarea {
      flex: 1;
      min-height: 200px;
      font-family: var(--font-body);
      font-size: 1rem;
      line-height: 1.5;
      color: #111111;
      background: rgba(255, 255, 255, 0.6);
      border: 2.5px solid #111111;
      box-shadow: 3px 3px 0px #111111;
      padding: 0.8rem;
      outline: none;
      resize: vertical;
    }

    .content-textarea:focus {
      background: #ffffff;
      box-shadow: 4px 4px 0px #111111;
    }

    .tags-manager {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.7);
      border: 2px solid #111111;
      padding: 0.5rem 0.75rem;
    }

    .tags-label {
      font-family: var(--font-heading);
      font-size: 0.8rem;
      font-weight: 700;
      color: #111111;
    }

    .tags-pills-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.4rem;
      flex: 1;
    }

    .editor-tag-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      background: #ffffff;
      border: 1.5px solid #111111;
      padding: 0.15rem 0.4rem;
      box-shadow: 1.5px 1.5px 0px #111111;
    }

    .remove-tag-btn {
      background: transparent;
      border: none;
      font-weight: 700;
      cursor: pointer;
      color: #ef4444;
      font-size: 0.75rem;
      padding: 0 0.1rem;
    }

    .add-tag-input {
      border: none;
      background: transparent;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      outline: none;
      color: #111111;
      flex: 1;
      min-width: 140px;
    }

    .editor-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 2px solid #111111;
      gap: 1rem;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .footer-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-left: auto;
    }

    .shortcut-tip {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #555555;
    }

    .shortcut-tip kbd {
      background: #ffffff;
      border: 1px solid #111111;
      padding: 0.1rem 0.3rem;
      font-weight: 700;
    }

    @media (max-width: 640px) {
      .editor-modal {
        max-height: 96vh;
        padding: 0.8rem;
      }

      .shortcut-tip {
        display: none;
      }
    }
  `]
})
export class NoteEditorComponent implements OnInit {
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  editingNoteId: string | null = null;
  title: string = '';
  content: string = '';
  selectedColor: NoteColor = 'yellow';
  tags: string[] = [];
  isPinned: boolean = false;
  isArchived: boolean = false;
  newTagInput: string = '';

  readonly availableColors: { name: NoteColor; label: string }[] = [
    { name: 'yellow', label: 'Yellow' },
    { name: 'orange', label: 'Orange' },
    { name: 'green', label: 'Green' },
    { name: 'blue', label: 'Blue' },
    { name: 'pink', label: 'Pink' },
    { name: 'cream', label: 'Cream' },
  ];

  constructor(public notesService: NotesService) {}

  ngOnInit(): void {
    const note = this.notesService.editingNote();
    if (note) {
      this.editingNoteId = note.id;
      this.title = note.title;
      this.content = note.content;
      this.selectedColor = note.color;
      this.tags = [...note.tags];
      this.isPinned = note.pinned;
      this.isArchived = note.archived;
    }

    // Auto-focus title input on opening
    setTimeout(() => {
      this.titleInput?.nativeElement?.focus();
    }, 50);
  }

  addTag(event: Event): void {
    event.preventDefault();
    const cleanTag = this.newTagInput.replace(/,/g, '').trim().toLowerCase();
    if (cleanTag && !this.tags.includes(cleanTag)) {
      this.tags.push(cleanTag);
    }
    this.newTagInput = '';
  }

  removeTag(tagToRemove: string): void {
    this.tags = this.tags.filter((t) => t !== tagToRemove);
  }

  save(): void {
    // If there's pending text in add-tag input, include it
    if (this.newTagInput.trim()) {
      const clean = this.newTagInput.replace(/,/g, '').trim().toLowerCase();
      if (clean && !this.tags.includes(clean)) {
        this.tags.push(clean);
      }
    }

    this.notesService.saveEditingNote({
      title: this.title,
      content: this.content,
      color: this.selectedColor,
      tags: this.tags,
      pinned: this.isPinned,
      archived: this.isArchived,
    });
  }

  close(): void {
    this.notesService.closeEditor();
  }

  deleteCurrentNote(): void {
    if (this.editingNoteId) {
      this.notesService.deleteNote(this.editingNoteId);
    }
  }

  toggleCurrentArchive(): void {
    this.isArchived = !this.isArchived;
  }

  onBackdropClick(event: MouseEvent): void {
    // Only close if user clicked directly on backdrop (not inside modal)
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    if (!this.notesService.isEditorOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.save();
    }
  }
}
