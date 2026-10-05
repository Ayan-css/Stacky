import { Component } from '@angular/core';
import { NotesPageComponent } from './features/notes/pages/notes-page/notes-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotesPageComponent],
  template: `<app-notes-page></app-notes-page>`,
})
export class App {}
