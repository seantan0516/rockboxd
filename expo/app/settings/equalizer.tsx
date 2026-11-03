import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { EQ_PRESETS } from "@/lib/eq-presets";
import { RockboxClient } from "@/lib/rockbox-client";
import { useIsConnected } from "@/lib/connection";

export default function EqualizerScreen() {
  const [selected, setSelected] = useState(EQ_PRESETS[0].id);
  const [applying, setApplying] = useState(false);
  const connected = useIsConnected();
  const preset = EQ_PRESETS.find((item) => item.id === selected) ?? EQ_PRESETS[0];

  const apply = async () => {
    if (!connected) {
      Alert.alert("尚未连接服务器", "请先连接 Rockbox 服务器，再应用均衡器预设。");
      return;
    }
    setApplying(true);
    try {
      await RockboxClient.setEq({ enabled: preset.enabled, precut: preset.precut, bands: preset.bands });
      Alert.alert("应用成功", "已应用「" + preset.name + "」均衡器预设。");
    } catch {
      Alert.alert("应用失败", "服务器未能应用均衡器设置，请检查连接后重试。");
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
        <View className="flex-row items-center px-4 py-3 gap-3">
          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
          </Pressable>
          <Text className="text-text-primary text-[22px] font-display-extra">均衡器</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
          <Text className="text-text-secondary text-sm mb-3">选择一个五段均衡器预设</Text>
          {EQ_PRESETS.map((item) => {
            const active = item.id === selected;
            return (
              <Pressable key={item.id} onPress={() => setSelected(item.id)}
                className={active ? "flex-row items-center justify-between rounded-xl px-4 py-4 mb-2 bg-bg-hover border border-accent" : "flex-row items-center justify-between rounded-xl px-4 py-4 mb-2 bg-bg-card"}>
                <View className="flex-1">
                  <Text className="text-text-primary text-base font-semibold">{item.name}</Text>
                  <Text className="text-text-muted text-xs mt-1">预衰减：{item.precut} · 5 段</Text>
                </View>
                <Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={22} color={active ? Colors.accent : Colors.textMuted} />
              </Pressable>
            );
          })}
          <View className="bg-bg-card rounded-xl p-4 mt-3">
            <Text className="text-text-primary font-semibold mb-3">预设参数（Rockbox 原始值）</Text>
            {preset.bands.map((band, index) => (
              <View key={index} className="flex-row justify-between py-2 border-b border-divider">
                <Text className="text-text-secondary text-sm">第 {index + 1} 段 · {band.cutoff} Hz</Text>
                <Text className="text-text-primary text-sm font-mono">Q 值 {band.q} / 增益 {band.gain}</Text>
              </View>
            ))}
          </View>
          <Text className="text-text-muted text-xs mt-3 leading-5">提示：这些数值按你上传的 .cfg 原样写入。部分预设含较大正增益，可能造成削波或失真；建议先降低手机音量，再试听并谨慎调高。</Text>
          <Pressable disabled={applying} onPress={apply} className="bg-accent rounded-full py-4 items-center mt-5">
            <Text className="text-white font-semibold">{applying ? "正在应用…" : "应用此预设"}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
