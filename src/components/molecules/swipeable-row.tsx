// src/components/molecules/swipeable-row.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import Swipeable, {
    SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

type SwipeableRowProps = {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
};

export function SwipeableRow({
  children,
  onEdit,
  onDelete,
}: SwipeableRowProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);

  function RightActions(_prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 120 }],
    }));

    return (
      <Reanimated.View style={[styles.actionsContainer, styleAnimation]}>
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            swipeableRef.current?.close();
            onEdit();
          }}
        >
          <Ionicons name="pencil-outline" size={20} color="#fff" />
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </Pressable>
      </Reanimated.View>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={RightActions}
      rightThreshold={40}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    width: 120,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#208AEF",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
