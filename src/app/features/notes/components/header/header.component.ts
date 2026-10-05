import { Component, ElementRef, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../../../core/services/notes.service';
import { SortOption } from '../../../../core/models/note.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="sticky-header">
      <div class="header-left">
        <button
          type="button"
          class="mobile-menu-btn btn-brutal-icon"
          (click)="toggleSidebar.emit()"
          aria-label="Toggle Navigation Drawer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="brand">
          <div class="brand-logo">STICKY</div>
          <span class="brand-sub">v1.0</span>
        </div>
      </div>

      <div class="header-center">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          
          <input
            #searchInput
            type="text"
            class="search-input"
            placeholder="Search notes, tags... (Press '/' to focus)"
            [ngModel]="notesService.searchQuery()"
            (ngModelChange)="notesService.setSearchQuery($event)"
            aria-label="Search notes"
          />

          @if (notesService.searchQuery()) {
            <button
              type="button"
              class="clear-search-btn"
              (click)="notesService.setSearchQuery('')"
              aria-label="Clear search query"
            >
              ✕
            </button>
          } @else {
            <kbd class="search-kbd">/</kbd>
          }
        </div>
      </div>

      <div class="header-right">
        <div class="sort-wrapper">
          <label for="sort-select" class="sr-only">Sort notes by</label>
          <select
            id="sort-select"
            class="sort-select"
            [ngModel]="notesService.sortBy()"
            (ngModelChange)="onSortChange($event)"
          >
            <option value="updated-desc">⚡ Recently Updated</option>
            <option value="created-desc">✨ Recently Created</option>
            <option value="created-asc">⏳ Oldest First</option>
            <option value="title-asc">🔤 Alphabetical (A-Z)</option>
          </select>
        </div>

        <button
          type="button"
          class="btn-brutal new-note-btn"
          (click)="notesService.openNewNoteEditor()"
          title="Create a new note (Shortcut: N)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Note</span>
          <kbd class="btn-kbd">N</kbd>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .sticky-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: #ffffff;
      border-bottom: 3px solid #111111;
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-menu-btn {
      display: none;
    }

    .brand {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      user-select: none;
    }

    .brand-logo {
      font-family: var(--font-heading);
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #111111;
      background-color: var(--accent-yellow);
      padding: 0.1rem 0.6rem;
      border: 3px solid #111111;
      box-shadow: 3px 3px 0px #111111;
    }

    .brand-sub {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: #555555;
    }

    .header-center {
      flex: 1;
      max-width: 480px;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      color: #111111;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.55rem 2.4rem 0.55rem 2.4rem;
      font-family: var(--font-body);
      font-size: 0.9rem;
      font-weight: 500;
      color: #111111;
      background-color: #fcfbf8;
      border: 2.5px solid #111111;
      box-shadow: 3px 3px 0px #111111;
      outline: none;
      transition: all 120ms ease;
    }

    .search-input:focus {
      background-color: #ffffff;
      box-shadow: 5px 5px 0px #111111;
    }

    .search-kbd {
      position: absolute;
      right: 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      background-color: #eeeeee;
      border: 1.5px solid #111111;
      padding: 0.1rem 0.4rem;
      pointer-events: none;
    }

    .clear-search-btn {
      position: absolute;
      right: 0.5rem;
      background: transparent;
      border: none;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0.2rem 0.4rem;
      color: #111111;
    }

    .clear-search-btn:hover {
      color: #ef4444;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .sort-select {
      font-family: var(--font-heading);
      font-size: 0.85rem;
      font-weight: 700;
      color: #111111;
      background-color: #ffffff;
      border: 2.5px solid #111111;
      box-shadow: 3px 3px 0px #111111;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      outline: none;
    }

    .sort-select:focus {
      box-shadow: 4px 4px 0px #111111;
    }

    .btn-kbd {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      background-color: #111111;
      color: #ffffff;
      padding: 0.1rem 0.35rem;
      margin-left: 0.25rem;
      border-radius: 0;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 840px) {
      .mobile-menu-btn {
        display: inline-flex;
      }

      .btn-kbd {
        display: none;
      }

      .sort-wrapper {
        display: none;
      }
    }

    @media (max-width: 600px) {
      .sticky-header {
        padding: 0.6rem 0.8rem;
      }

      .search-input::placeholder {
        font-size: 0.8rem;
      }

      .new-note-btn span {
        display: none;
      }

      .new-note-btn {
        padding: 0.5rem 0.7rem;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(public notesService: NotesService) {}

  onSortChange(value: string): void {
    this.notesService.setSortBy(value as SortOption);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLElement | null;
    const isEditingText =
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        Boolean(activeElement.isContentEditable));

    // '/' shortcut to focus search input
    if (event.key === '/' && !isEditingText) {
      event.preventDefault();
      this.searchInput?.nativeElement?.focus();
    }

    // 'N' or 'n' shortcut to create new note (when not typing)
    if ((event.key === 'n' || event.key === 'N') && !isEditingText && !this.notesService.isEditorOpen()) {
      event.preventDefault();
      this.notesService.openNewNoteEditor();
    }
  }
}
