export type LightingCredit = "gaffer" | "dp-self-gaffed";

export interface LightingStill {
  src: string;
  alt: string;
}

export interface LightingProject {
  id: string;
  title: string;
  credit: LightingCredit;
  href?: string;
  stills: LightingStill[];
}

export const lightingCreditLabels: Record<LightingCredit, string> = {
  gaffer: "GAFFER",
  "dp-self-gaffed": "DP / SELF GAFFED",
};

function stillPath(folder: string, filename: string): string {
  return `/lightingwork/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
}

function stillsFromFolder(folder: string, filenames: string[]): LightingStill[] {
  return filenames.map((filename) => ({
    src: stillPath(folder, filename),
    alt: `${folder} — ${filename}`,
  }));
}

export const lightingProjects: LightingProject[] = [
  {
    id: "feux-better-album-trailer",
    title: "Feux - Better (Album Trailer)",
    credit: "dp-self-gaffed",
    href: "https://youtu.be/LEnG_uDYSFY?si=ye9-MLOmksEKRRRg",
    stills: stillsFromFolder("Feux - Better (Album Trailer)", [
      "IMG_3132.jpg",
      "IMG_3130.jpg",
      "IMG_3129.jpg",
      "IMG_3128.jpg",
      "IMG_3127.jpg",
      "IMG_3126.jpg",
      "IMG_3125.jpg",
    ]),
  },
  {
    id: "florence-rose-in-my-room",
    title: "Florence Rose - In My Room",
    credit: "gaffer",
    href: "https://youtu.be/CMp8fJ9bHZ0?si=eZKphVuGEXa_96qS",
    stills: stillsFromFolder("Florence Rose - In My Room", [
      "Screenshot 2026-09-09 at 19.04.34.png",
      "Screenshot 2026-09-09 at 19.04.45.png",
      "Screenshot 2026-09-09 at 19.42.02.png",
      "Screenshot 2026-09-09 at 19.42.10.png",
      "Screenshot 2026-09-09 at 19.42.19.png",
      "Screenshot 2026-09-09 at 19.42.58.png",
      "Screenshot 2026-09-09 at 19.43.18.png",
      "Screenshot 2026-09-09 at 19.44.06.png",
      "Screenshot 2026-09-09 at 19.44.48.png",
      "Screenshot 2026-09-09 at 19.45.10.png",
    ]),
  },
  {
    id: "loveshy-content",
    title: "Loveshy - Content",
    credit: "dp-self-gaffed",
    stills: stillsFromFolder("Loveshy - Content", [
      "7f31806d-ff33-4775-b753-8b7bdfe18a43.JPG",
      "694c5d01-8678-4ff6-8439-b679e779ad92.JPG",
      "9b85a2ed-2bdd-4b27-acca-24fd36e4e379.JPG",
      "c2004804-b2f7-4fb6-98ae-2cbd3ff60b86.JPG",
      "0fad8384-0bc9-4e92-80ba-d00703a1ea8d.JPG",
      "124e5759-3891-440d-b808-7834b9c64054.JPG",
      "1472cd31-af62-4ba4-b571-3be5707d93a5.JPG",
      "177d86c5-69b6-46b9-a39d-e49f8dee4415.JPG",
      "301e03f2-3589-4d2e-a9b4-5410e9437e1a.JPG",
      "30547993-f410-486d-871c-64183515d5e2.JPG",
      "43963e2c-16e1-4a5d-ab68-8ff38df684d6.JPG",
      "564ff884-f098-49a3-bb2e-00f0c80cc9e4.JPG",
      "588e1d50-edb1-4bf9-86dd-42371e4560e0.JPG",
      "602ac5d9-0d2e-42e3-9796-8efdd5bc54c0.JPG",
      "9a6c8851-fe54-42a6-9d6c-0156e31b66e9.JPG",
      "a3ca2a97-ab65-411c-97cc-8dfb13b1cd41.JPG",
      "c07950e3-8ec5-4356-82f3-0ad1408e7add.JPG",
      "db39c38b-0313-4a91-a515-af46b40a7f04.JPG",
      "eaccd8b4-40bd-4a4a-aaf1-8876f0288dc9.JPG",
    ]),
  },
  {
    id: "loveshy-live-from-the-warehouse",
    title: "Loveshy - Live From The Warehouse",
    credit: "dp-self-gaffed",
    href: "https://youtu.be/YZoetIRKLIg?si=mmo0kUdu8p22Itmi",
    stills: stillsFromFolder("Loveshy - Live From The Warehouse", [
      "Screenshot 2026-09-09 at 19.47.06.png",
      "Screenshot 2026-09-09 at 19.47.28.png",
      "Screenshot 2026-09-09 at 19.47.46.png",
      "Screenshot 2026-09-09 at 19.48.14.png",
      "Screenshot 2026-09-09 at 19.48.27.png",
      "Screenshot 2026-09-09 at 19.49.28.png",
      "Screenshot 2026-09-09 at 19.49.47.png",
      "Screenshot 2026-09-09 at 19.49.54.png",
      "Screenshot 2026-09-09 at 19.50.24.png",
      "Screenshot 2026-09-09 at 19.50.34.png",
    ]),
  },
  {
    id: "scrooples",
    title: "Scrooples (Short Film)",
    credit: "gaffer",
    stills: stillsFromFolder("Scrooples", [
      "28dda53f-f02b-463c-a09b-39ac43b1c29c.JPG",
      "398552b8-8403-4685-a1a9-f6f48c198ea5.JPG",
      "424eec7b-0c9d-43e4-84a4-fab7b09f1a1a.JPG",
      "4a43b142-712d-48dd-a34e-7707bdf08039.JPG",
      "505d0a48-e8a5-4639-a353-1aec201e58bd.JPG",
      "663ba954-8250-4f8d-a6c7-4e221d6cc59f.JPG",
      "6b811743-5a4f-4736-8799-f62f86a65df3.JPG",
      "6def9f42-3238-42a5-b6a6-69ae757b9692.JPG",
      "6e29b897-26ef-40c6-8624-4300171fdd3f.JPG",
      "703b4b09-be15-43d3-a5d9-8b45c447f08a.JPG",
      "75f28877-3e33-44a6-bec1-bb1940401ac9.JPG",
      "7811e30c-ba81-44d7-aa78-b66f8a4ae920.JPG",
      "891f0817-92c7-4922-8588-e013cd2403b2.JPG",
      "8fb93c41-4b10-4449-a0ed-277ab288f245.JPG",
      "9b33b945-a181-47d5-81d1-57cdef2d620b.JPG",
      "a8117204-c4ca-4ea2-986d-915d1827e450.JPG",
      "b733b809-f2f9-4e2d-aa86-fb1f7fa1de0e.JPG",
      "bf59d9c3-30dc-4379-b302-0a31a5721163.JPG",
      "c69d32a6-30a3-4373-b6f8-63e23c4b3152.JPG",
      "cb2770b5-4616-4c45-b6f8-a61511c71ee2.JPG",
      "e0660e2d-50f1-491d-b2c3-8f16a8ea139d.JPG",
      "f1dfc0ea-025e-41c7-992e-0e987602d3c9.JPG",
      "f6635a82-3501-467b-aa4d-250907029698.JPG",
    ]),
  },
  {
    id: "stood-up-in",
    title: "Stood Up (Short Film)",
    credit: "gaffer",
    stills: stillsFromFolder("Stood Up (Short Film)", [
      "Timeline 1_01_00_08_13.jpg",
      "Timeline 1_01_00_31_12.jpg",
      "Timeline 1_01_00_44_22.jpg",
      "Timeline 1_01_01_06_04.jpg",
      "Timeline 1_01_01_11_19.jpg",
      "Timeline 1_01_01_36_09.jpg",
      "Timeline 1_01_01_48_07.jpg",
      "Timeline 1_01_02_04_12.jpg",
      "Timeline 1_01_02_23_15.jpg",
      "Timeline 1_01_03_32_22.jpg",
      "Timeline 1_01_03_40_21.jpg",
      "Timeline 1_01_04_08_18.jpg",
      "Timeline 1_01_06_29_23.jpg",
      "Timeline 1_01_07_39_19.jpg",
      "Timeline 1_01_07_46_11.jpg",
      "Timeline 1_01_09_44_23.jpg",
    ]),
  },
  {
    id: "still-life-coming-soon",
    title: "Still Life (Coming Soon)",
    credit: "dp-self-gaffed",
    stills: stillsFromFolder("Still Life (Coming Soon)", [
      "Day 1s Loops_01_12_43_12.jpg",
      "Day 1s Loops_01_12_48_06.jpg",
      "Day 1s Loops_01_12_51_10.jpg",
      "Day 1s Loops_01_12_57_14.jpg",
      "Day 1s Loops_01_13_07_02.jpg",
      "Day 1s Loops_01_13_31_07.jpg",
      "IMG_3134.jpg",
      "IMG_3135.jpg",
      "IMG_3136.jpg",
    ]),
  },
];
