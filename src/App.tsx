export default function App() {
  const tg = (window as any)?.Telegram?.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
  }

  return (
    <div style={{ padding: 24, fontSize: 18 }}>
      ✅ Telegram Mini App veikia
    </div>
  );
}
