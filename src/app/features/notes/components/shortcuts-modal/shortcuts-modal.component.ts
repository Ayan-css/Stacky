import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shortcuts-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)" role="dialog" aria-modal="true" aria-label="Keyboard Shortcuts">
      <div class="shortcuts-card" (click)="$event.stopPropagation()">
        <div class="card-header">
          <h2 class="card-title">⌨️ KEYBOARD SHORTCUTS</h2>
          <button type="button" class="close-btn" (click)="close.emit()">✕</button>
        </div>

        <div class="shortcuts-list">
          <div class="shortcut-row">
            <div class="keys">
              <kbd class="key">N</kbd>
            </div>
            <span class="desc">Create a new sticky note</span>
          </div>

          <div class="shortcut-row">
            <div class="keys">
              <kbd class="key">/</kbd>
            </div>
            <span class="desc">Focus search bar</span>
          </div>

          <div class="shortcut-row">
            <div class="keys">
              <kbd class="key">Ctrl</kbd> + <kbd class="key">Enter</kbd>
            </div>
            <span class="desc">Save note inside editor</span>
          </div>

          <div class="shortcut-row">
            <div class="keys">
              <kbd class="key">Esc</kbd>
            </div>
            <span class="desc">Close editor or modal dialog</span>
          </div>
        </div>

        <div class="card-footer">
          <button type="button" class="btn-brutal close-action" (click)="close.emit()">
            Got it
          </button>
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

    .shortcuts-card {
      width: 100%;
      max-width: 440px;
      background-color: #ffffff;
      border: 4px solid #111111;
      box-shadow: 8px 8px 0px #111111;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #111111;
      padding-bottom: 0.6rem;
    }

    .card-title {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 700;
      color: #111111;
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      color: #111111;
    }

    .close-btn:hover {
      color: #ef4444;
    }

    .shortcuts-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .shortcut-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem;
      background-color: #f7f6f2;
      border: 2px solid #111111;
    }

    .keys {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .key {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      background-color: #ffffff;
      color: #111111;
      border: 1.5px solid #111111;
      box-shadow: 1.5px 1.5px 0px #111111;
      padding: 0.15rem 0.45rem;
    }

    .desc {
      font-family: var(--font-body);
      font-size: 0.88rem;
      color: #222222;
      font-weight: 500;
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
    }

    .close-action {
      width: 100%;
    }
  `]
})
export class ShortcutsModalComponent {
  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close.emit();
    }
  }
}
