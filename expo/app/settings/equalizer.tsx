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
  const [selected, setSelected] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("点击任一预设即可立即应用");
  const connected = useIsConnected();
  const preset = EQ_PRESETS.find((item) => item.id === selected);

  const applyPreset = async (item: (typeof EQ_PRESETS)[number]) => {
    if (applying) return;
    if (!connected) {
      Alert.alert("播放服务未就绪", "内置播放服务尚未准备好，请稍后重试。");
      return;
    }

    setApplying(true);
    setApplyMessage("正在应用「" + item.name + "」…");
    try {
      await RockboxClient.setEq({ enabled: item.enabled, precut: item.precut, bands: item.bands });
      setSelected(item.id);
      setApplyMessage("已写入播放 DSP：" + item.name);
    } catch {
      setApplyMessage("写入失败，请检查内置播放服务状态后重试");
      Alert.alert("均衡器应用失败", "播放端没有确认写入「" + item.name + "」预设，请稍后重试。");
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
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 128 }}>
          <Text className="text-text-secondary text-sm mb-3">选择一个五段均衡器预设，点选后会自动应用</Text>
          {EQ_PRESETS.map((item) => {
            const active = item.id === selected;
            return (
              <Pressable key={item.id} disabled={applying} onPress={() => void applyPreset(item)}
                className={active ? "flex-row items-center justify-between rounded-xl px-4 py-4 mb-2 bg-bg-hover border border-accent" : "flex-row items-center justify-between rounded-xl px-4 py-4 mb-2 bg-bg-card"}>
                <View className="flex-1">
                  <Text className="text-text-primary text-base font-semibold">{item.name}</Text>
                  <Text className="text-text-muted text-xs mt-1">预衰减：{item.precut} · 5 段</Text>
                </View>
                {applying && active ? (
                  <Text className="text-accent text-xs">应用中…</Text>
                ) : (
                  <Ionicons name={active ? "checkmark-circle" : "radio-button-off"} size={22} color={active ? Colors.accent : Colors.textMuted} />
                )}
              </Pressable>
            );
          })}
          <Text className="text-accent text-xs mt-2 mb-2">{applyMessage}</Text>
          <View className="bg-bg-card rounded-xl p-4 mt-2">
            <Text className="text-text-primary font-semibold mb-3">预设参数（Rockbox 原始值）</Text>
            {preset ? preset.bands.map((band, index) => (
              <View key={index} className="flex-row justify-between py-2 border-b border-divider">
                <Text className="text-text-secondary text-sm">第 {index + 1} 段 · {band.cutoff} Hz</Text>
                <Text className="text-text-primary text-sm font-mono">Q 值 {band.q} / 增益 {band.gain}</Text>
              </View>
            )) : (
              <Text className="text-text-muted text-sm">选择预设后，这里会显示对应的五段参数。</Text>
            )}
          </View>
          <Text className="text-text-muted text-xs mt-3 leading-5">提示：这些数值按你上传的 .cfg 原样写入。部分预设含较大正增益，可能造成削波或失真；建议先降低手机音量，再试听并谨慎调高。</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
