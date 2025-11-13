# My Website

## Development

```bash
npm run dev
```

## Video Optimisation

Large background clips can dominate the initial load. Before adding new footage, compress and export poster frames:

```bash
# Create an H.265 version (adjust bitrate as needed)
ffmpeg -i input.mov -c:v libx265 -crf 22 -tag:v hvc1 -c:a aac output-h265.mp4

# Extract a still poster frame
ffmpeg -i output-h265.mp4 -ss 00:00:01 -vframes 1 public/video/posters/example.jpg
```

Reference the compressed asset in `components/VideoBackground.tsx` and set the `poster` attribute for faster first paint on slow connections.
