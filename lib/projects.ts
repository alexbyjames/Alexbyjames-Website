export type Category = "Commercial" | "Music Video" | "Product" | "Narrative";

export type Project = {
  id: string;
  title: string;
  category: Category;
  year?: number;
  imageSrc: string;   // e.g., "/thumbs/market-day.jpg"
  href: string;       // external Vimeo/YouTube link
};

export const categories: Category[] = ["Commercial", "Music Video", "Product", "Narrative"];

export const projects: Project[] = [
  // Commercial
  {
    id: "commercial-1",
    title: "Market Day",
    category: "Commercial",
    year: 2024,
    imageSrc: "/thumbs/market-day.jpg",
    href: "https://vimeo.com/example1",
  },
  {
    id: "commercial-2",
    title: "Urban Pulse",
    category: "Commercial",
    year: 2024,
    imageSrc: "/thumbs/urban-pulse.jpg",
    href: "https://vimeo.com/example2",
  },
  {
    id: "commercial-3",
    title: "Coastal Drift",
    category: "Commercial",
    year: 2023,
    imageSrc: "/thumbs/coastal-drift.jpg",
    href: "https://vimeo.com/example3",
  },
  {
    id: "commercial-4",
    title: "Night Shift",
    category: "Commercial",
    year: 2023,
    imageSrc: "/thumbs/night-shift.jpg",
    href: "https://vimeo.com/example4",
  },
  // Music Video
  {
    id: "music-1",
    title: "Echoes",
    category: "Music Video",
    year: 2024,
    imageSrc: "/thumbs/echoes.jpg",
    href: "https://youtube.com/watch?v=example1",
  },
  {
    id: "music-2",
    title: "Midnight Run",
    category: "Music Video",
    year: 2024,
    imageSrc: "/thumbs/midnight-run.jpg",
    href: "https://youtube.com/watch?v=example2",
  },
  {
    id: "music-3",
    title: "Desert Storm",
    category: "Music Video",
    year: 2023,
    imageSrc: "/thumbs/desert-storm.jpg",
    href: "https://youtube.com/watch?v=example3",
  },
  {
    id: "music-4",
    title: "City Lights",
    category: "Music Video",
    year: 2023,
    imageSrc: "/thumbs/city-lights.jpg",
    href: "https://youtube.com/watch?v=example4",
  },
  // Product
  {
    id: "product-1",
    title: "Minimalist Watch",
    category: "Product",
    year: 2024,
    imageSrc: "/thumbs/minimalist-watch.jpg",
    href: "https://vimeo.com/product1",
  },
  {
    id: "product-2",
    title: "Luxury Perfume",
    category: "Product",
    year: 2024,
    imageSrc: "/thumbs/luxury-perfume.jpg",
    href: "https://vimeo.com/product2",
  },
  {
    id: "product-3",
    title: "Artisan Coffee",
    category: "Product",
    year: 2023,
    imageSrc: "/thumbs/artisan-coffee.jpg",
    href: "https://vimeo.com/product3",
  },
  {
    id: "product-4",
    title: "Tech Innovation",
    category: "Product",
    year: 2023,
    imageSrc: "/thumbs/tech-innovation.jpg",
    href: "https://vimeo.com/product4",
  },
];

