export type SectionId = "art" | "music" | "commercial";

export type ProjectRole = "cinematographer" | "director" | "both";

export type EmbedProvider = "youtube" | "vimeo" | "file";

export interface FeaturedProject {
  title: string;
  slug: string;
  href?: string;
  embed?: EmbedProvider;
  role?: ProjectRole;
}

export interface SectionConfig {
  id: SectionId;
  label: string;
  projects: FeaturedProject[];
}

export const featuredSections: SectionConfig[] = [
  {
    id: "art",
    label: "Art",
    projects: [
      { title: "16mm Work", slug: "16mm-work" },
      {
        title: "Autograph Gallery",
        slug: "autograph-gallery",
        href: "https://vimeo.com/580345427",
        embed: "vimeo",
        role: "director",
      },
    ],
  },
  {
    id: "music",
    label: "Music Videos",
    projects: [
      { title: "Master Peace – Good Time", slug: "master-peace-good-time" },
      { title: "Master Peace – Stupid Kids", slug: "master-peace-stupid-kids" },
      { title: "Master Peace – Fuck It Up", slug: "master-peace-fuck-it-up" },
      {
        title: "Mandrake Handshake – Emonzaemon",
        slug: "mandrake-handshake-emonzaemon",
        href: "https://youtu.be/-XrM7h5rRcY?si=lA4LXr1eIZOB3SkZ",
        embed: "youtube",
        role: "cinematographer",
      },
      {
        title: "Joe Usher – can i?",
        slug: "joe-usher-can-i",
        href: "https://vimeo.com/824703968?fl=pl&fe=ti",
        embed: "vimeo",
        role: "cinematographer",
      },
      {
        title: "Joe Usher – you",
        slug: "joe-usher-you",
        href: "https://vimeo.com/762010268?fl=pl&fe=ti",
        embed: "vimeo",
        role: "cinematographer",
      },
      {
        title: "Girl Scout – Bruises (Unreleased)",
        slug: "girl-scout-bruises-unreleased",
        href: "https://vimeo.com/842472269/2fd090b0b6?fl=pl&fe=vl&turnstile=0.-iJQz8gNk2gs0zJanenuudbgV4uM6wRcsnJyp0F_Uf8vENTlFBa3wUusjJcsNMkwr-xhEoowJhdSLQ_WWR_AXZ9sfJIkJFm03hI9l0IC68rgGA3QQ2gAGXZpitZGpeqKS34VwbkN2WQfUQ1IEvEoWCp-oUFb1CE2yWDtHezh2dlCZ-3Y2afisSEN6eenHO4ocJUJgOANQETLG-orMizCSc4bN3jMRST3ScwibGr3eCikRUpLEiBfW7hiBbFEVvggn2pe03-FqzEUht0yCrehEiCJhcXMQavWg_0GpUHzA6O74lRYNOkAqGesAldM7E9HV-kqK7Lr175Pq_obJsq1Uurre2WXNTWcHW2ToiiDNx6HSXliQad9iKx1QxpTQcP47TDCDm_-KfNV_tmzzbL8jimlGepOzLfo4bfeAe-3eheU_6wm4JVqlmVqPa8K1GwcrAuise97xL6dqcJShs5K8defpjxLqD0MtafP5oZ88H0GFdxwK4VD_1kP6EpDkkLqMx1D7YgnTKgBFMI4M_bUc-5f_CWl24jIgco2xI7SYRhxah6uovze0TvEp1RvSevqkMeRQ_zpr5fVLJJCAHDl4OtvGAWS3f8-idb3Biv0B-WP3ht-bnFvT9Z0jSIW06qMWpLHw_h05hHD3m7Mjwb36wVDY1cdUgUnL7akaAi58iegoAn-i4Bl_bI0a4HdvyedYunHuGQfJ9IDgvjVXN-n4riiCWe0gINnvhWvjRvFQgUiW_vPzWgrO9IwUszyXeraLut3VGmLsdx4GlwaAMCsyiLbgm9ZmPZH1JZAB2SxyoQxDGrjGOrbAu-Pen3nQe8yy2DE6UMwbrIxfXbe35a3PO64WGKw8Rr-yiLvk9rF5Mi_fNpSQKsXW161TAWTtmVD1EnKxWGE1qn6pwiqM-Y0Dwk_qSFcR7GVKlueqYPTj6I9M_oqtzrzyntdY8MGJpb6.deB-a9RmCyzyJthTjoYqZg.614ab6822ae726238779a1cb40e37ef1c8f6c764161e4734e5832cd7cc6cc03d",
        embed: "vimeo",
        role: "cinematographer",
      },
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    projects: [
      { title: "Microsoft Copilot (coming soon)", slug: "microsoft-copilot-coming-soon" },
      { title: "Anya Hindmarch", slug: "anya-hindmarch" },
      { title: "BeBody", slug: "bebody" },
    ],
  },
];

export const sectionOrder = featuredSections.map((section) => section.id);

export const sectionMap = featuredSections.reduce<Record<SectionId, SectionConfig>>(
  (acc, section) => {
    acc[section.id] = section;
    return acc;
  },
  {} as Record<SectionId, SectionConfig>,
);

export type FeaturedProjectWithSection = FeaturedProject & { section: SectionId };

const allProjects = featuredSections.flatMap((section) =>
  section.projects.map<FeaturedProjectWithSection>((project) => ({
    ...project,
    section: section.id,
  })),
);

export const projectMapByTitle = allProjects.reduce<Record<string, FeaturedProjectWithSection>>(
  (acc, project) => {
    acc[project.title] = project;
    return acc;
  },
  {},
);

export const projectMapBySlug = allProjects.reduce<Record<string, FeaturedProjectWithSection>>(
  (acc, project) => {
    acc[project.slug] = project;
    return acc;
  },
  {},
);

