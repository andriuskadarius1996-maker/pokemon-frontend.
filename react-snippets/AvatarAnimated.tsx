
import React from 'react';
type Phase = 'spark'|'ember'|'aquado'|'legendary'|'pikachu';
const phaseColor: Record<Phase,string> = {
  spark:'#ffe46b', ember:'#ff6a55', aquado:'#7fc4ff', legendary:'#b69cff', pikachu:'#ffe36e'
};
export function AvatarAnimated({src, phase='spark'}:{src:string, phase:Phase}){
  const glow = phaseColor[phase];
  return (
    <div className="avatar-wrap">
      <div className="effect-glow" style={{background:`radial-gradient(40% 40% at 50% 60%, ${hexA(glow,0.35)} 0%, transparent 65%)`}}/>
      {phase==='spark' && <div className="effect-sparks"/>}
      {phase==='aquado' && <div className="effect-waves"/>}
      {phase==='legendary' && <div className="effect-starburst"/>}
      {(phase==='spark'||phase==='pikachu') && <div className="effect-lightning"/>}
      <img className="avatar-img" src={src} alt="avatar"/>
    </div>
  );
}
function hexA(hex:string, a:number){ const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${a})`; }
