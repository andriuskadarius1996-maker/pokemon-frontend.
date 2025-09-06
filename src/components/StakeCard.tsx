import { useState } from "react";
import { actions, useSnapshot } from "../state/store";

const baseRates: Record<string, number> = { Sparko:2, Embero:3, Aquado:4, Legendary:6, Pikachu:10 };

export default function StakeCard({name}:{name:keyof typeof baseRates | string}){
  const s = useSnapshot();
  const lvl = s.inventory[name]?.level || 0;
  const base = baseRates[name as string] || 0;
  const rate = base + lvl;
  return (
    <div className="card">
      <div className="title">{name}</div>
      <p className="opacity-80 mt-1">Base: {base} PT/h • Level: +{lvl}/h → <b>{rate} PT/h</b></p>
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 rounded-xl bg-white text-black" onClick={()=>actions.stake(name as string)}>Stake (demo tick)</button>
        <button className="px-4 py-2 rounded-xl bg-neutral-700" onClick={()=>actions.upgrade(name as string)}>Upgrade (+1/h)</button>
      </div>
    </div>
  );
}