const fs = require('fs');
try {
  const json = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  console.log('manifest.json is valid JSON');
  console.log('name:', json.name);
} catch (e) {
  console.error('manifest.json parse error:', e.message);
  process.exit(1);
}
