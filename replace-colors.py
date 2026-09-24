import os
import re

colorMap = {
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
}

def process(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original = content
                    for hex_code, name in colorMap.items():
                        # Replace exact hex within bracket notation
                        # e.g., bg-[#FFF8E7] -> bg-sacredCream
                        # Wait, what if it's lowercase? Let's use case-insensitive replace.
                        pattern = re.compile(r'\[(?i)' + hex_code + r'\]')
                        content = pattern.sub(name, content)
                        
                    if content != original:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated {path}")
                except Exception as e:
                    print(f"Error processing {path}: {e}")

process('app')
process('components')
