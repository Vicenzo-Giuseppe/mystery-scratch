export type Outfit = "casual" | "street" | "formal" | "sporty";

export type ClothingItem = "jacket" | "shirt" | "pants" | "sneakers";

export interface ClothingConfig {
  color: string;
  accentColor: string;
  material: "cotton" | "leather" | "denim" | "synthetic";
}
