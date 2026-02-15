const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found. Run expo export first.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

const basePath = '/CanonicalCaveAdventure';

const metaTags = `
    <link rel="manifest" href="${basePath}/manifest.json">
    <link rel="apple-touch-icon" sizes="180x180" href="${basePath}/apple-touch-icon.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Canonical">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#0A0A0A">
    <meta name="application-name" content="Canonical">
    <meta name="mobile-web-app-capable" content="yes">`;

if (html.includes('apple-mobile-web-app-capable')) {
  console.log('PWA meta tags already present, skipping.');
  process.exit(0);
}

html = html.replace('</head>', metaTags + '\n  </head>');

fs.writeFileSync(indexPath, html, 'utf-8');

const notFoundPath = path.join(distDir, '404.html');
if (fs.existsSync(notFoundPath)) {
  fs.writeFileSync(notFoundPath, html, 'utf-8');
  console.log('Updated 404.html with PWA meta tags.');
}

console.log('Injected PWA meta tags into dist/index.html');
