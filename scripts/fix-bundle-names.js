#!/usr/bin/env node

/**
 * GenStock Video Bundle Name Standardization Script
 * Fixes inconsistent product bundle naming for better customer clarity
 */

const fs = require('fs');
const path = require('path');

// Standardized bundle name mapping
const BUNDLE_STANDARDS = {
  // Resolution patterns to standardize
  '1920×1080': 'HD 1080p',
  '1920 × 1080': 'HD 1080p', 
  '3840×2160': '4K Ultra HD',
  '3840 x 2160': '4K Ultra HD',
  '1280×720': 'HD 720p',
  '2560 × 1440': '2K Quad HD',
  '1760 × 1152': 'HD+ 1760p',
  '3456 × 2368': '4K+ Ultra',
  '1080 × 1920': 'Vertical HD',
  
  // Bundle type patterns
  'Video Bundle (1080P + 4K)': 'HD + 4K Bundle',
  'Video Bundle (720P + 2K)': 'HD + 2K Bundle', 
  'Video Bundles (1080P, HD + 4K)': 'Complete HD + 4K Bundle',
  'Video Bundles (1080P + 4K)': 'HD + 4K Bundle',
  'Office Interior': 'Professional Video Bundle',
  
  // Format standards
  'MP4': 'MP4 Video',
  'mp4': 'MP4 Video'
};

function standardizeBundleName(originalName) {
  if (!originalName) return 'HD Video Bundle';
  
  let standardized = originalName;
  
  // Apply resolution standardization
  Object.keys(BUNDLE_STANDARDS).forEach(pattern => {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    standardized = standardized.replace(regex, BUNDLE_STANDARDS[pattern]);
  });
  
  // Clean up common issues
  standardized = standardized
    .replace(/\s+/g, ' ') // Multiple spaces
    .replace(/\s*\+\s*/g, ' + ') // Plus sign spacing
    .replace(/\s*\|\s*/g, ' | ') // Pipe spacing
    .replace(/\(\s+/g, '(') // Space after opening parenthesis
    .replace(/\s+\)/g, ')') // Space before closing parenthesis
    .trim();
  
  return standardized;
}

function generateRecommendations() {
  const csvPath = path.join(__dirname, '../../products/products_export.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Products CSV not found at:', csvPath);
    return;
  }
  
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  // Find relevant columns
  const titleIndex = headers.indexOf('Title');
  const subtitleIndex = headers.findIndex(h => h.includes('subtitle'));
  const resolutionIndex = headers.findIndex(h => h.includes('video_resolutions'));
  const bundleNameIndex = headers.findIndex(h => h.includes('subtitle') || h.includes('bundle'));
  
  console.log('🎯 GenStock Video Bundle Standardization Report\n');
  console.log('=' .repeat(60));
  
  const issues = [];
  const recommendations = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const columns = line.split(',');
    const title = columns[titleIndex]?.replace(/"/g, '') || '';
    const subtitle = columns[subtitleIndex]?.replace(/"/g, '') || '';
    const resolution = columns[resolutionIndex]?.replace(/"/g, '') || '';
    
    if (title) {
      // Detect issues
      const hasInconsistentNaming = subtitle && (
        subtitle.includes('Video Bundle') && subtitle.includes('Video Bundles') ||
        subtitle.includes('(') && !subtitle.includes(')') ||
        subtitle.includes('×') && subtitle.includes(' x ') ||
        subtitle.includes('1080P') && subtitle.includes('1080p')
      );
      
      if (hasInconsistentNaming || !subtitle) {
        issues.push({
          title,
          current: subtitle || 'MISSING',
          resolution
        });
        
        // Generate recommendation
        const recommended = standardizeBundleName(subtitle || resolution || 'HD Video Bundle');
        recommendations.push({
          title,
          current: subtitle || 'MISSING', 
          recommended
        });
      }
    }
  }
  
  // Report findings
  console.log(`📊 Analysis Results:`);
  console.log(`   • Total products: ${lines.length - 1}`);
  console.log(`   • Products with naming issues: ${issues.length}`);
  console.log(`   • Consistency improvement needed: ${Math.round((issues.length / (lines.length - 1)) * 100)}%\n`);
  
  if (issues.length > 0) {
    console.log('🔧 Issues Found:');
    issues.slice(0, 10).forEach((issue, index) => {
      console.log(`   ${index + 1}. "${issue.title}"`);
      console.log(`      Current: "${issue.current}"`);
      console.log(`      Resolution: "${issue.resolution}"`);
      console.log('');
    });
    
    if (issues.length > 10) {
      console.log(`   ... and ${issues.length - 10} more issues\n`);
    }
    
    console.log('✅ Recommended Fixes:');
    recommendations.slice(0, 10).forEach((rec, index) => {
      console.log(`   ${index + 1}. "${rec.title}"`);
      console.log(`      From: "${rec.current}"`);
      console.log(`      To:   "${rec.recommended}"`);
      console.log('');
    });
    
    // Generate fix script
    const fixScript = generateFixScript(recommendations);
    const fixScriptPath = path.join(__dirname, '../scripts/apply-bundle-fixes.liquid');
    fs.writeFileSync(fixScriptPath, fixScript);
    
    console.log(`💾 Generated fix script: ${fixScriptPath}`);
    console.log('\n🚀 Next Steps:');
    console.log('   1. Review the recommended changes above');
    console.log('   2. Update product metafields in Shopify admin');
    console.log('   3. Test on a few products first');
    console.log('   4. Apply to all products once confirmed');
    console.log('\n⚡ Expected Impact:');
    console.log('   • Clearer product descriptions');
    console.log('   • Better customer understanding');
    console.log('   • Improved conversion rates');
    console.log('   • Professional store appearance');
  } else {
    console.log('✅ All bundle names are already consistent!');
  }
}

function generateFixScript(recommendations) {
  return `{%- comment -%}
GenStock Video Bundle Name Fix Script
Apply these standardized names to product metafields
{%- endcomment -%}

<script>
// Recommended bundle name updates for GenStock Video products
const bundleNameFixes = [
${recommendations.map(rec => `  {
    title: "${rec.title}",
    newSubtitle: "${rec.recommended}"
  }`).join(',\n')}
];

console.log('GenStock Bundle Name Fixes Ready:', bundleNameFixes.length);
</script>

{%- comment -%}
Manual update instructions:
1. Go to Shopify Admin > Products
2. For each product listed above:
   - Edit the product
   - Update the "Product subtitle" metafield 
   - Save the changes
3. Test the updated display on your store

Bulk update option:
Use Shopify's bulk editor or API to apply these changes faster
{%- endcomment -%}`;
}

// Run the analysis
if (require.main === module) {
  generateRecommendations();
}

module.exports = { standardizeBundleName, generateRecommendations }; 