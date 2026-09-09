export interface AnyaVideo {
  id: string;
  src: string;
  poster: string;
  title: string;
  /** ISO date used for newest-first sort. From YYYYMMDD filename prefix, or file date if none. */
  sortDate: string;
}

/**
 * Newest first.
 * Dated files use the YYYYMMDD prefix in the filename.
 * Undated files (AnyaBrands / Desert) use the original file dates (2026-01-07 / 2026-01-08).
 * Same-day order uses original file modification time, then filename.
 */
export const anyaHindmarchVideos: AnyaVideo[] = [
  {
    id: "20260817-snoopy-countdown",
    src: "/anyahindmarch/web/20260817SnoopyCountdown_9x16.mp4",
    poster: "/anyahindmarch/web/20260817SnoopyCountdown_9x16.jpg",
    title: "Snoopy Countdown",
    sortDate: "2026-08-17",
  },
  {
    id: "20260817-snoopy-mortimer",
    src: "/anyahindmarch/web/20260817SnoopyMortimer_9x16.mp4",
    poster: "/anyahindmarch/web/20260817SnoopyMortimer_9x16.jpg",
    title: "Snoopy Mortimer",
    sortDate: "2026-08-17",
  },
  {
    id: "20260714-pink-plastic-bag",
    src: "/anyahindmarch/web/20260714_PinkPlasticBagVO_9x16.mp4",
    poster: "/anyahindmarch/web/20260714_PinkPlasticBagVO_9x16.jpg",
    title: "Pink Plastic Bag",
    sortDate: "2026-07-14",
  },
  {
    id: "20260714-raffia",
    src: "/anyahindmarch/web/20260714_RaffiaVO_9x16.mp4",
    poster: "/anyahindmarch/web/20260714_RaffiaVO_9x16.jpg",
    title: "Raffia",
    sortDate: "2026-07-14",
  },
  {
    id: "20260714-travel-tote",
    src: "/anyahindmarch/web/20260714_TravelToteVO_9x16.mp4",
    poster: "/anyahindmarch/web/20260714_TravelToteVO_9x16.jpg",
    title: "Travel Tote",
    sortDate: "2026-07-14",
  },
  {
    id: "20260708-yellow-neeson",
    src: "/anyahindmarch/web/20260708_YellowNeeson9x16.mp4",
    poster: "/anyahindmarch/web/20260708_YellowNeeson9x16.jpg",
    title: "Yellow Neeson",
    sortDate: "2026-07-08",
  },
  {
    id: "20260702-travel-store",
    src: "/anyahindmarch/web/20260702_TravelStoreEdit_SoundEfx.mp4",
    poster: "/anyahindmarch/web/20260702_TravelStoreEdit_SoundEfx.jpg",
    title: "Travel Store",
    sortDate: "2026-07-02",
  },
  {
    id: "20260520-neeson-vo",
    src: "/anyahindmarch/web/20260520_NeesonVO_9x16.mp4",
    poster: "/anyahindmarch/web/20260520_NeesonVO_9x16.jpg",
    title: "Neeson VO",
    sortDate: "2026-05-20",
  },
  {
    id: "20260409-pink-edit-2",
    src: "/anyahindmarch/web/20260409_Pink_Edit2_9x16_Logo.mp4",
    poster: "/anyahindmarch/web/20260409_Pink_Edit2_9x16_Logo.jpg",
    title: "Pink Edit 2",
    sortDate: "2026-04-09",
  },
  {
    id: "20260409-pink-edit-1",
    src: "/anyahindmarch/web/20260409_Pink_Edit1_9x16_Logo.mp4",
    poster: "/anyahindmarch/web/20260409_Pink_Edit1_9x16_Logo.jpg",
    title: "Pink Edit 1",
    sortDate: "2026-04-09",
  },
  {
    id: "20260409-butter-edit-1",
    src: "/anyahindmarch/web/20260409_Butter_Edit1_9x16_Logo.mp4",
    poster: "/anyahindmarch/web/20260409_Butter_Edit1_9x16_Logo.jpg",
    title: "Butter Edit 1",
    sortDate: "2026-04-09",
  },
  {
    id: "bridal-proposal",
    src: "/anyahindmarch/web/Bridal_Proposal_9x16.mp4",
    poster: "/anyahindmarch/web/Bridal_Proposal_9x16.jpg",
    title: "Bridal Proposal",
    sortDate: "2026-03-31",
  },
  {
    id: "bridal-after-party",
    src: "/anyahindmarch/web/Bridal_AfterParty_9x16.mp4",
    poster: "/anyahindmarch/web/Bridal_AfterParty_9x16.jpg",
    title: "Bridal After Party",
    sortDate: "2026-03-31",
  },
  {
    id: "bridal-party",
    src: "/anyahindmarch/web/Bridal_Party_9x16.mp4",
    poster: "/anyahindmarch/web/Bridal_Party_9x16.jpg",
    title: "Bridal Party",
    sortDate: "2026-03-31",
  },
  {
    id: "anyabrands-sweet-n-low-3",
    src: "/anyahindmarch/web/AnyaBrands_SweetnLow3_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/AnyaBrands_SweetnLow3_9x16_NoLogo.jpg",
    title: "Sweet'N Low 3",
    sortDate: "2026-01-08",
  },
  {
    id: "desert-edit-1",
    src: "/anyahindmarch/web/Desert_Edit1_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/Desert_Edit1_9x16_NoLogo.jpg",
    title: "Desert Edit 1",
    sortDate: "2026-01-08",
  },
  {
    id: "anyabrands-filippo-berio-1",
    src: "/anyahindmarch/web/AnyaBrands_FilippoBerio1_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/AnyaBrands_FilippoBerio1_9x16_NoLogo.jpg",
    title: "Filippo Berio 1",
    sortDate: "2026-01-07",
  },
  {
    id: "anyabrands-filippo-berio-2",
    src: "/anyahindmarch/web/AnyaBrands_FilippoBerio2_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/AnyaBrands_FilippoBerio2_9x16_NoLogo.jpg",
    title: "Filippo Berio 2",
    sortDate: "2026-01-07",
  },
  {
    id: "anyabrands-milky-1",
    src: "/anyahindmarch/web/AnyaBrands_Milky1_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/AnyaBrands_Milky1_9x16_NoLogo.jpg",
    title: "Milky 1",
    sortDate: "2026-01-07",
  },
  {
    id: "anyabrands-milky-2",
    src: "/anyahindmarch/web/AnyaBrands_Milky2_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/AnyaBrands_Milky2_9x16_NoLogo.jpg",
    title: "Milky 2",
    sortDate: "2026-01-07",
  },
  {
    id: "desert-edit-2",
    src: "/anyahindmarch/web/Desert_Edit2_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/Desert_Edit2_9x16_NoLogo.jpg",
    title: "Desert Edit 2",
    sortDate: "2026-01-07",
  },
  {
    id: "desert-edit-3",
    src: "/anyahindmarch/web/Desert_Edit3_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/Desert_Edit3_9x16_NoLogo.jpg",
    title: "Desert Edit 3",
    sortDate: "2026-01-07",
  },
  {
    id: "desert-edit-4",
    src: "/anyahindmarch/web/Desert_Edit4_9x16_NoLogo.mp4",
    poster: "/anyahindmarch/web/Desert_Edit4_9x16_NoLogo.jpg",
    title: "Desert Edit 4",
    sortDate: "2026-01-07",
  },
  {
    id: "boots",
    src: "/anyahindmarch/web/Boots_9x16.mp4",
    poster: "/anyahindmarch/web/Boots_9x16.jpg",
    title: "Boots",
    sortDate: "2025-12-18",
  },
];

/** Optional unused Instagram references from the earlier embed version. Not shown in the UI. */
export const anyaHindmarchInstagramReferences = [
  "https://www.instagram.com/reel/DcTnEW2DAPJ/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DcRK8H6AjCj/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DbqaXMJjxM1/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DblU-FqjaKA/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/Da-BzjogAmc/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DaS-W3AAt9j/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
];
