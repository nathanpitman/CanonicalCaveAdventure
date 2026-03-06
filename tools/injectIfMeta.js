const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const rootIfiction = path.join(__dirname, '..', 'ifiction.xml');
const distIfiction = path.join(distDir, 'ifiction.xml');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found. Run expo export first.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

const ifid = fs.readFileSync(path.join(__dirname, '..', 'ifid.txt'), 'utf-8').trim();

const ifMetaTags = `
    <meta name="ifid" content="${ifid}">
    <meta name="generator" content="Canonical Cave Adventure">`;

if (html.includes('name="ifid"')) {
  console.log('IF meta tags already present, skipping injection.');
} else {
  html = html.replace('</head>', ifMetaTags + '\n  </head>');
  fs.writeFileSync(indexPath, html, 'utf-8');

  const notFoundPath = path.join(distDir, '404.html');
  if (fs.existsSync(notFoundPath)) {
    let notFoundHtml = fs.readFileSync(notFoundPath, 'utf-8');
    if (!notFoundHtml.includes('name="ifid"')) {
      notFoundHtml = notFoundHtml.replace('</head>', ifMetaTags + '\n  </head>');
      fs.writeFileSync(notFoundPath, notFoundHtml, 'utf-8');
    }
  }

  console.log('Injected IF meta tags into dist/index.html');
}

if (fs.existsSync(rootIfiction)) {
  fs.copyFileSync(rootIfiction, distIfiction);
  console.log('Copied ifiction.xml to dist/');
} else {
  console.warn('ifiction.xml not found in project root, skipping copy.');
}
