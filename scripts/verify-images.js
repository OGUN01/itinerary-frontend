const fs = require('fs');
const path = require('path');

const images = [
  'adventure-1.jpg',
  'adventure-2.jpg',
  'adventure-3.jpg',
  'adventure-4.jpg',
  'adventure-5.jpg',
  'adventure-6.jpg',
  'adventure-7.jpg',
  'adventure-8.jpg'
];

const verifyImages = () => {
  const publicDir = path.join(__dirname, '../public');
  const heroDir = path.join(publicDir, 'images/hero');

  // Check if directories exist
  if (!fs.existsSync(publicDir)) {
    console.error('Error: public directory does not exist');
    return false;
  }

  if (!fs.existsSync(heroDir)) {
    console.error('Error: hero images directory does not exist');
    return false;
  }

  // Verify each image
  let allImagesExist = true;
  images.forEach(imageName => {
    const imagePath = path.join(heroDir, imageName);
    if (!fs.existsSync(imagePath)) {
      console.error(`Error: Image ${imageName} does not exist at ${imagePath}`);
      allImagesExist = false;
    } else {
      const stats = fs.statSync(imagePath);
      console.log(`✓ ${imageName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  });

  return allImagesExist;
};

const result = verifyImages();
console.log('\nVerification ' + (result ? 'successful! ✨' : 'failed! ❌')); 