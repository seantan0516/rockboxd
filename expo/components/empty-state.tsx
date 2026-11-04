import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";

/**
 * Empty state shown when the embedded playback service is unavailable.
 */
export function NotConnectedState({
  message = "内置播放服务尚未就绪，请稍后重试；如果持续出现，请重新安装包含内置播放服务的版本。",
  icon = "alert-circle-outline",
}: {
  message?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}) {
  return (
    <View className="px-6 pt-12 items-center">
      <Ionicons name={icon} size={48} color={Colors.textMuted} />
      <Text className="text-text-secondary text-[14px] text-center mt-4 font-sans">
        {message}
      </Text>
    </View>
  );
}
