import { createContext, ReactNode, useContext, useState } from "react";
import { AlertPopup } from "@/components/ui/alert-popup";

interface AlertContextType {
  showAlert: (message: string, type?: "success" | "error" | "info") => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showAlert = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setAlert({ message, type });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
