import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NotesService } from '../../../../core/services/notes.service';
import { Note } from '../../../../core/models/note.model';

@Component({
  selector: 'app-note-grid',
  standalone: true,
  imports: [CommonModule, NoteCardComponent],
  template: `
    <main class="grid-workspace">
      <!-- ACTIVE FILTER BANNER (If tag or search query active) -->
      @if (notesService.selectedTag() || notesService.searchQuery()) {
        <div class="filter-banner">
          <div class="banner-info">
            <span class="banner-label">Active Filter:</span>
            @if (notesService.selectedTag()) {
              <span class="banner-chip">Tag: #{{ notesService.selectedTag() }}</span>
            }
            @if (notesService.searchQuery()) {
              <span class="banner-chip">Query: "{{ notesService.searchQuery() }}"</span>
            }
            <span class="banner-count">({{ notesService.filteredNotes().length }} result{{ notesService.filteredNotes().length === 1 ? '' : 's' }})</span>
          </div>

          <button type="button" class="clear-filters-btn" (click)="clearAllFilters()">
            Clear Filters
          </button>
        </div>
      }

      <!-- EMPTY STATE -->
      @if (notesService.filteredNotes().length === 0) {
        <div class="empty-state">
          <div class="empty-card">
            @if (notesService.searchQuery() || notesService.selectedTag()) {
              <h2 class="empty-title">NO MATCHING NOTES</h2>
              <p class="empty-desc">
                No notes match your current search or tag filter.
              </p>
              <button type="button" class="btn-brutal btn-brutal-secondary" (click)="clearAllFilters()">
                Reset Search Filters
              </button>
            } @else if (notesService.selectedCategory() === 'pinned') {
              <h2 class="empty-title">NO PINNED NOTES</h2>
              <p class="empty-desc">
                You haven't pinned any notes yet. Click the pin icon on any note card to keep it at the top of your workspace.
              </p>
            } @else if (notesService.selectedCategory() === 'archived') {
              <h2 class="empty-title">NO ARCHIVED NOTES</h2>
              <p class="empty-desc">
                Your archive is currently empty.
              </p>
            } @else {
              <h2 class="empty-title">WORKSPACE IS EMPTY</h2>
              <p class="empty-desc">
                Your desk is completely clear. Start writing your first sticky note to capture your thoughts.
              </p>
              <button type="button" class="btn-brutal" (click)="notesService.openNewNoteEditor()">
                + Create First Note
              </button>
            }
          </div>
        </div>
      } @else {
        <!-- PINNED SECTION (If in 'all' view and there are pinned notes without search/tag override) -->
        @if (showPinnedSection()) {
          <section class="notes-section">
            <div class="section-header">
              <span class="section-icon">📌</span>
              <h2 class="section-title">PINNED NOTES</h2>
              <span class="section-badge">{{ pinnedNotes().length }}</span>
            </div>
            <div class="cards-grid">
              @for (note of pinnedNotes(); track note.id) {
                <app-note-card [note]="note"></app-note-card>
              }
            </div>
          </section>
        }

        <!-- OTHER NOTES SECTION -->
        <section class="notes-section">
          @if (showPinnedSection()) {
            <div class="section-header">
              <span class="section-icon">📝</span>
              <h2 class="section-title">OTHER NOTES</h2>
              <span class="section-badge">{{ unpinnedNotes().length }}</span>
            </div>
          } @else if (notesService.selectedCategory() === 'archived') {
            <div class="section-header">
              <span class="section-icon">📦</span>
              <h2 class="section-title">ARCHIVED NOTES</h2>
              <span class="section-badge">{{ notesService.filteredNotes().length }}</span>
            </div>
          }

          <div class="cards-grid">
            @for (note of (showPinnedSection() ? unpinnedNotes() : notesService.filteredNotes()); track note.id) {
              <app-note-card [note]="note"></app-note-card>
            }
          </div>
        </section>
      }
    </main>
  `,
  styles: [`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .grid-workspace {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
      box-sizing: border-box;
    }

    .filter-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background-color: #ffffff;
      border: 3px solid #111111;
      box-shadow: 4px 4px 0px #111111;
    }

    .banner-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .banner-label {
      font-family: var(--font-heading);
      font-size: 0.85rem;
      font-weight: 700;
      color: #555555;
    }

    .banner-chip {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      background-color: var(--accent-yellow);
      color: #111111;
      padding: 0.2rem 0.5rem;
      border: 1.5px solid #111111;
    }

    .banner-count {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #666666;
    }

    .clear-filters-btn {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      color: #111111;
      background: transparent;
      border: 2px solid #111111;
      padding: 0.3rem 0.6rem;
      cursor: pointer;
      box-shadow: 2px 2px 0px #111111;
    }

    .clear-filters-btn:hover {
      background-color: #111111;
      color: #ffffff;
    }

    .notes-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-bottom: 0.4rem;
      border-bottom: 2.5px solid #111111;
      user-select: none;
    }

    .section-icon {
      font-size: 1rem;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #111111;
    }

    .section-badge {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      background-color: #111111;
      color: #ffffff;
      padding: 0.1rem 0.45rem;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
      width: 100%;
    }

    /* EMPTY STATE */
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 360px;
      width: 100%;
    }

    .empty-card {
      max-width: 460px;
      width: 100%;
      text-align: center;
      padding: 2.5rem 2rem;
      background-color: #ffffff;
      border: 3px solid #111111;
      box-shadow: 6px 6px 0px #111111;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
    }

    .empty-title {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 700;
      color: #111111;
      letter-spacing: 0.05em;
    }

    .empty-desc {
      font-family: var(--font-body);
      font-size: 0.95rem;
      color: #555555;
      line-height: 1.5;
    }

    @media (max-width: 640px) {
      .grid-workspace {
        padding: 1rem;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NoteGridComponent {
  constructor(public notesService: NotesService) {}

  readonly pinnedNotes = computed(() => {
    return this.notesService.filteredNotes().filter((n) => n.pinned);
  });

  readonly unpinnedNotes = computed(() => {
    return this.notesService.filteredNotes().filter((n) => !n.pinned);
  });

  readonly showPinnedSection = computed(() => {
    return (
      this.notesService.selectedCategory() === 'all' &&
      !this.notesService.searchQuery() &&
      !this.notesService.selectedTag() &&
      this.pinnedNotes().length > 0 &&
      this.unpinnedNotes().length > 0
    );
  });

  clearAllFilters(): void {
    this.notesService.setSearchQuery('');
    this.notesService.setTag(null);
  }
}
