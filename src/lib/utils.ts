import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatValue(value: number, type: "short" | "long" = "short") {
  switch (type) {
    case "short":
      if (value < 1000) {
        return value.toString();
      } else if (value < 1000000) {
        return `${(value / 1000).toFixed(1)}K`;
      } else if (value < 1000000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value < 1000000000000) {
        return `${(value / 1000000000).toFixed(1)}B`;
      } else {
        return `${(value / 1000000000000).toFixed(1)}T`;
      }
    case "long":
      return value.toLocaleString();
    }
}