export const randInt = (max) => Math.floor(Math.random() * max);
export const keyOf = (r, c) => `${r}:${c}`;

export function makeEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      revealed: false,
      hasMine: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

export function inBounds(rows, cols, r, c) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

export function neighbors(rows, cols, r, c) {
  const out = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (inBounds(rows, cols, nr, nc)) out.push([nr, nc]);
    }
  }
  return out;
}

export function placeMines(board, rows, cols, mines, safeR, safeC) {
  const forbidden = new Set([keyOf(safeR, safeC), ...neighbors(rows, cols, safeR, safeC).map(([r, c]) => keyOf(r, c))]);
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
      board[r][c].adjacent = neighbors(rows, cols, r, c).filter(([nr, nc]) => board[nr][nc].hasMine).length;
    }
  }
}
