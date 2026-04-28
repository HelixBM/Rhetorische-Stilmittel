const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) fs.writeFileSync('styles.css', styleMatch[1].trim() + '\n');

const scriptMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  let scriptContent = scriptMatch[1];
  const dataRegex = /const STILMITTEL = \[[\s\S]*?];\r?\n?/;
  const dataMatch = scriptContent.match(dataRegex);

  if (dataMatch) {
    const dataContent = dataMatch[0].trim();
    fs.writeFileSync('data.js', dataContent + '\n');
    const appContent = scriptContent.replace(dataRegex, '').trim();
    fs.writeFileSync('app.js', appContent + '\n');
  }
}

const newHtml = html
  .replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="styles.css" />')
  .replace(/<script type="text\/babel">[\s\S]*?<\/script>/, '<script src="data.js"></script>\n<script type="text/babel" src="app.js"></script>');

fs.writeFileSync('index.html', newHtml);
