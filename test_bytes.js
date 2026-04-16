const fs = require('fs');
const out = JSON.parse(fs.readFileSync('output.json', 'utf8'));
const cases = JSON.parse(fs.readFileSync('cases_out.json', 'utf8'));

console.log("ID 110 name bytes:", Buffer.from(out.find(i => i.id === 110).name).toJSON().data);
console.log("ID 262 name bytes:", Buffer.from(out.find(i => i.id === 262).name).toJSON().data);
console.log("Case 090 casket_type bytes:", Buffer.from(cases.find(c => c.case_number === 'THS-2026-090').casket_type).toJSON().data);
