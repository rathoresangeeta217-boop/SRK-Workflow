const sharp = require('sharp');
sharp('public/srk-logo.png')
  .resize(64, 64)
  .png()
  .toFile('public/favicon.png')
  .then(info => { console.log('Favicon generated:', info); })
  .catch(err => { console.error('Error:', err); });
