export type StoreId = "walmart" | "target" | "aldi" | "costco" | "cvs";

export type Store = {
  id: StoreId;
  name: string;
  shortName: string;
  location: string;
};

export const STORES: Store[] = [
  {
    id: "walmart",
    name: "Walmart",
    shortName: "Walmart",
    location: "3400 55th St NW, Rochester",
  },
  {
    id: "target",
    name: "Target",
    shortName: "Target",
    location: "3827 Marketplace Dr NW, Rochester",
  },
  {
    id: "aldi",
    name: "Aldi",
    shortName: "Aldi",
    location: "2215 Commerce Dr NW, Rochester",
  },
  {
    id: "costco",
    name: "Costco",
    shortName: "Costco",
    location: "2020 Commerce Dr NW, Rochester",
  },
  {
    id: "cvs",
    name: "CVS",
    shortName: "CVS",
    location: "Multiple Rochester locations",
  },
];

export type PriceSource = "live" | "estimated";

export type PriceMeta = {
  source: PriceSource;
  /** Short label shown in the UI for live samples */
  label?: string;
};

export type GroceryItem = {
  id: string;
  name: string;
  aliases: string[];
  unit: string;
  category: string;
  prices: Record<StoreId, number>;
  /** Per-store provenance. Missing entries default to estimated. */
  priceMeta?: Partial<Record<StoreId, PriceMeta>>;
};

export const PRICE_AS_OF = "2026-07-24";

export function getPriceMeta(
  item: GroceryItem,
  storeId: StoreId,
): PriceMeta {
  return item.priceMeta?.[storeId] ?? { source: "estimated" };
}

export function countLivePrices(): number {
  return CATALOG.reduce((n, item) => {
    if (!item.priceMeta) return n;
    return (
      n +
      Object.values(item.priceMeta).filter((m) => m?.source === "live").length
    );
  }, 0);
}

/**
 * Rochester, MN prices (USD).
 * Live Instacart ZIP 55901 samples: Aldi, Costco, CVS (see priceMeta).
 * Walmart/Target remain estimated — ZIP scrapers still blocked.
 * Costco live rows are often multipacks; compare units carefully.
 */
export const CATALOG: GroceryItem[] = [
  {
    id: "milk-gallon",
    name: "Whole milk (gallon)",
    aliases: ["milk", "whole milk", "gallon of milk", "2%", "2% milk"],
    unit: "gallon",
    category: "Dairy",
    prices: { walmart: 3.28, target: 3.49, aldi: 3.99, costco: 7.22, cvs: 4.76 },
    priceMeta: { aldi: { source: "live", label: "Instacart Aldi · Friendly Farms 2% ultra-filtered" } },
  },
  {
    id: "eggs-dozen",
    name: "Large eggs (dozen)",
    aliases: ["eggs", "dozen eggs", "large eggs"],
    unit: "dozen",
    category: "Dairy",
    prices: { walmart: 2.48, target: 2.79, aldi: 2.28, costco: 5.46, cvs: 3.6 },
  },
  {
    id: "bread-wheat",
    name: "Wheat bread (loaf)",
    aliases: ["bread", "wheat bread", "loaf of bread", "sandwich bread"],
    unit: "loaf",
    category: "Bakery",
    prices: { walmart: 1.98, target: 2.49, aldi: 1.82, costco: 6.71, cvs: 2.87 },
    priceMeta: { costco: { source: "live", label: "Instacart Costco · Sara Lee whole grain white 2×20 oz" } },
  },
  {
    id: "butter-lb",
    name: "Butter (1 lb)",
    aliases: ["butter", "salted butter", "stick butter"],
    unit: "lb",
    category: "Dairy",
    prices: { walmart: 3.98, target: 4.29, aldi: 6.85, costco: 8.76, cvs: 5.77 },
    priceMeta: { aldi: { source: "live", label: "Instacart Aldi · Simply Nature organic salted 16 oz" } },
  },
  {
    id: "bananas",
    name: "Bananas",
    aliases: ["banana", "bananas"],
    unit: "lb",
    category: "Produce",
    prices: { walmart: 0.54, target: 0.59, aldi: 0.5, costco: 2.72, cvs: 0.78 },
    priceMeta: { costco: { source: "live", label: "Instacart Costco · Organic bananas 3 lb" } },
  },
  {
    id: "apples",
    name: "Apples (Gala)",
    aliases: ["apple", "apples", "gala apples"],
    unit: "lb",
    category: "Produce",
    prices: { walmart: 1.48, target: 1.69, aldi: 1.36, costco: 3.26, cvs: 2.15 },
  },
  {
    id: "chicken-breast",
    name: "Boneless chicken breast",
    aliases: ["chicken", "chicken breast", "chicken breasts"],
    unit: "lb",
    category: "Meat",
    prices: { walmart: 3.47, target: 3.99, aldi: 7.94, costco: 14.92, cvs: 5.03 },
    priceMeta: { aldi: { source: "live", label: "Instacart Aldi · seasoned chicken / lb" }, costco: { source: "live", label: "Instacart Costco · grilled chipotle chicken 2 lb" } },
  },
  {
    id: "ground-beef",
    name: "Ground beef (80/20)",
    aliases: ["ground beef", "hamburger", "beef"],
    unit: "lb",
    category: "Meat",
    prices: { walmart: 4.78, target: 5.29, aldi: 4.4, costco: 10.52, cvs: 6.93 },
  },
  {
    id: "rice-bag",
    name: "White rice (2 lb)",
    aliases: ["rice", "white rice", "bag of rice"],
    unit: "2 lb",
    category: "Pantry",
    prices: { walmart: 1.98, target: 2.29, aldi: 1.82, costco: 4.36, cvs: 2.87 },
  },
  {
    id: "pasta",
    name: "Spaghetti pasta",
    aliases: ["pasta", "spaghetti", "noodles"],
    unit: "16 oz",
    category: "Pantry",
    prices: { walmart: 0.98, target: 1.29, aldi: 0.9, costco: 2.16, cvs: 1.42 },
  },
  {
    id: "pasta-sauce",
    name: "Pasta sauce",
    aliases: ["pasta sauce", "marinara", "spaghetti sauce", "tomato sauce"],
    unit: "24 oz",
    category: "Pantry",
    prices: { walmart: 1.74, target: 1.99, aldi: 1.6, costco: 12.05, cvs: 2.52 },
    priceMeta: { costco: { source: "live", label: "Instacart Costco · Rao's marinara 2×31.7 oz" } },
  },
  {
    id: "cereal",
    name: "Cheerios (family size)",
    aliases: ["cereal", "cheerios", "breakfast cereal"],
    unit: "box",
    category: "Pantry",
    prices: { walmart: 3.98, target: 4.49, aldi: 3.66, costco: 8.76, cvs: 5.77 },
  },
  {
    id: "coffee",
    name: "Ground coffee (12 oz)",
    aliases: ["coffee", "ground coffee", "coffee grounds"],
    unit: "12 oz",
    category: "Pantry",
    prices: { walmart: 5.48, target: 6.29, aldi: 5.04, costco: 23.0, cvs: 7.95 },
    priceMeta: { costco: { source: "live", label: "Instacart Costco · Mayorga Organic Artesano 32 oz" } },
  },
  {
    id: "orange-juice",
    name: "Orange juice (59 oz)",
    aliases: ["oj", "orange juice", "juice"],
    unit: "59 oz",
    category: "Dairy",
    prices: { walmart: 3.48, target: 3.79, aldi: 3.2, costco: 7.66, cvs: 5.05 },
  },
  {
    id: "yogurt",
    name: "Greek yogurt (32 oz)",
    aliases: ["yogurt", "greek yogurt"],
    unit: "32 oz",
    category: "Dairy",
    prices: { walmart: 4.48, target: 4.99, aldi: 4.12, costco: 24.87, cvs: 6.5 },
    priceMeta: { costco: { source: "live", label: "Instacart Costco · Chobani protein drink 12-pack" } },
  },
  {
    id: "cheese",
    name: "Cheddar cheese (8 oz)",
    aliases: ["cheese", "cheddar", "cheddar cheese"],
    unit: "8 oz",
    category: "Dairy",
    prices: { walmart: 2.28, target: 2.49, aldi: 2.1, costco: 10.69, cvs: 3.31 },
    priceMeta: { costco: { source: "live", label: "Instacart Costco · Castello Havarti slices 32 oz" } },
  },
  {
    id: "potatoes",
    name: "Russet potatoes (5 lb)",
    aliases: ["potato", "potatoes", "russet potatoes"],
    unit: "5 lb",
    category: "Produce",
    prices: { walmart: 2.98, target: 3.49, aldi: 2.74, costco: 6.56, cvs: 4.32 },
  },
  {
    id: "onions",
    name: "Yellow onions (3 lb)",
    aliases: ["onion", "onions", "yellow onions"],
    unit: "3 lb",
    category: "Produce",
    prices: { walmart: 1.98, target: 2.29, aldi: 1.82, costco: 4.36, cvs: 2.87 },
  },
  {
    id: "tomatoes",
    name: "Roma tomatoes",
    aliases: ["tomato", "tomatoes", "roma tomatoes"],
    unit: "lb",
    category: "Produce",
    prices: { walmart: 1.48, target: 1.79, aldi: 1.36, costco: 3.26, cvs: 2.15 },
  },
  {
    id: "lettuce",
    name: "Romaine lettuce",
    aliases: ["lettuce", "romaine", "salad"],
    unit: "head",
    category: "Produce",
    prices: { walmart: 1.98, target: 2.29, aldi: 1.82, costco: 4.36, cvs: 2.87 },
  },
  {
    id: "peanut-butter",
    name: "Peanut butter (16 oz)",
    aliases: ["peanut butter", "pb"],
    unit: "16 oz",
    category: "Pantry",
    prices: { walmart: 2.48, target: 2.79, aldi: 2.28, costco: 9.57, cvs: 4.19 },
    priceMeta: { costco: { source: "live", label: "Instacart Costco · Skippy creamy 2×48 oz" }, cvs: { source: "live", label: "Instacart CVS · Skippy reduced fat 16.3 oz" } },
  },
  {
    id: "jelly",
    name: "Strawberry jelly",
    aliases: ["jelly", "jam", "strawberry jelly"],
    unit: "18 oz",
    category: "Pantry",
    prices: { walmart: 2.28, target: 2.49, aldi: 2.1, costco: 5.02, cvs: 3.31 },
  },
  {
    id: "toilet-paper",
    name: "Toilet paper (12 rolls)",
    aliases: ["toilet paper", "tp", "bathroom tissue"],
    unit: "12 rolls",
    category: "Household",
    prices: { walmart: 6.97, target: 7.49, aldi: 6.41, costco: 15.33, cvs: 16.79 },
    priceMeta: { cvs: { source: "live", label: "Instacart CVS · Angel Soft 12 ct" } },
  },
  {
    id: "paper-towels",
    name: "Paper towels (6 rolls)",
    aliases: ["paper towels", "paper towel"],
    unit: "6 rolls",
    category: "Household",
    prices: { walmart: 7.98, target: 8.49, aldi: 7.34, costco: 17.56, cvs: 19.49 },
    priceMeta: { cvs: { source: "live", label: "Instacart CVS · Brawny Tear-A-Square 6 double rolls" } },
  },
  {
    id: "dish-soap",
    name: "Dish soap",
    aliases: ["dish soap", "dawn", "dishwashing liquid"],
    unit: "bottle",
    category: "Household",
    prices: { walmart: 2.98, target: 3.29, aldi: 2.74, costco: 6.56, cvs: 4.32 },
  },
  {
    id: "laundry-detergent",
    name: "Laundry detergent",
    aliases: ["laundry detergent", "detergent", "laundry soap"],
    unit: "bottle",
    category: "Household",
    prices: { walmart: 9.97, target: 11.49, aldi: 9.17, costco: 21.93, cvs: 14.46 },
  },
  {
    id: "bacon",
    name: "Bacon (12 oz)",
    aliases: ["bacon"],
    unit: "12 oz",
    category: "Meat",
    prices: { walmart: 4.48, target: 4.99, aldi: 4.12, costco: 9.86, cvs: 6.5 },
  },
  {
    id: "salmon",
    name: "Atlantic salmon fillet",
    aliases: ["salmon", "fish", "salmon fillet"],
    unit: "lb",
    category: "Meat",
    prices: { walmart: 8.98, target: 9.99, aldi: 8.26, costco: 19.76, cvs: 13.02 },
  },
  {
    id: "frozen-pizza",
    name: "Frozen pizza",
    aliases: ["pizza", "frozen pizza"],
    unit: "each",
    category: "Frozen",
    prices: { walmart: 3.98, target: 4.49, aldi: 3.66, costco: 8.76, cvs: 5.77 },
  },
  {
    id: "ice-cream",
    name: "Ice cream (1.5 qt)",
    aliases: ["ice cream", "icecream"],
    unit: "1.5 qt",
    category: "Frozen",
    prices: { walmart: 3.48, target: 3.99, aldi: 3.2, costco: 7.66, cvs: 5.05 },
  },
  {
    id: "frozen-veggies",
    name: "Frozen mixed vegetables",
    aliases: ["frozen vegetables", "frozen veggies", "mixed vegetables"],
    unit: "12 oz",
    category: "Frozen",
    prices: { walmart: 1.18, target: 1.49, aldi: 1.09, costco: 2.6, cvs: 1.71 },
  },
  {
    id: "soda-12pk",
    name: "Soda (12-pack)",
    aliases: ["soda", "pop", "coke", "cola", "soft drinks"],
    unit: "12-pack",
    category: "Beverages",
    prices: { walmart: 6.98, target: 7.49, aldi: 6.42, costco: 15.36, cvs: 10.12 },
  },
  {
    id: "water-case",
    name: "Bottled water (24-pack)",
    aliases: ["water", "bottled water", "water bottles"],
    unit: "24-pack",
    category: "Beverages",
    prices: { walmart: 3.98, target: 4.49, aldi: 3.66, costco: 8.76, cvs: 5.77 },
  },
  {
    id: "chips",
    name: "Potato chips",
    aliases: ["chips", "potato chips", "lay's"],
    unit: "bag",
    category: "Snacks",
    prices: { walmart: 3.48, target: 3.79, aldi: 3.2, costco: 7.66, cvs: 5.05 },
  },
  {
    id: "cookies",
    name: "Chocolate chip cookies",
    aliases: ["cookies", "chocolate chip cookies"],
    unit: "pkg",
    category: "Snacks",
    prices: { walmart: 2.98, target: 3.29, aldi: 2.74, costco: 6.56, cvs: 4.32 },
  },
  {
    id: "sugar",
    name: "Granulated sugar (4 lb)",
    aliases: ["sugar", "white sugar", "granulated sugar"],
    unit: "4 lb",
    category: "Pantry",
    prices: { walmart: 2.98, target: 3.29, aldi: 2.74, costco: 6.56, cvs: 4.32 },
  },
  {
    id: "flour",
    name: "All-purpose flour (5 lb)",
    aliases: ["flour", "all purpose flour", "ap flour"],
    unit: "5 lb",
    category: "Pantry",
    prices: { walmart: 2.48, target: 2.79, aldi: 2.28, costco: 5.46, cvs: 3.6 },
  },
  {
    id: "olive-oil",
    name: "Olive oil (17 oz)",
    aliases: ["olive oil", "oil"],
    unit: "17 oz",
    category: "Pantry",
    prices: { walmart: 5.98, target: 6.49, aldi: 5.5, costco: 27.36, cvs: 8.67 },
    priceMeta: { costco: { source: "live", label: "Instacart Costco · Kirkland EVOO 2 L" } },
  },
  {
    id: "cereal-bars",
    name: "Granola bars (box)",
    aliases: ["granola bars", "cereal bars", "protein bars"],
    unit: "box",
    category: "Snacks",
    prices: { walmart: 3.48, target: 3.99, aldi: 3.2, costco: 7.66, cvs: 5.05 },
  },
  {
    id: "avocado",
    name: "Avocados",
    aliases: ["avocado", "avocados"],
    unit: "each",
    category: "Produce",
    prices: { walmart: 0.88, target: 1.29, aldi: 0.81, costco: 1.94, cvs: 1.28 },
  },
];

export const ZIP = "55901";
export const CITY = "Rochester, MN";
