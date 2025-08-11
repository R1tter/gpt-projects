import type { Level, LevelPreset, LevelTheme } from "./types";

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

export const levelThemes: Record<Level, LevelTheme[]> = {
  "Fácil": [
    { bg: "#FFFBEB", board: "#FDE68A", cell: "#FEF3C7", hover: "#FDE68A", ring: "#FCD34D" },
    { bg: "#FEFCE8", board: "#FDE68A", cell: "#FEF9C3", hover: "#FDE68A", ring: "#FCD34D" },
  ],
  "Médio": [
    { bg: "#FFF7ED", board: "#FDBA74", cell: "#FED7AA", hover: "#FDBA74", ring: "#FB923C" },
    { bg: "#FFF5E6", board: "#FFD8A8", cell: "#FFE8CC", hover: "#FFD8A8", ring: "#F4A261" },
  ],
  "Difícil": [
    { bg: "#EFEBE9", board: "#D7CCC8", cell: "#EDE0D4", hover: "#D7CCC8", ring: "#BCAAA4" },
    { bg: "#EDEDE9", board: "#C8C4B8", cell: "#DDD6CE", hover: "#C8C4B8", ring: "#B8A89E" },
  ],
};
