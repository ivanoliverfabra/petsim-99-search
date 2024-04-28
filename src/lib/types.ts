export type Category = "XPPotion" | "Pet" | "Hoverboard" | "Potion" | "Charm" | "Fruit" | "Misc" | "Egg" | "Booth" | "Enchant" | "Lootbox" | "Seed" | "Box" | "Ultimate";

type BaseCategoryDetails = { id: string };
type SpecialCategoryDetails = { pt?: number, sh?: boolean, tn?: number };

type CategoryDetails = {
  [K in Category]: BaseCategoryDetails & SpecialCategoryDetails;
}

type BaseMappedRapItems = { category: Category, value: number, id: string };
type SpecialMappedRapItems = { golden?: boolean, rainbow?: boolean, shiny?: boolean, tier?: number };

type AllMappedRapItems = {
  [K in Category]: BaseMappedRapItems & SpecialMappedRapItems;
}

export type RapItem<T extends Category> = {
  category: T,
  configData: CategoryDetails[T],
  value: number
}

export type AllRapItems = { [K in Category]: RapItem<K> }[Category];

export type MappedRapItem<T extends Category> = AllMappedRapItems[T];

export type MappedRapItems = {
  [K in Category]: MappedRapItem<K>[];
}