import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertPopupProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function AlertPopup({
  message,
  type = "info",
  duration = 2000,
  onClose,
}: AlertPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300); // 페이드아웃 애니메이션 시간
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center">
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-6 py-4 shadow-lg transition-all duration-300",
          {
            "bg-green-100 text-green-900 border border-green-200":
              type === "success",
            "bg-red-100 text-red-900 border border-red-200": type === "error",
            "bg-blue-100 text-blue-900 border border-blue-200": type === "info",
          },
          isLeaving
            ? "opacity-0 transform -translate-y-2"
            : "opacity-100 transform translate-y-0",
          "animate-in slide-in-from-top-4",
        )}
      >
        {type === "success" && (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        )}
        {type === "error" && <XCircle className="h-5 w-5 text-red-600" />}
        {type === "info" && <AlertCircle className="h-5 w-5 text-blue-600" />}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
