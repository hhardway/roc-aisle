export type StoreId = "walmart" | "target" | "hyvee";

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
    location: "1201 2nd St SW, Rochester",
  },
  {
    id: "hyvee",
    name: "Hy-Vee",
    shortName: "Hy-Vee",
    location: "500 Crossroads Dr SW, Rochester",
  },
];

export type GroceryItem = {
  id: string;
  name: string;
  aliases: string[];
  unit: string;
  category: string;
  prices: Record<StoreId, number>;
};

/**
 * Illustrative Rochester, MN shelf prices (USD).
 * Update this catalog as you check local ads / store apps.
 */
export const CATALOG: GroceryItem[] = [
  {
    id: "milk-gallon",
    name: "Whole milk (gallon)",
    aliases: ["milk", "whole milk", "gallon of milk", "2%", "2% milk"],
    unit: "gallon",
    category: "Dairy",
    prices: { walmart: 3.28, target: 3.49, hyvee: 3.69 },
  },
  {
    id: "eggs-dozen",
    name: "Large eggs (dozen)",
    aliases: ["eggs", "dozen eggs", "large eggs"],
    unit: "dozen",
    category: "Dairy",
    prices: { walmart: 2.48, target: 2.79, hyvee: 2.99 },
  },
  {
    id: "bread-wheat",
    name: "Wheat bread (loaf)",
    aliases: ["bread", "wheat bread", "loaf of bread", "sandwich bread"],
    unit: "loaf",
    category: "Bakery",
    prices: { walmart: 1.98, target: 2.49, hyvee: 2.79 },
  },
  {
    id: "butter-lb",
    name: "Butter (1 lb)",
    aliases: ["butter", "salted butter", "stick butter"],
    unit: "lb",
    category: "Dairy",
    prices: { walmart: 3.98, target: 4.29, hyvee: 4.49 },
  },
  {
    id: "bananas",
    name: "Bananas",
    aliases: ["banana", "bananas"],
    unit: "lb",
    category: "Produce",
    prices: { walmart: 0.54, target: 0.59, hyvee: 0.69 },
  },
  {
    id: "apples",
    name: "Apples (Gala)",
    aliases: ["apple", "apples", "gala apples"],
    unit: "lb",
    category: "Produce",
    prices: { walmart: 1.48, target: 1.69, hyvee: 1.79 },
  },
  {
    id: "chicken-breast",
    name: "Boneless chicken breast",
    aliases: ["chicken", "chicken breast", "chicken breasts"],
    unit: "lb",
    category: "Meat",
    prices: { walmart: 3.47, target: 3.99, hyvee: 4.29 },
  },
  {
    id: "ground-beef",
    name: "Ground beef (80/20)",
    aliases: ["ground beef", "hamburger", "beef"],
    unit: "lb",
    category: "Meat",
    prices: { walmart: 4.78, target: 5.29, hyvee: 5.49 },
  },
  {
    id: "rice-bag",
    name: "White rice (2 lb)",
    aliases: ["rice", "white rice", "bag of rice"],
    unit: "2 lb",
    category: "Pantry",
    prices: { walmart: 1.98, target: 2.29, hyvee: 2.49 },
  },
  {
    id: "pasta",
    name: "Spaghetti pasta",
    aliases: ["pasta", "spaghetti", "noodles"],
    unit: "16 oz",
    category: "Pantry",
    prices: { walmart: 0.98, target: 1.29, hyvee: 1.19 },
  },
  {
    id: "pasta-sauce",
    name: "Pasta sauce",
    aliases: ["pasta sauce", "marinara", "spaghetti sauce", "tomato sauce"],
    unit: "24 oz",
    category: "Pantry",
    prices: { walmart: 1.74, target: 1.99, hyvee: 2.29 },
  },
  {
    id: "cereal",
    name: "Cheerios (family size)",
    aliases: ["cereal", "cheerios", "breakfast cereal"],
    unit: "box",
    category: "Pantry",
    prices: { walmart: 3.98, target: 4.49, hyvee: 4.79 },
  },
  {
    id: "coffee",
    name: "Ground coffee (12 oz)",
    aliases: ["coffee", "ground coffee", "coffee grounds"],
    unit: "12 oz",
    category: "Pantry",
    prices: { walmart: 5.48, target: 6.29, hyvee: 6.99 },
  },
  {
    id: "orange-juice",
    name: "Orange juice (59 oz)",
    aliases: ["oj", "orange juice", "juice"],
    unit: "59 oz",
    category: "Dairy",
    prices: { walmart: 3.48, target: 3.79, hyvee: 3.99 },
  },
  {
    id: "yogurt",
    name: "Greek yogurt (32 oz)",
    aliases: ["yogurt", "greek yogurt"],
    unit: "32 oz",
    category: "Dairy",
    prices: { walmart: 4.48, target: 4.99, hyvee: 5.29 },
  },
  {
    id: "cheese",
    name: "Cheddar cheese (8 oz)",
    aliases: ["cheese", "cheddar", "cheddar cheese"],
    unit: "8 oz",
    category: "Dairy",
    prices: { walmart: 2.28, target: 2.49, hyvee: 2.69 },
  },
  {
    id: "potatoes",
    name: "Russet potatoes (5 lb)",
    aliases: ["potato", "potatoes", "russet potatoes"],
    unit: "5 lb",
    category: "Produce",
    prices: { walmart: 2.98, target: 3.49, hyvee: 3.29 },
  },
  {
    id: "onions",
    name: "Yellow onions (3 lb)",
    aliases: ["onion", "onions", "yellow onions"],
    unit: "3 lb",
    category: "Produce",
    prices: { walmart: 1.98, target: 2.29, hyvee: 2.49 },
  },
  {
    id: "tomatoes",
    name: "Roma tomatoes",
    aliases: ["tomato", "tomatoes", "roma tomatoes"],
    unit: "lb",
    category: "Produce",
    prices: { walmart: 1.48, target: 1.79, hyvee: 1.69 },
  },
  {
    id: "lettuce",
    name: "Romaine lettuce",
    aliases: ["lettuce", "romaine", "salad"],
    unit: "head",
    category: "Produce",
    prices: { walmart: 1.98, target: 2.29, hyvee: 2.49 },
  },
  {
    id: "peanut-butter",
    name: "Peanut butter (16 oz)",
    aliases: ["peanut butter", "pb"],
    unit: "16 oz",
    category: "Pantry",
    prices: { walmart: 2.48, target: 2.79, hyvee: 2.98 },
  },
  {
    id: "jelly",
    name: "Strawberry jelly",
    aliases: ["jelly", "jam", "strawberry jelly"],
    unit: "18 oz",
    category: "Pantry",
    prices: { walmart: 2.28, target: 2.49, hyvee: 2.69 },
  },
  {
    id: "toilet-paper",
    name: "Toilet paper (12 rolls)",
    aliases: ["toilet paper", "tp", "bathroom tissue"],
    unit: "12 rolls",
    category: "Household",
    prices: { walmart: 6.97, target: 7.49, hyvee: 8.29 },
  },
  {
    id: "paper-towels",
    name: "Paper towels (6 rolls)",
    aliases: ["paper towels", "paper towel"],
    unit: "6 rolls",
    category: "Household",
    prices: { walmart: 7.98, target: 8.49, hyvee: 9.29 },
  },
  {
    id: "dish-soap",
    name: "Dish soap",
    aliases: ["dish soap", "dawn", "dishwashing liquid"],
    unit: "bottle",
    category: "Household",
    prices: { walmart: 2.98, target: 3.29, hyvee: 3.49 },
  },
  {
    id: "laundry-detergent",
    name: "Laundry detergent",
    aliases: ["laundry detergent", "detergent", "laundry soap"],
    unit: "bottle",
    category: "Household",
    prices: { walmart: 9.97, target: 11.49, hyvee: 12.99 },
  },
  {
    id: "bacon",
    name: "Bacon (12 oz)",
    aliases: ["bacon"],
    unit: "12 oz",
    category: "Meat",
    prices: { walmart: 4.48, target: 4.99, hyvee: 5.49 },
  },
  {
    id: "salmon",
    name: "Atlantic salmon fillet",
    aliases: ["salmon", "fish", "salmon fillet"],
    unit: "lb",
    category: "Meat",
    prices: { walmart: 8.98, target: 9.99, hyvee: 10.49 },
  },
  {
    id: "frozen-pizza",
    name: "Frozen pizza",
    aliases: ["pizza", "frozen pizza"],
    unit: "each",
    category: "Frozen",
    prices: { walmart: 3.98, target: 4.49, hyvee: 4.99 },
  },
  {
    id: "ice-cream",
    name: "Ice cream (1.5 qt)",
    aliases: ["ice cream", "icecream"],
    unit: "1.5 qt",
    category: "Frozen",
    prices: { walmart: 3.48, target: 3.99, hyvee: 4.29 },
  },
  {
    id: "frozen-veggies",
    name: "Frozen mixed vegetables",
    aliases: ["frozen vegetables", "frozen veggies", "mixed vegetables"],
    unit: "12 oz",
    category: "Frozen",
    prices: { walmart: 1.18, target: 1.49, hyvee: 1.39 },
  },
  {
    id: "soda-12pk",
    name: "Soda (12-pack)",
    aliases: ["soda", "pop", "coke", "cola", "soft drinks"],
    unit: "12-pack",
    category: "Beverages",
    prices: { walmart: 6.98, target: 7.49, hyvee: 7.99 },
  },
  {
    id: "water-case",
    name: "Bottled water (24-pack)",
    aliases: ["water", "bottled water", "water bottles"],
    unit: "24-pack",
    category: "Beverages",
    prices: { walmart: 3.98, target: 4.49, hyvee: 4.79 },
  },
  {
    id: "chips",
    name: "Potato chips",
    aliases: ["chips", "potato chips", "lay's"],
    unit: "bag",
    category: "Snacks",
    prices: { walmart: 3.48, target: 3.79, hyvee: 3.99 },
  },
  {
    id: "cookies",
    name: "Chocolate chip cookies",
    aliases: ["cookies", "chocolate chip cookies"],
    unit: "pkg",
    category: "Snacks",
    prices: { walmart: 2.98, target: 3.29, hyvee: 3.49 },
  },
  {
    id: "sugar",
    name: "Granulated sugar (4 lb)",
    aliases: ["sugar", "white sugar", "granulated sugar"],
    unit: "4 lb",
    category: "Pantry",
    prices: { walmart: 2.98, target: 3.29, hyvee: 3.49 },
  },
  {
    id: "flour",
    name: "All-purpose flour (5 lb)",
    aliases: ["flour", "all purpose flour", "ap flour"],
    unit: "5 lb",
    category: "Pantry",
    prices: { walmart: 2.48, target: 2.79, hyvee: 2.98 },
  },
  {
    id: "olive-oil",
    name: "Olive oil (17 oz)",
    aliases: ["olive oil", "oil"],
    unit: "17 oz",
    category: "Pantry",
    prices: { walmart: 5.98, target: 6.49, hyvee: 6.99 },
  },
  {
    id: "cereal-bars",
    name: "Granola bars (box)",
    aliases: ["granola bars", "cereal bars", "protein bars"],
    unit: "box",
    category: "Snacks",
    prices: { walmart: 3.48, target: 3.99, hyvee: 4.29 },
  },
  {
    id: "avocado",
    name: "Avocados",
    aliases: ["avocado", "avocados"],
    unit: "each",
    category: "Produce",
    prices: { walmart: 0.88, target: 1.29, hyvee: 1.19 },
  },
];

export const ZIP = "55901";
export const CITY = "Rochester, MN";
