import React from "react";
import { BrowserRouter } from "react-router-dom";
import TelegramGuard from "./components/TelegramGuard";
import SeasonHeader from "./components/SeasonHeader";
import MainScreen from "./components/MainScreen";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
    return <TelegramGuard>{children}</TelegramGuard>;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Wrapper>
        <SeasonHeader />
        <MainScreen />
      </Wrapper>
    </BrowserRouter>
  );
};

export default App;
