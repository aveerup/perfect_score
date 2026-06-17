const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(app)/typing/page.tsx',
  'src/app/(app)/mock/page.tsx',
  'src/app/(app)/profile/page.tsx',
  'src/app/(app)/dashboard/page.tsx',
  'src/app/(app)/vocab/page.tsx',
  'src/app/page.tsx',
  'src/app/login/page.tsx',
  'src/app/(app)/layout.tsx'
];

files.forEach(file => {
  const fullPath = path.resolve('e:/perfect score prototype/perfect-score', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Use Teal for specific accents
    content = content.replace(/primary/g, 'accent');
    // But keep some primary as black for buttons
    content = content.replace(/bg-accent/g, 'bg-primary'); 
    content = content.replace(/selection:bg-accent/g, 'selection:bg-teal-600');
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});
