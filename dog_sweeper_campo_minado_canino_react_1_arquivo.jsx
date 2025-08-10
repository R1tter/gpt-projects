import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// DogSweeper — Minesweeper temático de cachorros 🐶💩
// Correção: garantir que as minas sejam colocadas ANTES de revelar a primeira célula
// e que a mesma "board" (com minas) seja usada durante o clique.

const randInt = (max) => Math.floor(Math.random() * max);
const keyOf = (r, c) => `${r}:${c}`;

const levelPresets = {
  Fácil: { rows: 9, cols: 9, mines: 10 },
  Médio: { rows: 12, cols: 12, mines: 22 },
  Difícil: { rows: 16, cols: 16, mines: 40 },
};

const numberColors = {
  1: "text-sky-600",
  2: "text-emerald-600",
  3: "text-rose-600",
  4: "text-indigo-700",
  5: "text-amber-700",
  6: "text-teal-700",
  7: "text-fuchsia-700",
  8: "text-stone-700",
};

const loseLines = [
  "Ih… pisou no presente! 💩",
  "Game over: quem ama, limpa. 🧻",
  "Ops! O doguinho aprontou e você também.",
  "Escorregou no cocô-móvel!",
];

const winLines = [
  "Uau! 🐶 Você domou o quarteirão!",
  "Campeão do passeio sem pisão! 🏆",
  "Cheiro de vitória (e não é do cocô)!",
  "Zero pisadas, 100% pet-friendly!",
];

const sidebarQuips = [
  "Dica: marque com 🦴 onde suspeitar.",
  "Rumor: o labrador enterrou dois cocôs juntos…",
  "Conta as patinhas: números = quantos 💩 ao redor!",
  "Modo Mobile: ative \"Marcar\" para usar 🦴.",
];

function makeEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      revealed: false,
      hasMine: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

function inBounds(rows, cols, r, c) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

function neighbors(rows, cols, r, c) {
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

function placeMines(board, rows, cols, mines, safeR, safeC) {
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
  // Calcula adjacentes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].hasMine) continue;
      board[r][c].adjacent = neighbors(rows, cols, r, c).filter(([nr, nc]) => board[nr][nc].hasMine).length;
    }
  }
}

export default function DogSweeper() {
  const [level, setLevel] = useState("Médio");
  const settings = levelPresets[level];

  const [{ board, mines, rows, cols }, setBoardState] = useState(() => ({
    board: makeEmptyBoard(settings.rows, settings.cols),
    mines: settings.mines,
    rows: settings.rows,
    cols: settings.cols,
  }));

  const [started, setStarted] = useState(false);
  const [state, setState] = useState("ready"); // ready | playing | won | lost
  const [flags, setFlags] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [markMode, setMarkMode] = useState(false);
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    const s = levelPresets[level];
    setBoardState({ board: makeEmptyBoard(s.rows, s.cols), mines: s.mines, rows: s.rows, cols: s.cols });
    setStarted(false);
    setState("ready");
    setFlags(0);
    setSeconds(0);
  }, [level]);

  useEffect(() => { reset(); }, [level]);

  useEffect(() => {
    if (state === "playing") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
    clearInterval(timerRef.current);
  }, [state]);

  const nonMineCount = useMemo(() => rows * cols - mines, [rows, cols, mines]);

  const revealFlood = useCallback((r, c, b) => {
    const stack = [[r, c]];
    const visited = new Set();
    while (stack.length) {
      const [cr, cc] = stack.pop();
      const k = keyOf(cr, cc);
      if (visited.has(k)) continue;
      visited.add(k);
      const cell = b[cr][cc];
      if (cell.revealed || cell.flagged) continue;
      cell.revealed = true;
      if (!cell.hasMine && cell.adjacent === 0) {
        for (const [nr, nc] of neighbors(rows, cols, cr, cc)) {
          const nk = keyOf(nr, nc);
          if (!visited.has(nk)) stack.push([nr, nc]);
        }
      }
    }
  }, [rows, cols]);

  // 👇 Função que garante board com minas ANTES de qualquer ação de revelar
  const prepareBoardForClick = useCallback((r, c) => {
    let working = board.map((row) => row.map((cell) => ({ ...cell })));
    if (!started) {
      placeMines(working, rows, cols, mines, r, c);
      setStarted(true);
      setState("playing");
    }
    return working;
  }, [board, started, rows, cols, mines]);

  const handleReveal = useCallback((r, c) => {
    if (state === "won" || state === "lost") return;

    // usa sempre a mesma cópia durante o clique
    const working = prepareBoardForClick(r, c);
    const cell = working[r][c];
    if (cell.revealed || cell.flagged) {
      setBoardState({ board: working, mines, rows, cols });
      return;
    }

    cell.revealed = true;

    if (cell.hasMine) {
      // revelar tudo ao perder
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) working[i][j].revealed = true;
      setBoardState({ board: working, mines, rows, cols });
      setState("lost");
      return;
    }

    if (cell.adjacent === 0) revealFlood(r, c, working);

    // Atualiza tabuleiro e verifica vitória
    setBoardState({ board: working, mines, rows, cols });

    let safeRevealed = 0;
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) if (working[i][j].revealed && !working[i][j].hasMine) safeRevealed++;
    if (safeRevealed >= nonMineCount) setState("won");
  }, [state, rows, cols, mines, nonMineCount, revealFlood, prepareBoardForClick]);

  const handleFlag = useCallback((r, c) => {
    if (state === "won" || state === "lost") return;
    let working = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = working[r][c];
    if (cell.revealed) return;
    if (!started) setState("playing");
    cell.flagged = !cell.flagged;
    setFlags((f) => f + (cell.flagged ? 1 : -1));
    setBoardState({ board: working, mines, rows, cols });
  }, [board, started, rows, cols, mines, state]);

  const remaining = Math.max(mines - flags, 0);

  const bannerText = useMemo(() => {
    if (state === "lost") return loseLines[randInt(loseLines.length)];
    if (state === "won") return winLines[randInt(winLines.length)];
    return "Passeio canino: evite os 💩!";
  }, [state]);

  const quip = useMemo(() => sidebarQuips[randInt(sidebarQuips.length)], [state, seconds, flags]);

  return (
    <div className="min-h-screen w-full bg-amber-50 text-stone-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-[1fr_280px] gap-6">
        <div>
          <header className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐶</span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">DogSweeper</h1>
            </div>
            <div className="flex items-center gap-2">
              <select className="rounded-2xl px-3 py-2 bg-white shadow ring-1 ring-stone-200 text-sm" value={level} onChange={(e) => setLevel(e.target.value)}>
                {Object.keys(levelPresets).map((k) => (<option key={k}>{k}</option>))}
              </select>
              <button onClick={reset} className="rounded-2xl px-4 py-2 bg-rose-500 text-white shadow hover:brightness-105 active:brightness-95">Reiniciar</button>
            </div>
          </header>

          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm ring-1 ring-stone-200 mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-semibold">💩 {remaining.toString().padStart(2, "0")}</div>
              <div className="rounded-xl bg-sky-100 px-3 py-2 text-sm font-semibold">⏱️ {seconds}s</div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-rose-500 w-4 h-4" checked={markMode} onChange={(e) => setMarkMode(e.target.checked)} />
              Modo "Marcar" (mobile)
            </label>
          </div>

          <div className="relative mx-auto select-none">
            <div className="grid mx-auto bg-amber-200/60 p-2 rounded-3xl shadow-inner" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 6 }}>
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const base = "aspect-square rounded-2xl flex items-center justify-center font-bold shadow-sm transition-all duration-100";
                  const unrevealed = "bg-amber-100 hover:bg-amber-200 active:translate-y-[1px] ring-1 ring-amber-300/60";
                  const revealed = "bg-white ring-1 ring-stone-200";
                  const content = cell.revealed ? (cell.hasMine ? "💩" : cell.adjacent > 0 ? cell.adjacent : "") : cell.flagged ? "🦴" : "";
                  const numClass = numberColors[cell.adjacent] || "";
                  return (
                    <div
                      key={keyOf(r, c)}
                      className={`${base} ${cell.revealed ? revealed : unrevealed} ${!cell.revealed && !cell.flagged ? "hover:shadow" : ""}`}
                      onClick={() => (markMode ? handleFlag(r, c) : handleReveal(r, c))}
                      onContextMenu={(e) => { e.preventDefault(); handleFlag(r, c); }}
                      role="button"
                      aria-label={`célula ${r + 1}, ${c + 1}`}
                      title={!cell.revealed && !cell.flagged ? "Revelar" : cell.flagged ? "Marcado com 🦴" : ""}
                    >
                      <span className={`text-xl md:text-2xl select-none ${cell.revealed && !cell.hasMine ? numClass : ""}`}>{content}</span>
                    </div>
                  );
                })
              )}
            </div>

            {(state === "won" || state === "lost") && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="backdrop-blur-sm bg-white/70 rounded-3xl p-6 md:p-8 text-center ring-2 ring-stone-200 shadow-2xl max-w-md">
                  <div className="text-4xl mb-2">{state === "won" ? "🎉" : "💩"}</div>
                  <h2 className="text-xl md:text-2xl font-extrabold mb-3">{bannerText}</h2>
                  <p className="text-sm opacity-80 mb-4">{state === "won" ? "Os doguinhos agradecem o passeio limpinho!" : "Opa! Vamos tentar de novo e levar mais saquinhos."}</p>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={reset} className="px-4 py-2 rounded-2xl bg-rose-500 text-white shadow hover:brightness-105">Jogar de novo</button>
                    <button onClick={() => { setLevel("Fácil"); }} className="px-4 py-2 rounded-2xl bg-amber-500 text-white shadow hover:brightness-105">Modo Fácil</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl p-4 ring-1 ring-stone-200 shadow-sm">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2">🐾 Dicas do Passeio</h3>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Clique para revelar; botão direito marca com 🦴.</li>
              <li>Os números dizem quantos 💩 existem nas 8 casas ao redor.</li>
              <li>Primeiro clique é sempre seguro.</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-amber-100 to-rose-100 rounded-2xl p-4 ring-1 ring-amber-200/80 shadow-sm">
            <div className="text-sm">{quip}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 ring-1 ring-stone-200 shadow-sm">
            <h4 className="font-bold mb-1">Temas & frases</h4>
            <p className="text-sm opacity-80">Perdeu: "{loseLines[0]}" • Ganhou: "{winLines[0]}" (variantes aleatórias durante o jogo).</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
