import * as LucideIcons from "lucide-react";

export const getIconComponent = (iconName: string | null | undefined) => {
  if (!iconName) return LucideIcons.Circle;

  // LucideIconsから該当するアイコンを取得
  const IconComponent = (LucideIcons as any)[iconName];

  return IconComponent || LucideIcons.Circle;
};
