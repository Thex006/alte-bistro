/**
 * Every fact on the site lives here, so a client handover is one file.
 * Source: the Alte Bistro brief and the client's own photographs.
 */

// TODO(client): replace with the restaurant's own OpenTable listing URL once it exists.
export const OPENTABLE_URL =
  "https://www.opentable.com/s?term=Alte%20Bistro%20Budapest&covers=2";

export const site = {
  name: "Alte Bistro",
  url: "http://localhost:3000",
  description:
    "Upscale, moody fusion bistro in Budapest's seventh district. West African heat meets Central European comfort. Open Wednesday to Sunday, 18:00 to 01:00.",
  address: {
    street: "Kazinczy utca 14",
    city: "1075 Budapest",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Kazinczy+utca+14%2C+1075+Budapest",
  },
  /** Opening days, JS getDay() numbers: 0 is Sunday. */
  openDays: [3, 4, 5, 6, 0],
  opens: "18:00",
  closes: "01:00",
  press: "Dining Guide Hungary",
} as const;

export const hours = [
  { day: "Monday", time: "Closed" },
  { day: "Tuesday", time: "Closed" },
  { day: "Wednesday", time: "18:00 to 01:00" },
  { day: "Thursday", time: "18:00 to 01:00" },
  { day: "Friday", time: "18:00 to 01:00" },
  { day: "Saturday", time: "18:00 to 01:00" },
  { day: "Sunday", time: "18:00 to 01:00" },
] as const;

export type Dish = {
  id: string;
  name: string;
  price?: number;
  note: string;
  image: string;
  alt: string;
};

/** The three signatures from the brief, with the brief's prices. */
export const signatures: Dish[] = [
  {
    id: "suya",
    name: "Truffle Suya Skewers",
    price: 3500,
    note: "Suya spice from the West African grill, finished with truffle",
    image: "/images/suya-skewers.jpg",
    alt: "Charred suya skewers with micro herbs on a stoneware plate",
  },
  {
    id: "duck",
    name: "The “Nyíregyháza” Duck Breast",
    price: 6500,
    note: "Hungarian duck, seared pink, over a golden purée and dark jus",
    image: "/images/duck-breast.jpg",
    alt: "Sliced pink duck breast on orange purée with dark jus",
  },
  {
    id: "jack",
    name: "Signature Jack & Cola",
    price: 3000,
    note: "The house whiskey pour, built at the bar the way regulars ask for it",
    image: "/images/bar.jpg",
    alt: "Bartender working the candlelit bar at Alte Bistro",
  },
];

/** More from the client's photo set. No prices were given, so none are shown. */
export const morePlates = [
  {
    name: "Smash burger",
    image: "/images/smash-burger.jpg",
    alt: "Double smash burger with melted cheese and fries on a steel tray",
  },
  {
    name: "Plantain and pork belly",
    image: "/images/plantain-pork-belly.jpg",
    alt: "Fried plantain and crisp pork belly with chilli in a dark bowl",
  },
  {
    name: "The red coupe",
    image: "/images/red-coupe.jpg",
    alt: "Deep red cocktail in a coupe glass on the brass bar",
  },
] as const;

export const chapters = [
  {
    time: "18:00",
    title: "The door on Kazinczy utca",
    body: "The neon comes on and the seventh district starts to fill. Doors open at six, Wednesday to Sunday.",
    image: "/images/facade.jpg",
    alt: "Alte Bistro shopfront with its neon sign on a cobbled Budapest street",
  },
  {
    time: "19:30",
    title: "Under the brick vaults",
    body: "Candles on every table, a long room of arches and low conversation.",
    image: "/images/cellar-dining.jpg",
    alt: "Candlelit vaulted brick cellar dining room",
  },
  {
    time: "21:00",
    title: "Velvet and slow plates",
    body: "Deep booths for tables that plan to stay. Order another round of skewers.",
    image: "/images/velvet-booth.jpg",
    alt: "Velvet booth with cushions, art prints and a single candle",
  },
  {
    time: "23:00",
    title: "The whiskey pour",
    body: "The bar takes over. The pour regulars write about, served over one big cube.",
    image: "/images/old-fashioned.jpg",
    alt: "Whiskey cocktail with an orange peel in a crystal glass on the bar",
  },
  {
    time: "01:00",
    title: "Last call",
    body: "Street food hours, fine dining manners. Book the table and stay until close.",
    image: "/images/reserved-sign.jpg",
    alt: "Brass reserved sign beside a candle on a dark table",
  },
] as const;

/**
 * DEMO CONTENT. These are sample reviews written for this concept site.
 * The brief says the real reviews are five stars and praise the vibe and
 * the signature whiskey pour. Replace with real, attributed reviews before launch.
 */
export const sampleReviews = [
  {
    quote:
      "The room feels like a secret. Candles, brick, a playlist that never gets too loud. We stayed until they turned the lights up.",
    name: "Réka Szalai",
    context: "Dinner for two",
  },
  {
    quote:
      "Order the Jack and cola even if you think you know it. They pour it properly, and the suya skewers next to it make the whole night.",
    name: "Tom Brennan",
    context: "Visiting from Dublin",
  },
  {
    quote:
      "Suya heat with a Hungarian duck on the same table. It should not work this well. It does.",
    name: "Ifeoma Nwachukwu",
    context: "Birthday table",
  },
  {
    quote:
      "Best whiskey pour on Kazinczy utca, and that street has a lot of bars.",
    name: "Márton Kiss",
    context: "Regular",
  },
] as const;

export const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#night", label: "The night" },
  { href: "#story", label: "Story" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
] as const;

export function formatHuf(value: number): string {
  // Hungarian grouping uses a space: 3 500 HUF
  return `${value.toLocaleString("hu-HU").replace(/ /g, " ")} HUF`;
}
