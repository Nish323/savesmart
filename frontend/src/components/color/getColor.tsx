export const getColorBackGround = (colorName: string | null | undefined): string => {
  if (!colorName) return "bg-gray-200";

  const colorMap: Record<string, string> = {
    gray: "bg-gray-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    lime: "bg-lime-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    violet: "bg-violet-500",
  };

  return colorMap[colorName.toLowerCase()] || "bg-gray-200";
};

export const getColorText = (colorName: string | null | undefined): string => {
  if (!colorName) return "text-gray-200";

  const colorMap: Record<string, string> = {
    gray: "text-gray-500",
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    pink: "text-pink-500",
    indigo: "text-indigo-500",
    orange: "text-orange-500",
    teal: "text-teal-500",
    cyan: "text-cyan-500",
    lime: "text-lime-500",
    amber: "text-amber-500",
    rose: "text-rose-500",
    violet: "text-violet-500",
  };

  return colorMap[colorName.toLowerCase()] || "text-gray-200";
};