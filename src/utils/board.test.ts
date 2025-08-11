import { describe, it, expect } from "vitest";
import { makeEmptyBoard, revealFlood, neighbors } from "./board";

function computeAdjacents(board: ReturnType<typeof makeEmptyBoard>) {
  const rows = board.length;
  const cols = board[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].hasMine) continue;
      board[r][c].adjacent = neighbors(rows, cols, r, c).filter(
        ([nr, nc]) => board[nr][nc].hasMine
      ).length;
    }
  }
}

describe("revealFlood", () => {
  it("reveals all cells on an empty board", () => {
    const board = makeEmptyBoard(2, 2);
    revealFlood(board, 2, 2, 0, 0);
    expect(board.flat().every((c) => c.revealed)).toBe(true);
  });

  it("reveals contiguous empty region and bordering numbers", () => {
    const board = makeEmptyBoard(3, 3);
    board[2][2].hasMine = true;
    computeAdjacents(board);
    revealFlood(board, 3, 3, 0, 0);
    expect(board[2][2].revealed).toBe(false);
    expect(board[1][1].revealed).toBe(true);
    expect(board[1][2].revealed).toBe(true);
  });
});

