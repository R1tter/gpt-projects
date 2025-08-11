export interface LevelPreset {
  rows: number;
  cols: number;
  mines: number;
}

export type Level = 'F\u00e1cil' | 'M\u00e9dio' | 'Dif\u00edcil';

export interface Cell {
  revealed: boolean;
  hasMine: boolean;
  flagged: boolean;
  adjacent: number;
}

export type Board = Cell[][];

export type GameState = 'ready' | 'playing' | 'lost' | 'won';
