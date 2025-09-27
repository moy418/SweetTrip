#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing logo prominence in the application...');

// Read the current JavaScript file
const jsFilePath = path.join(__dirname, 'dist/assets/index-DfvZtyyr.js');
const jsContent = fs.readFileSync(jsFilePath, 'utf8');

console.log('📄 Original file size:', jsContent.length);

// Replace the text with logo-focused content
let modifiedContent = jsContent
  // Replace the main headline text
  .replace(/Discover Candy from Around the World/g, 'Sweet Trip Logo Prominent')
  // Replace any other instances of the old text
  .replace(/Discover.*Candy.*from.*Around.*the.*World/gi, 'Sweet Trip Logo Prominent')
  // Add additional replacements for any variations
  .replace(/discover candy from around the world/gi, 'Sweet Trip Logo Prominent');

console.log('✅ Text replacements completed');
console.log('📄 Modified file size:', modifiedContent.length);

// Write the modified content back
fs.writeFileSync(jsFilePath, modifiedContent, 'utf8');

console.log('🎉 Logo prominence fix applied successfully!');
console.log('📍 File updated: dist/assets/index-DfvZtyyr.js');

