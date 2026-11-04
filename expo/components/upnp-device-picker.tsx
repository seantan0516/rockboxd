import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { RockboxClient } from "@/lib/rockbox-client";

type RawUpnpEntry = {
  name: string;
  displayName?: string | null;
  display_name?: string | null;
  attr?: number;
};

export type UpnpDeviceChoice = { path: string; name: string };

export function UpnpDevicePickerSheet({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (device: UpnpDeviceChoice) => void;
}) {
  const [devices, setDevices] = useState<UpnpDeviceChoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = (await RockboxClient.treeGetEntries("upnp://")) as {
        entries?: RawUpnpEntry[];
      };
      const entries = Array.isArray(response?.entries) ? response.entries : [];
      setDevices(
        entries.map((entry) => ({
          path: entry.name,
          name: entry.displayName ?? entry.display_name ?? entry.name,
        })),
      );
    } catch {
      setDevices([]);
      setError("搜索失败，请确认手机已连接 Wi-Fi 后重试。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) void search();
    else {
      setDevices([]);
      setError(null);
    }
  }, [visible, search]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/60">
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="mt-auto bg-bg-elevated rounded-t-2xl pt-3 pb-8"
          style={{ maxHeight: "78%" }}
        >
          <View className="self-center w-10 h-1 rounded-sm bg-border mb-3" />
          <View className="flex-row items-center justify-between px-5 pb-3">
            <View>
              <Text className="text-text-primary text-lg font-display-bold">
                DLNA 设备
              </Text>
              <Text className="text-text-muted text-xs mt-1">
                搜索同一 Wi-Fi 网络中的媒体服务器
              </Text>
            </View>
            <Pressable
              onPress={() => void search()}
              disabled={loading}
              hitSlop={10}
              className="w-10 h-10 rounded-full bg-bg-card items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.accent} />
              ) : (
                <Ionicons name="refresh" size={20} color={Colors.textPrimary} />
              )}
            </Pressable>
          </View>
          <ScrollView className="px-4" keyboardShouldPersistTaps="handled">
            {loading && devices.length === 0 ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color={Colors.accent} />
                <Text className="text-text-secondary text-sm mt-3">
                  正在搜索 DLNA 设备…
                </Text>
              </View>
            ) : error ? (
              <Text className="text-red-400 text-sm text-center py-8">
                {error}
              </Text>
            ) : devices.length === 0 ? (
              <View className="items-center py-8 px-4">
                <Ionicons
                  name="wifi-outline"
                  size={38}
                  color={Colors.textMuted}
                />
                <Text className="text-text-primary text-sm font-semibold mt-3">
                  没有发现 DLNA 设备
                </Text>
                <Text className="text-text-muted text-xs text-center leading-5 mt-2">
                  请确认手机和电视、电脑或 NAS 连接在同一个 Wi-Fi 网络，并已开启媒体共享。部分路由器的访客网络或 AP 隔离会阻止设备发现。
                </Text>
                <Pressable
                  onPress={() => void search()}
                  className="mt-4 px-5 py-2.5 rounded-full bg-accent"
                >
                  <Text className="text-white text-sm font-semibold">
                    重新搜索
                  </Text>
                </Pressable>
              </View>
            ) : (
              devices.map((device) => (
                <Pressable
                  key={device.path}
                  onPress={() => onSelect(device)}
                  className="flex-row items-center gap-3 px-3 py-4 border-b border-divider active:bg-bg-hover"
                >
                  <View className="w-10 h-10 rounded-full bg-bg-card items-center justify-center">
                    <Ionicons
                      name="tv-outline"
                      size={20}
                      color={Colors.accent}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary text-sm font-semibold">
                      {device.name}
                    </Text>
                    <Text className="text-text-muted text-xs mt-1">
                      DLNA / UPnP 媒体服务器
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.textMuted}
                  />
                </Pressable>
              ))
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
