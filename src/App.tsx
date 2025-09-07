
import React from "react";
import "./styles.css";

type Manifest = Record<string, string>;
const levels = Array.from({ length: 30 }, (_, i) => i + 1);

function raceFor(n: number) {
  if (n <= 10) return "sparko";       // electric
  if (n <= 15) return "embero";       // fire
  if (n <= 20) return "aquado";       // water
  if (n <= 25) return "terra";        // earth
  if (n <= 29) return "legendary";    // cosmic
  return "ultra";                     // final electric
}

export default function App() {
  const [manifest, setManifest] = React.useState<Manifest>({});

  React.useEffect(() => {
    fetch("/avatars_manifest.json")
      .then((r) => r.json())
      .then(setManifest)
      .catch(console.error);
  }, []);

  return (
    <div className="page">
      <header className="head">
        <h1>POKE TOKEN — Season 1</h1>
        <div className="sub">Avatars (animated effects, lightweight)</div>
      </header>

      <div className="grid">
        {levels.map((n) => {
          const url = manifest[String(n)];
          const race = raceFor(n);
          return (
            <div key={n} className={`card ${race}`}>
              {/* Low-cost animated effect layers */}
              <div className="fx fx-back" aria-hidden />
              <div className="fx fx-front" aria-hidden />

              <img
                src={url}
                alt={`lv${String(n).padStart(2, "0")}`}
                className="char"
                loading="lazy"
                decoding="async"
                onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.25")}
              />
              <div className="label">lv{String(n).padStart(2, "0")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
