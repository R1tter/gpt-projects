import type { Level, LevelPreset } from "./types";

export const levelPresets: Record<Level, LevelPreset> = {
  "Fácil": { rows: 9, cols: 9, mines: 10 },
  "Médio": { rows: 12, cols: 12, mines: 22 },
  "Difícil": { rows: 16, cols: 16, mines: 40 },
};

export const numberColors: Record<number, string> = {
  1: "text-sky-600",
  2: "text-emerald-600",
  3: "text-rose-600",
  4: "text-indigo-700",
  5: "text-amber-700",
  6: "text-teal-700",
  7: "text-fuchsia-700",
  8: "text-stone-700",
};

export const loseLines: string[] = [
  "Ih… pisou no presente! 💩",
  "Game over: quem ama, limpa. 🧻",
  "Ops! O doguinho aprontou e você também.",
  "Escorregou no cocô-móvel!",
];

export const winLines: string[] = [
  "Uau! 🐶 Você domou o quarteirão!",
  "Campeão do passeio sem pisão! 🏆",
  "Cheiro de vitória (e não é do cocô)!",
  "Zero pisadas, 100% pet-friendly!",
];

export const sidebarQuips: string[] = [
  "Dica: marque com 🦴 onde suspeitar.",
  "Rumor: o labrador enterrou dois cocôs juntos…",
  "Conta as patinhas: números = quantos 💩 ao redor!",
  "Modo Mobile: ative \"Marcar\" para usar 🦴.",
];
