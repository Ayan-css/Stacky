export type NoteColor = 'yellow' | 'orange' | 'green' | 'blue' | 'pink' | 'cream';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
}

export type FilterCategory = 'all' | 'pinned' | 'archived';
export type SortOption = 'updated-desc' | 'created-desc' | 'created-asc' | 'title-asc';

export interface TagWithCount {
  name: string;
  count: number;
}
