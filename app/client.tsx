"use client";

import dynamic from "next/dynamic";
import { AlertProvider } from "./contexts/AlertContext";

const App = dynamic(() => import("./components/App"), { ssr: false });

export function ClientOnly() {
  return (
    <AlertProvider>
      <App />{" "}
    </AlertProvider>
  );
}
