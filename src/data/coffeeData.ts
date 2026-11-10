export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  tag: string;
  image: string;
  notes: string[];
  rating?: number;
  isDark?: boolean;
}

export const SIGNATURE_PRODUCTS: Product[] = [
  {
    id: "frosted-bean-velvet",
    name: "Frosted Bean Velvet",
    category: "Popular Blends",
    description: "Rich cold-extracted espresso marbled with velvety cream and slow-churned vanilla ice.",
    price: 7.5,
    tag: "Signature Blend",
    image: "/images/coffee-cups/frosted-bean-velvet.png",
    notes: ["Velvet Cream", "Roasted Hazelnut", "Dark Cacao"],
    rating: 4.8,
  },
  {
    id: "iced-caramel-drift",
    name: "Iced Caramel Drift",
    category: "Popular Blends",
    description: "Slow-dripped dark roast layered with buttery salted caramel ribbons and crystal ice.",
    price: 6.75,
    tag: "Popular Pick",
    image: "/images/coffee-cups/iced-caramel-drift.png",
    notes: ["Salted Caramel", "Brown Butter", "Smoky Molasses"],
    rating: 4.8,
  },
  {
    id: "vanilla-ice-latte",
    name: "Vanilla Ice Latte",
    category: "Popular Blends",
    description: "Espresso gently swirled through whole milk infused with pure Madagascar vanilla pod.",
    price: 5.5,
    tag: "Daily Classic",
    image: "/images/coffee-cups/vanilla-ice-latte.png",
    notes: ["Madagascar Vanilla", "Sweet Milk", "Toasted Almond"],
    rating: 4.8,
  },
  {
    id: "cocoa-ice-latte",
    name: "Cocoa Ice Latte",
    category: "Cold Brew",
    description: "Single-origin espresso poured over rich artisan dark chocolate cocoa and iced milk.",
    price: 6.0,
    tag: "Chocolatier Special",
    image: "/images/coffee-cups/cocoa-ice-latte.png",
    notes: ["Dark Cocoa", "Espresso Swirl", "Creamy Finish"],
    rating: 4.8,
  },
  {
    id: "cold-brew-cloud",
    name: "Cold Brew Cloud",
    category: "Cold Brew",
    description: "20-hour steeped highland cold brew crowned with a golden, silky sweet cream cloud.",
    price: 7.0,
    tag: "Barista Favorite",
    image: "/images/coffee-cups/cold-brew-cloud.png",
    notes: ["Floral Bergamot", "Golden Caramel", "Silky Foam"],
    rating: 4.8,
  },
  {
    id: "iced-hazelnut-latte",
    name: "Iced Hazelnut Latte",
    category: "Frappuccino",
    description: "Decadent iced latte piled high with whipped cream and roasted hazelnut praline crunch.",
    price: 7.25,
    tag: "Sweet Delight",
    image: "/images/coffee-cups/iced-hazelnut-latte.png",
    notes: ["Praline Hazelnut", "Whipped Cream", "Golden Toffee"],
    rating: 4.8,
  },
];

export const GALLERY_IMAGES = [
  {
    id: "gal-1",
    title: "The Golden Morning Pour",
    caption: "Sunlit iced latte marbling on terrazzo counters",
    aspect: "tall",
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "gal-2",
    title: "Handcrafted With Care",
    caption: "Barista tuning the Mahlkönig grinder for the morning dial-in",
    aspect: "wide",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "gal-3",
    title: "Ceramic Warmth",
    caption: "Handmade terracotta cups resting before the rush",
    aspect: "square",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "gal-4",
    title: "Café Sanctuary",
    caption: "Soft blush walls, oak wood, and slow conversations",
    aspect: "tall",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "gal-5",
    title: "Flaky Morning Pastries",
    caption: "Golden sourdough croissants baked before sunrise",
    aspect: "square",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "gal-6",
    title: "The Daily Ritual",
    caption: "A good book, gentle jazz, and your favourite brew",
    aspect: "wide",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=85",
  },
];

export const PHILOSOPHY_VALUES = [
  {
    number: "01",
    title: "Quality First",
    headline: "Thoughtfully prepared coffee using quality ingredients.",
    description:
      "We source exclusively single-origin, specialty-grade Arabica beans directly from family-run estates across Yirgacheffe, Huila, and Antigua. Every batch is profiled on our vintage Diedrich roaster to celebrate natural sweetness and origin clarity.",
    subnote: "Direct trade · 100% Arabica · Omniroast",
  },
  {
    number: "02",
    title: "Little Moments",
    headline: "Creating a place where everyday moments feel special.",
    description:
      "Modern life moves at breakneck speed. Lume was built as a soft pause button—a warm, blush-toned haven where you can take a deep breath, savour the aroma of freshly pulled espresso, and linger just a little bit longer.",
    subnote: "Warm hospitality · Curated vinyl · Slow mornings",
  },
  {
    number: "03",
    title: "Good Energy",
    headline: "Coffee, community and a little extra happiness.",
    description:
      "From the smile when you walk through our wooden door to the golden glow of our cups, good coffee is the spark that lights up brighter days. We reinvest in our barista teams, ethical packaging, and neighborhood connections.",
    subnote: "Compostable cups · Solar roasted · Community first",
  },
];

