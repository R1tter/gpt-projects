import React from "react";
import ReactDOM from "react-dom/client";
import DogSweeper from "./components/DogSweeper";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DogSweeper />
  </React.StrictMode>
);
