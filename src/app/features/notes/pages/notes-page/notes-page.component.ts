import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NoteGridComponent } from '../../components/note-grid/note-grid.component';
import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { ShortcutsModalComponent } from '../../components/shortcuts-modal/shortcuts-modal.component';
import { NotesService } from '../../../../core/services/notes.service';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    NoteGridComponent,
    NoteEditorComponent,
    ToastComponent,
    ShortcutsModalComponent,
  ],
  template: `
    <div class="app-layout">
      <!-- MAIN HEADER BAR -->
      <app-header (toggleSidebar)="isMobileSidebarOpen.set(!isMobileSidebarOpen())"></app-header>

      <div class="app-body">
        <!-- DESKTOP SIDEBAR -->
        <div class="desktop-sidebar-wrapper">
          <app-sidebar (openShortcutsModal)="isShortcutsModalOpen.set(true)"></app-sidebar>
        </div>

        <!-- MOBILE SIDEBAR DRAWER & BACKDROP -->
        @if (isMobileSidebarOpen()) {
          <div class="mobile-drawer-backdrop" (click)="isMobileSidebarOpen.set(false)">
            <div class="mobile-drawer" (click)="$event.stopPropagation()">
              <app-sidebar
                (closeSidebar)="isMobileSidebarOpen.set(false)"
                (openShortcutsModal)="isShortcutsModalOpen.set(true); isMobileSidebarOpen.set(false)"
              ></app-sidebar>
            </div>
          </div>
        }

        <!-- MAIN WORKSPACE NOTE GRID -->
        <app-note-grid></app-note-grid>
      </div>

      <!-- NOTE EDITOR MODAL -->
      @if (notesService.isEditorOpen()) {
        <app-note-editor></app-note-editor>
      }

      <!-- TOAST NOTIFICATION FOR UNDO -->
      <app-toast></app-toast>

      <!-- KEYBOARD SHORTCUTS HELP MODAL -->
      @if (isShortcutsModalOpen()) {
        <app-shortcuts-modal (close)="isShortcutsModalOpen.set(false)"></app-shortcuts-modal>
      }
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--bg-desk);
    }

    .app-body {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .desktop-sidebar-wrapper {
      width: 260px;
      height: 100%;
      flex-shrink: 0;
    }

    /* Mobile Drawer */
    .mobile-drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(17, 17, 17, 0.6);
      z-index: 90;
      display: none;
    }

    .mobile-drawer {
      width: 280px;
      height: 100%;
      background: #ffffff;
      border-right: 4px solid #111111;
      box-shadow: 6px 0px 0px #111111;
      animation: slideRight 160ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideRight {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @media (max-width: 840px) {
      .desktop-sidebar-wrapper {
        display: none;
      }

      .mobile-drawer-backdrop {
        display: block;
      }
    }
  `]
})
export class NotesPageComponent {
  readonly isMobileSidebarOpen = signal<boolean>(false);
  readonly isShortcutsModalOpen = signal<boolean>(false);

  constructor(public notesService: NotesService) {}
}
