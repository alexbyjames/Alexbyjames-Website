# Placeholder Images Note

The site requires actual image files to work properly. The placeholder files in `/public/thumbs/` are currently empty.

## Quick Setup

To get the site running immediately, you can:

1. **Use placeholder images from a service:**
   ```bash
   cd public/thumbs
   curl "https://via.placeholder.com/800x800/1a1a1a/ffffff?text=Placeholder" -o market-day.jpg
   # Repeat for all 12 image files
   ```

2. **Or use any 800x800px images** - Just rename them to match the filenames in `/lib/projects.ts`

3. **For the hero video**, place a small MP4 file at `/public/video/hero.mp4`

## Required Image Files

- market-day.jpg
- urban-pulse.jpg
- coastal-drift.jpg
- night-shift.jpg
- echoes.jpg
- midnight-run.jpg
- desert-storm.jpg
- city-lights.jpg
- minimalist-watch.jpg
- luxury-perfume.jpg
- artisan-coffee.jpg
- tech-innovation.jpg

All images should be:
- Square aspect ratio (1:1)
- Minimum 800x800px
- JPG or PNG format
- Optimized for web

