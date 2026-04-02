const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const baseDir = path.join(__dirname, 'platforms');

if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

data.forEach(p => {
    const dir = path.join(baseDir, p.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    
    const html = `<html><body style="background:#000;color:#fff;padding:50px;"><h1>${p.name}</h1><p>${p.category} Alternative</p><a href="../../index.html" style="color:blue;">Back</a></body></html>`;
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    console.log(`✅ Created: ${p.id}`);
});
