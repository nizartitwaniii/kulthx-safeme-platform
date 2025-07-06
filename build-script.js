const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

try {
  // Run vite build
  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  
  // Check if dist/public exists
  const distPath = path.join(__dirname, 'dist', 'public');
  if (fs.existsSync(distPath)) {
    console.log('✅ Build output found at:', distPath);
    
    // List files in dist/public
    const files = fs.readdirSync(distPath);
    console.log('📁 Files:', files);
  } else {
    console.log('❌ Build output not found');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}