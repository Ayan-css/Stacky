import { Component, Input, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../../../core/models/note.model';
import { NotesService } from '../../../../core/services/notes.service';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="note-card"
      [class]="'color-' + note.color"
      [style.transform]="rotationStyle"
      (click)="onCardClick($event)"
      tabindex="0"
      (keydown.enter)="openEditor()"
      (keydown.space)="openEditor()"
      [attr.aria-label]="'Note: ' + note.title"
    >
      <!-- HEADER PIN & QUICK ACTIONS -->
      <div class="note-card-header">
        <div class="header-left">
          <button
            type="button"
            class="pin-btn"
            [class.pinned]="note.pinned"
            (click)="togglePin($event)"
            [title]="note.pinned ? 'Unpin note' : 'Pin note to top'"
            [attr.aria-label]="note.pinned ? 'Unpin note' : 'Pin note'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" [attr.fill]="note.pinned ? '#111111' : 'none'" stroke="#111111" stroke-width="2.5">
              <line x1="12" y1="17" x2="12" y2="22"></line>
              <path d="M5 17h14l-1.5-6H6.5L5 17z"></path>
              <path d="M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"></path>
            </svg>
          </button>

          @if (note.pinned) {
            <span class="pinned-badge">PINNED</span>
          }
        </div>

        <div class="header-right">
          <!-- Archive / Unarchive Button -->
          <button
            type="button"
            class="action-icon-btn"
            (click)="toggleArchive($event)"
            [title]="note.archived ? 'Unarchive note' : 'Archive note'"
            [attr.aria-label]="note.archived ? 'Unarchive note' : 'Archive note'"
          >
            @if (note.archived) {
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 14 12 11 15 14"></polyline>
                <line x1="12" y1="11" x2="12" y2="21"></line>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
              </svg>
            } @else {
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="21 8 21 21 3 21 3 8"></polyline>
                <rect x="1" y="3" width="22" height="5"></rect>
                <line x1="10" y1="12" x2="14" y2="12"></line>
              </svg>
            }
          </button>

          <!-- Delete Button -->
          <button
            type="button"
            class="action-icon-btn delete-btn"
            (click)="deleteNote($event)"
            title="Delete note"
            aria-label="Delete note"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- CARD CONTENT -->
      <div class="note-card-body">
        <h3 class="note-title">{{ note.title || 'Untitled' }}</h3>
        <p class="note-content">{{ note.content }}</p>
      </div>

      <!-- CARD FOOTER -->
      <div class="note-card-footer">
        <div class="tags-container">
          @for (tag of note.tags; track tag) {
            <span
              class="card-tag"
              (click)="onTagClick($event, tag)"
              [title]="'Filter by #' + tag"
            >
              #{{ tag }}
            </span>
          }
        </div>

        <span class="time-stamp">{{ formattedTime }}</span>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .note-card {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 250px;
      padding: 1rem;
      border: 3px solid #111111;
      box-shadow: 4px 4px 0px #111111;
      cursor: pointer;
      user-select: none;
      transition: transform 140ms ease, box-shadow 140ms ease;
    }

    .note-card:hover {
      transform: rotate(0deg) translate(-3px, -3px) !important;
      box-shadow: 7px 7px 0px #111111;
      z-index: 10;
    }

    .note-card:focus-visible {
      outline: 3px solid #111111;
      outline-offset: 3px;
    }

    /* Note Color Themes */
    .color-yellow {
      background-color: var(--note-yellow-bg);
    }
    .color-orange {
      background-color: var(--note-orange-bg);
    }
    .color-green {
      background-color: var(--note-green-bg);
    }
    .color-blue {
      background-color: var(--note-blue-bg);
    }
    .color-pink {
      background-color: var(--note-pink-bg);
    }
    .color-cream {
      background-color: var(--note-cream-bg);
    }

    .note-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .pin-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 100ms ease;
    }

    .pin-btn:hover {
      transform: scale(1.15);
    }

    .pinned-badge {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 700;
      background-color: #111111;
      color: #ffffff;
      padding: 0.1rem 0.35rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      opacity: 0.75;
      transition: opacity 120ms ease;
    }

    .note-card:hover .header-right {
      opacity: 1;
    }

    .action-icon-btn {
      background: transparent;
      border: 1.5px solid transparent;
      padding: 0.25rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #111111;
      transition: all 100ms ease;
    }

    .action-icon-btn:hover {
      background-color: rgba(17, 17, 17, 0.1);
      border-color: #111111;
    }

    .delete-btn:hover {
      background-color: var(--accent-red);
      color: #ffffff;
    }

    .note-card-body {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .note-title {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 700;
      color: #111111;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .note-content {
      font-family: var(--font-body);
      font-size: 0.88rem;
      color: #222222;
      white-space: pre-wrap;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.45;
    }

    .note-card-footer {
      margin-top: 0.75rem;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1.5px solid rgba(17, 17, 17, 0.15);
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      overflow: hidden;
      max-height: 26px;
    }

    .card-tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      color: #111111;
      background-color: rgba(255, 255, 255, 0.65);
      border: 1px solid #111111;
      padding: 0.1rem 0.35rem;
      cursor: pointer;
    }

    .card-tag:hover {
      background-color: #111111;
      color: #ffffff;
    }

    .time-stamp {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 500;
      color: #666666;
      white-space: nowrap;
    }
  `]
})
export class NoteCardComponent implements OnInit {
  @Input({ required: true }) note!: Note;

  rotationStyle: string = 'rotate(0deg)';
  formattedTime: string = '';

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.calculateRotation();
    this.calculateFormattedTime();
  }

  private calculateRotation(): void {
    // Deterministic tilt angle based on note ID hash
    let hash = 0;
    for (let i = 0; i < this.note.id.length; i++) {
      hash = (hash << 5) - hash + this.note.id.charCodeAt(i);
      hash |= 0;
    }
    const angles = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
    const index = Math.abs(hash) % angles.length;
    this.rotationStyle = `rotate(${angles[index]}deg)`;
  }

  private calculateFormattedTime(): void {
    const now = Date.now();
    const diffMs = now - this.note.updatedAt;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      this.formattedTime = 'Just now';
    } else if (diffMins < 60) {
      this.formattedTime = `${diffMins}m ago`;
    } else if (diffHours < 24) {
      this.formattedTime = `${diffHours}h ago`;
    } else if (diffDays === 1) {
      this.formattedTime = 'Yesterday';
    } else if (diffDays < 7) {
      this.formattedTime = `${diffDays}d ago`;
    } else {
      const date = new Date(this.note.updatedAt);
      this.formattedTime = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  }

  onCardClick(event: MouseEvent): void {
    this.openEditor();
  }

  openEditor(): void {
    this.notesService.openEditNoteEditor(this.note);
  }

  togglePin(event: MouseEvent): void {
    event.stopPropagation();
    this.notesService.togglePin(this.note.id);
  }

  toggleArchive(event: MouseEvent): void {
    event.stopPropagation();
    this.notesService.toggleArchive(this.note.id);
  }

  deleteNote(event: MouseEvent): void {
    event.stopPropagation();
    this.notesService.deleteNote(this.note.id);
  }

  onTagClick(event: MouseEvent, tag: string): void {
    event.stopPropagation();
    this.notesService.setTag(tag);
  }
}
