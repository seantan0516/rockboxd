import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { ndPing } from "@/lib/navidrome-client";
import {
  hydrateNdServers,
  ndAddServer,
  ndRemoveServer,
  ndSetActiveServer,
  useNdServers,
} from "@/lib/navidrome-store";
import { useBottomSpacing } from "@/lib/use-bottom-spacing";

export default function NavidromeSettingsScreen() {
  const { servers, activeId } = useNdServers();
  const [url, setUrl] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomPad = useBottomSpacing(24);

  useEffect(() => { hydrateNdServers(); }, []);

  const onConnect = async () => {
    const trimUrl = url.trim().replace(/\/$/, "");
    const trimUser = user.trim();
    if (!trimUrl || !trimUser || !pass) {
      setError("请输入服务器地址、用户名和密码。");
      return;
    }
    setConnecting(true);
    setError(null);
    const ok = await ndPing(trimUrl, trimUser, pass);
    if (!ok) {
      setError("连接失败，请检查服务器地址和登录信息。");
      setConnecting(false);
      return;
    }
    const label = trimUrl.replace(/https?:\/\//, "").split("/")[0] ?? trimUrl;
    await ndAddServer({ label, baseUrl: trimUrl, user: trimUser, password: pass });
    setUrl("");
    setUser("");
    setPass("");
    setConnecting(false);
  };

  const onDelete = (id: string, label: string) => {
    Alert.alert(
      "删除服务器",
      `确定删除“${label}”吗？`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: () => ndRemoveServer(id),
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 gap-3 border-b border-divider">
        <Pressable hitSlop={10} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </Pressable>
        <Text className="text-text-primary text-[18px] font-display-extra">
          Navidrome / Subsonic
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: bottomPad }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Connected servers */}
          {servers.length > 0 && (
            <View className="mt-4 px-4">
              <Text className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-2 font-sans">
                已连接的服务器
              </Text>
              <View className="bg-bg-card rounded-xl overflow-hidden">
                {servers.map((s, idx) => {
                  const isActive = s.id === activeId;
                  return (
                    <View key={s.id}>
                      {idx > 0 && <View className="h-px bg-divider ml-14" />}
                      <Pressable
                        onPress={() => ndSetActiveServer(s.id)}
                        className="flex-row items-center px-4 py-3.5 gap-3 active:bg-bg-hover"
                      >
                        <View
                          className={`w-9 h-9 rounded-full items-center justify-center ${isActive ? "bg-accent" : "bg-bg-elevated"}`}
                        >
                          <Ionicons
                            name="musical-notes"
                            size={18}
                            color={isActive ? "#FFFFFF" : Colors.textSecondary}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-text-primary text-[14px] font-semibold font-sans">
                            {s.label}
                          </Text>
                          <Text className="text-text-secondary text-[12px] mt-0.5 font-mono">
                            {s.user}@{s.baseUrl.replace(/https?:\/\//, "")}
                          </Text>
                        </View>
                        {isActive ? (
                          <Ionicons name="checkmark" size={20} color={Colors.accent} />
                        ) : null}
                        <Pressable
                          hitSlop={10}
                          onPress={() => onDelete(s.id, s.label)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#FF4444"
                          />
                        </Pressable>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Add server form */}
          <View className="mt-6 px-4">
            <Text className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-2 font-sans">
              添加服务器
            </Text>
            <View className="bg-bg-card rounded-xl px-4 py-3 gap-2.5">
              <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="服务器地址（例如 http://192.168.1.10:4533）"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                className="text-text-primary text-[14px] font-mono"
              />
              <View className="h-px bg-divider" />
              <TextInput
                value={user}
                onChangeText={setUser}
                placeholder="用户名"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                className="text-text-primary text-[14px] font-sans"
              />
              <View className="h-px bg-divider" />
              <TextInput
                value={pass}
                onChangeText={setPass}
                placeholder="密码"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                className="text-text-primary text-[14px] font-sans"
              />
              {error ? (
                <Text className="text-danger text-[13px] font-sans mt-1">
                  {error}
                </Text>
              ) : null}
              <Pressable
                disabled={connecting || !url.trim() || !user.trim() || !pass}
                onPress={onConnect}
                className={`mt-2 self-start px-4 py-2 rounded-full items-center flex-row gap-2 ${
                  connecting || !url.trim() || !user.trim() || !pass
                    ? "bg-bg-hover"
                    : "bg-accent active:opacity-80"
                }`}
              >
                {connecting && (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                )}
                <Text className="text-white text-[13px] font-display">
                  {connecting ? "正在连接…" : "连接"}
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-6 px-4">
            <Text className="text-text-secondary text-[13px] font-sans leading-5">
              可连接 Navidrome 或任何兼容 Subsonic 协议的服务器。密码仅保存在本设备上，用于为每次 API 请求计算身份验证令牌。
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
