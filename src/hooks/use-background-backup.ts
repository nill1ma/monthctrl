import { useEffect } from "react";
import { AppState } from "react-native";

export function useBackgroundBackup(flushFn: () => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        flushFn();
      }
    });
    return () => subscription.remove();
  }, [flushFn]);
}
