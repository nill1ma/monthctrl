import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { Animated } from "react-native";

type ToastType = "success" | "error" | "info";

type Toast = {
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setToast({ message, type });

      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast(null);
      });

      timeoutRef.current = setTimeout(() => setToast(null), 3200);
    },
    [opacity],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 48,
            left: 24,
            right: 24,
            backgroundColor: TOAST_COLORS[toast.type],
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            opacity,
            zIndex: 9999,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 6,
          }}
        >
          <Animated.Text
            style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}
          >
            {toast.message}
          </Animated.Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const TOAST_COLORS: Record<ToastType, string> = {
  success: "#10B981",
  error: "#EF4444",
  info: "#208AEF",
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
