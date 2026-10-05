import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../../core/services/notes.service';
import { FilterCategory } from '../../../../core/models/note.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar-container">
      <nav class="sidebar-section" aria-label="Main Navigation">
        <h2 class="section-title">WORKSPACE</h2>
        
        <ul class="nav-list">
          <li>
            <button
              type="button"
              class="nav-item"
              [class.active]="notesService.selectedCategory() === 'all' && !notesService.selectedTag()"
              (click)="selectCategory('all')"
            >
              <div class="nav-item-content">
                <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <span>All Notes</span>
              </div>
              <span class="badge-brutal">{{ notesService.counts().all }}</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              class="nav-item"
              [class.active]="notesService.selectedCategory() === 'pinned' && !notesService.selectedTag()"
              (click)="selectCategory('pinned')"
            >
              <div class="nav-item-content">
                <svg class="nav-icon pin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="17" x2="12" y2="22"></line>
                  <path d="M5 17h14l-1.5-6H6.5L5 17z"></path>
                  <path d="M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"></path>
                </svg>
                <span>Pinned</span>
              </div>
              <span class="badge-brutal pin-badge">{{ notesService.counts().pinned }}</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              class="nav-item"
              [class.active]="notesService.selectedCategory() === 'archived' && !notesService.selectedTag()"
              (click)="selectCategory('archived')"
            >
              <div class="nav-item-content">
                <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="21 8 21 21 3 21 3 8"></polyline>
                  <rect x="1" y="3" width="22" height="5"></rect>
                  <line x1="10" y1="12" x2="14" y2="12"></line>
                </svg>
                <span>Archived</span>
              </div>
              <span class="badge-brutal archive-badge">{{ notesService.counts().archived }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- TAGS SECTION -->
      <div class="sidebar-section">
        <div class="section-header">
          <h2 class="section-title">TAGS</h2>
          @if (notesService.selectedTag()) {
            <button type="button" class="clear-tag-btn" (click)="notesService.setTag(null)" title="Clear tag filter">
              Clear Filter
            </button>
          }
        </div>

        @if (notesService.allTags().length === 0) {
          <p class="empty-tags">No tags added yet</p>
        } @else {
          <div class="tags-list">
            @for (tagItem of notesService.allTags(); track tagItem.name) {
              <button
                type="button"
                class="tag-pill"
                [class.active]="notesService.selectedTag() === tagItem.name"
                (click)="selectTag(tagItem.name)"
              >
                <span class="tag-hash">#</span>
                <span class="tag-name">{{ tagItem.name }}</span>
                <span class="tag-count">{{ tagItem.count }}</span>
              </button>
            }
          </div>
        }
      </div>

      <!-- FOOTER ACTIONS & STORAGE STATUS -->
      <div class="sidebar-footer">
        <button
          type="button"
          class="btn-brutal btn-brutal-secondary shortcuts-btn"
          (click)="openShortcutsModal.emit()"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="2" y="4" width="20" height="16" rx="0"></rect>
            <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8"></path>
          </svg>
          <span>Shortcuts Guide</span>
        </button>

        <div class="storage-status" [class.error]="notesService.storageError()">
          <div class="status-indicator"></div>
          <span class="status-text">
            {{ notesService.storageError() ? 'Storage Warning' : 'LocalStorage Synced' }}
          </span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 1.25rem 1rem;
      background-color: #ffffff;
      border-right: 3px solid #111111;
      user-select: none;
      gap: 1.5rem;
      overflow-y: auto;
    }

    .sidebar-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #777777;
    }

    .clear-tag-btn {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      color: #ef4444;
      background: transparent;
      border: none;
      text-decoration: underline;
      cursor: pointer;
    }

    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.6rem 0.8rem;
      background-color: #ffffff;
      border: 2px solid transparent;
      font-family: var(--font-heading);
      font-size: 0.95rem;
      font-weight: 700;
      color: #111111;
      cursor: pointer;
      text-align: left;
      transition: all 100ms ease;
    }

    .nav-item:hover {
      background-color: #f7f6f2;
      border-color: #111111;
    }

    .nav-item.active {
      background-color: var(--accent-yellow);
      border: 2.5px solid #111111;
      box-shadow: 3px 3px 0px #111111;
    }

    .nav-item-content {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .nav-icon {
      color: #111111;
    }

    .pin-badge {
      background-color: #ffedd5;
    }

    .archive-badge {
      background-color: #eeeeee;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .tag-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.3rem 0.6rem;
      background-color: #f5f5f4;
      border: 2px solid #111111;
      box-shadow: 2px 2px 0px #111111;
      cursor: pointer;
      color: #111111;
      transition: all 100ms ease;
    }

    .tag-pill:hover {
      background-color: #e7e5e4;
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px #111111;
    }

    .tag-pill.active {
      background-color: #111111;
      color: #ffffff;
    }

    .tag-hash {
      opacity: 0.6;
    }

    .tag-count {
      font-size: 0.7rem;
      opacity: 0.75;
      margin-left: 0.2rem;
    }

    .empty-tags {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #888888;
      font-style: italic;
    }

    .sidebar-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 2px dashed #cccccc;
    }

    .shortcuts-btn {
      width: 100%;
      font-size: 0.85rem;
      padding: 0.4rem 0.6rem;
    }

    .storage-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: #15803d;
      padding: 0.4rem 0.6rem;
      background-color: #f0fdf4;
      border: 1.5px solid #166534;
    }

    .storage-status.error {
      color: #b91c1c;
      background-color: #fef2f2;
      border-color: #991b1b;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #22c55e;
    }

    .storage-status.error .status-indicator {
      background-color: #ef4444;
    }
  `]
})
export class SidebarComponent {
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() openShortcutsModal = new EventEmitter<void>();

  constructor(public notesService: NotesService) {}

  selectCategory(category: FilterCategory): void {
    this.notesService.setCategory(category);
    this.closeSidebar.emit();
  }

  selectTag(tag: string): void {
    if (this.notesService.selectedTag() === tag) {
      this.notesService.setTag(null);
    } else {
      this.notesService.setTag(tag);
    }
    this.closeSidebar.emit();
  }
}
