const xlsx = require('xlsx');
const path = require('path');
const wb = xlsx.readFile(path.resolve(process.cwd(),'event.xlsx'));
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws, {defval: null});
console.log('columns:', Object.keys(data[0] || {}));
console.log('first row:', data[0]);
console.log('total rows:', data.length);
console.log('kota_id values unique:', [...new Set(data.map(r => r.kota_id))].slice(0,20));
