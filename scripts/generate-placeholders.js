const fs = require('fs');
const path = require('path');

// Create a simple SVG placeholder generator
function createPlaceholderSVG(name, width = 800, height = 800) {
  const colors = [
    '#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a',
    '#5a5a5a', '#6a6a6a', '#7a7a7a', '#8a8a8a'
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${name}</text>
</svg>`;
}

// Projects from the data
const projects = [
  { name: 'market-day', image: 'market-day.jpg' },
  { name: 'urban-pulse', image: 'urban-pulse.jpg' },
  { name: 'coastal-drift', image: 'coastal-drift.jpg' },
  { name: 'night-shift', image: 'night-shift.jpg' },
  { name: 'echoes', image: 'echoes.jpg' },
  { name: 'midnight-run', image: 'midnight-run.jpg' },
  { name: 'desert-storm', image: 'desert-storm.jpg' },
  { name: 'city-lights', image: 'city-lights.jpg' },
  { name: 'minimalist-watch', image: 'minimalist-watch.jpg' },
  { name: 'luxury-perfume', image: 'luxury-perfume.jpg' },
  { name: 'artisan-coffee', image: 'artisan-coffee.jpg' },
  { name: 'tech-innovation', image: 'tech-innovation.jpg' },
];

const thumbsDir = path.join(__dirname, '../public/thumbs');
if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

// Generate SVG placeholders
projects.forEach(({ name, image }) => {
  const svgPath = path.join(thumbsDir, image.replace('.jpg', '.svg'));
  fs.writeFileSync(svgPath, createPlaceholderSVG(name));
  console.log(`Created placeholder: ${svgPath}`);
});

console.log('\nPlaceholder images created!');
console.log('Note: Replace these SVG files with actual JPG/PNG images.');

