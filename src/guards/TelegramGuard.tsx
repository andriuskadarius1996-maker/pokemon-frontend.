import React from 'react';

type Props = { children: React.ReactNode };

const isTelegram = () => {
  // Lite check: allow both real Telegram and localhost/dev for convenience
  // Real check: window.Telegram?.WebApp exists
  try {
    // @ts-ignore
    return typeof window !== 'undefined' && !!(window as any).Telegram && !!(window as any).Telegram.WebApp;
  } catch { return false; }
};

export default function TelegramGuard({ children }: Props){
  const ok = isTelegram() || import.meta.env.DEV; // allow dev mode
  if(!ok){
    return (
      <div style={{display:'grid',placeItems:'center',minHeight:'100dvh',padding:24,textAlign:'center'}}>
        <div style={{maxWidth:520}}>
          <h1>Open in Telegram</h1>
          <p>This mini app is designed to run inside Telegram. Please open it using Telegram, or enable DEV mode.</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
