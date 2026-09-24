const fs = require('fs');
const path = require('path');

const colorMap = {
  '#FFF8E7': 'sacredCream',
  '#E85D04': 'saffron',
  '#F48C06': 'templeOrange',
  '#C89B3C': 'antiqueGold',
  '#6B4226': 'earthBrown',
  '#F9C74F': 'marigold',
  '#F4D35E': 'turmeric',
  '#588157': 'tulsi',
  '#386641': 'sacredGreen',
  '#6A994E': 'leaf',
  '#B23A48': 'kumkum',
  '#C73E1D': 'vermilion',
  '#8F1D14': 'deepRed',
  '#6D214F': 'plum',
  '#7B2CBF': 'purple',
  '#168AAD': 'peacock',
  '#2A9D8F': 'templeTeal',
  '#155D6B': 'deepPeacock',
  '#A67C52': 'sandalwood',
  '#292524': 'charcoal'
};

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Replace bg-[#HEX], text-[#HEX], border-[#HEX] etc with their semantic names
      // Need to handle opacity like bg-[#HEX]/40 -> bg-semantic/40
      
      const regex = /(bg|text|border|ring|shadow|fill|stroke|from|via|to|placeholder)-\[#([A-Fa-f0-9]{6})\](\/[0-9]+)?/g;
      
      content = content.replace(regex, (match, prefix, hex, opacity) => {
        const hexKey = '#' + hex.toUpperCase();
        if (colorMap[hexKey]) {
          return prefix + '-' + colorMap[hexKey] + (opacity || '');
        }
        return match; // If not found in map, leave as is
      });

      // Also replace raw hex in classNames or style tags if they exist.
      // But above regex catches most Tailwind classes. Let's do a simple regex for other occurrences
      // wait, the above regex captures the most important tailwind classes.
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./components');
