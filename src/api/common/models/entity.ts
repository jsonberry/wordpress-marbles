export interface EntityDate {
  created: string; // ISO
  modified: string; // ISO
}

export interface Entity {
  _wp_id: number;
  acf?: Record<string, any>;
  date: EntityDate;
  id: string;
  status: string;
  title: string;
}

