import axios from "axios";
import { AllRapItems, MappedRapItem, MappedRapItems } from "./types";

const API_URL = "https://biggamesapi.io/api/";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json"
  }
});

export async function fetchRap(): Promise<AllRapItems[]> {
  const response = await api.get("rap").then((res) => res.data);
  return response.data;
}

export function sortRapItems(rapItems: AllRapItems[], sort: "asc" | "desc" | "category" = "asc"): AllRapItems[] {
  return rapItems.sort((a, b) => {
    switch (sort) {
      case "asc":
        return a.value - b.value;
      case "desc":
        return b.value - a.value;
      case "category":
        return a.category.localeCompare(b.category);
    }
  });
}

export function mapRapItems(rapItems: AllRapItems[]): MappedRapItems {
  return rapItems.reduce((acc: MappedRapItems, item: AllRapItems) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    const i: MappedRapItem<typeof item.category> = {
      category: item.category,
      id: item.configData.id,
      golden: 'pt' in item.configData ? item.configData.pt === 1 : undefined,
      rainbow: 'pt' in item.configData ? item.configData.pt === 2 : undefined,
      shiny: 'sh' in item.configData ? item.configData.sh : undefined,
      tier: 'tn' in item.configData ? item.configData.tn : undefined,
      value: item.value
    }

    acc[item.category].push(i);
    return acc;
  }, {} as MappedRapItems);
}