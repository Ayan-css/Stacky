import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../../core/services/notes.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notesService.deletedToast()) {
      <div class="toast-container" role="alert" aria-live="assertive">
        <div class="toast-card">
          <div class="toast-message">
            <span class="toast-icon">🗑️</span>
            <span class="toast-text">
              Note <strong>"{{ truncatedTitle }}"</strong> deleted
            </span>
          </div>

          <div class="toast-actions">
            <button
              type="button"
              class="btn-brutal undo-btn"
              (click)="notesService.undoDelete()"
            >
              UNDO
            </button>
            <button
              type="button"
              class="close-toast-btn"
              (click)="notesService.dismissToast()"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 200;
      animation: slideUp 180ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .toast-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 0.75rem 1rem;
      background-color: #111111;
      color: #ffffff;
      border: 3px solid #ffffff;
      box-shadow: 5px 5px 0px #111111;
      min-width: 320px;
      max-width: 420px;
    }

    .toast-message {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-family: var(--font-body);
      font-size: 0.9rem;
      overflow: hidden;
    }

    .toast-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .toast-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .undo-btn {
      padding: 0.3rem 0.7rem;
      font-size: 0.8rem;
      background-color: var(--accent-yellow);
      color: #111111;
      border-width: 2px;
      box-shadow: 2px 2px 0px #ffffff;
    }

    .undo-btn:hover {
      box-shadow: 3px 3px 0px #ffffff;
    }

    .close-toast-btn {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0.2rem;
    }

    .close-toast-btn:hover {
      color: var(--accent-red);
    }
  `]
})
export class ToastComponent {
  constructor(public notesService: NotesService) {}

  get truncatedTitle(): string {
    const toast = this.notesService.deletedToast();
    if (!toast) return '';
    const title = toast.note.title || 'Untitled';
    return title.length > 20 ? title.substring(0, 18) + '...' : title;
  }
}
