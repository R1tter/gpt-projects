import type { Board, Cell } from "../types";

export const randInt = (max: number): number => Math.floor(Math.random() * max);
export const keyOf = (r: number, c: number): string => `${r}:${c}`;

export function makeEmptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      revealed: false,
      hasMine: false,
      flagged: false,
      adjacent: 0,
    } as Cell))
  );
}

export function inBounds(rows: number, cols: number, r: number, c: number): boolean {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

export function neighbors(rows: number, cols: number, r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr,
        nc = c + dc;
      if (inBounds(rows, cols, nr, nc)) out.push([nr, nc]);
    }
  }
  return out;
}

export function placeMines(
  board: Board,
  rows: number,
  cols: number,
  mines: number,
  safeR: number,
  safeC: number
): void {
  const forbidden = new Set<string>([
    keyOf(safeR, safeC),
    ...neighbors(rows, cols, safeR, safeC).map(([r, c]) => keyOf(r, c)),
  ]);
  let placed = 0;
  while (placed < mines) {
    const r = randInt(rows);
    const c = randInt(cols);
    const k = keyOf(r, c);
    if (!forbidden.has(k) && !board[r][c].hasMine) {
      board[r][c].hasMine = true;
      placed++;
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].hasMine) continue;
      board[r][c].adjacent = neighbors(rows, cols, r, c).filter(
        ([nr, nc]) => board[nr][nc].hasMine
      ).length;
    }
  }
}

export function revealFlood(
  board: Board,
  rows: number,
  cols: number,
  r: number,
  c: number
): void {
  const stack: [number, number][] = [[r, c]];
  const visited = new Set<string>();
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const key = keyOf(cr, cc);
    if (visited.has(key)) continue;
    visited.add(key);
    const cell = board[cr][cc];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (!cell.hasMine && cell.adjacent === 0) {
      for (const [nr, nc] of neighbors(rows, cols, cr, cc)) {
        const nk = keyOf(nr, nc);
        if (!visited.has(nk)) stack.push([nr, nc]);
      }
    }
  }
}
