const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('inventory_data_clean.json', 'utf8'));

const nameVariations = {};
const colorVariations = {};
const exactDuplicates = {};

rawData.forEach(item => {
  const normName = (item.name || '').trim().toLowerCase();
  const normColor = (item.color || '').trim().toLowerCase();
  
  // Track name variations
  if (!nameVariations[normName]) nameVariations[normName] = new Set();
  nameVariations[normName].add((item.name || '').trim());
  
  // Track color variations
  if (!colorVariations[normColor]) colorVariations[normColor] = new Set();
  colorVariations[normColor].add((item.color || '').trim());

  // Check exact duplicates (Name + Model + Color + Location)
  const key = `${normName}|${(item.model||'').toLowerCase()}|${normColor}|${item.location}`;
  if (!exactDuplicates[key]) exactDuplicates[key] = [];
  exactDuplicates[key].push(item);
});

console.log("=== NAME VARIATIONS (Case & Spelling) ===");
for (const [norm, set] of Object.entries(nameVariations)) {
  if (set.size > 1) {
    console.log(`- ${norm}:`, Array.from(set).join(', '));
  }
}
// Also find similar names (e.g. econo vs economy vs econo casket)
const allNormNames = Object.keys(nameVariations).sort();
console.log("\n=== SIMILAR NAMES ===");
const groups = {
  econo: allNormNames.filter(n => n.includes('econo')),
  pongee: allNormNames.filter(n => n.includes('pongee')),
  flat_lid: allNormNames.filter(n => n.includes('flat lid')),
  four_tier: allNormNames.filter(n => n.includes('4 tier') || n.includes('four tier')),
  four_feet: allNormNames.filter(n => n.includes('4 feet')),
};
console.log(groups);

console.log("\n=== COLOR VARIATIONS ===");
for (const [norm, set] of Object.entries(colorVariations)) {
  if (set.size > 1) {
    console.log(`- ${norm}:`, Array.from(set).join(', '));
  }
}

console.log("\n=== EXACT DUPLICATES (Same Branch, Name, Model, Color) ===");
for (const [key, items] of Object.entries(exactDuplicates)) {
  if (items.length > 1) {
    console.log(`Match Key: ${key}`);
    items.forEach(i => console.log(`  ID: ${i.id} | Name: ${i.name} | Color: ${i.color} | Stock: ${i.stock_quantity} | Reserved: ${i.reserved_quantity} | Location: ${i.location}`));
  }
}
