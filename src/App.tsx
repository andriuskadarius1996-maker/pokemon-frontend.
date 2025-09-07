
import React from "react";
import "./styles.css";

type Manifest = Record<string, string>;
const levels = Array.from({ length: 30 }, (_, i) => i + 1);

export default function App() {
  const [manifest, setManifest] = React.useState<Manifest>({});

  React.useEffect(() => {
    fetch("/avatars_manifest.json")
      .then((r) => r.json())
      .then(setManifest)
      .catch(console.error);
  }, []);

  const raceFor = (n: number) => {
    if (n <= 10) return "sparko";
    if (n <= 15) return "embero";
    if (n <= 20) return "aquado";
    if (n <= 29) return "legendary";
    return "pikachu";
  };

  return (
    <div className="page">
      <h1>POKE TOKEN — Season 1</h1>
      <h2>Avatars (preview)</h2>
      <div className="grid">
        {levels.map((n) => {
          const url = manifest[String(n)];
          return (
            <div key={n} className={`card ${raceFor(n)}`}>
              <div className="glow aura" />
              <img
                src={url}
                alt={`lv${String(n).padStart(2, "0")}`}
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
