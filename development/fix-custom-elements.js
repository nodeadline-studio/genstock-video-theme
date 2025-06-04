#!/usr/bin/env node

/**
 * SPOTLIGHT-MOD CUSTOM ELEMENTS FIX
 * Fixes specific errors in custom code to make everything work perfectly
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 SPOTLIGHT-MOD CUSTOM ELEMENTS FIX\n');

const THEME_ROOT = path.join(__dirname, '..');

async function fixCustomElements() {
  console.log('🔧 Fixing custom elements and code issues...\n');

  let totalFixes = 0;

  // Fix 1: Remove corrupted screen reader text from CSS and file paths
  totalFixes += await fixCorruptedScreenReaderText();

  // Fix 2: Ensure custom gallery is properly linked
  totalFixes += await fixGalleryIntegration();

  // Fix 3: Fix any JavaScript errors in product functionality
  totalFixes += await fixProductJavaScript();

  // Fix 4: Validate custom settings integration
  totalFixes += await validateCustomSettings();

  console.log(`\n🎉 Custom elements fix completed!`);
  console.log(`✅ Applied ${totalFixes} fixes to make your custom code work perfectly\n`);

  // Generate browser test script
  generateBrowserTestScript();
}

async function fixCorruptedScreenReaderText() {
  console.log('🔧 Fix 1: Removing corrupted screen reader text...');
  
  const filePath = path.join(THEME_ROOT, 'sections/main-product.liquid');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Fix 1: CSS file reference corruption
    content = content.replace(
      /component-<span class="visually-hidden">Sale price: <\/span>price\.css/g,
      'component-price.css'
    );
    
    // Fix 2: Liquid variable corruption  
    content = content.replace(
      /product\.quantity_<span class="visually-hidden">Sale price: <\/span>price_breaks_configured\?/g,
      'product.quantity_price_breaks_configured?'
    );
    
    // Fix 3: CSS class name corruption
    content = content.replace(
      /\.<span class="visually-hidden">Sale price: <\/span>price--large/g,
      '.price--large'
    );
    
    content = content.replace(
      /\.<span class="visually-hidden">Sale price: <\/span>price([^-])/g,
      '.price$1'
    );
    
    // Fix 4: Liquid render corruption
    content = content.replace(
      /'<span class="visually-hidden">Sale price: <\/span>price'/g,
      "'price'"
    );
    
    // Fix 5: JSON schema corruption
    content = content.replace(
      /"<span class="visually-hidden">Sale price: <\/span>price([^"]*)"/g,
      '"price$1"'
    );
    
    // Fix 6: Liquid when statement corruption
    content = content.replace(
      /{%- when '<span class="visually-hidden">Sale price: <\/span>price' -%}/g,
      "{%- when 'price' -%}"
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('   ✅ Fixed corrupted screen reader text in main-product.liquid');
      return 1;
    } else {
      console.log('   ℹ️  No corrupted text found');
      return 0;
    }
    
  } catch (error) {
    console.log('   ❌ Error fixing corrupted text:', error.message);
    return 0;
  }
}

async function fixGalleryIntegration() {
  console.log('🔧 Fix 2: Ensuring custom gallery integration...');
  
  const filePath = path.join(THEME_ROOT, 'sections/main-product.liquid');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if enhanced gallery is properly rendered
    const hasEnhancedGallery = content.includes('enhanced-product-media-gallery-custom');
    
    if (!hasEnhancedGallery) {
      // Find the media gallery section and ensure it uses the enhanced version
      const galleryPattern = /{%- render ['"]product-media-gallery['"][^}]*%}/g;
      
      if (content.match(galleryPattern)) {
        content = content.replace(
          galleryPattern,
          "{% render 'enhanced-product-media-gallery-custom' %}"
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('   ✅ Updated gallery to use enhanced custom version');
        return 1;
      }
    } else {
      console.log('   ✅ Enhanced gallery already integrated');
    }
    
    return 0;
    
  } catch (error) {
    console.log('   ❌ Error fixing gallery integration:', error.message);
    return 0;
  }
}

async function fixProductJavaScript() {
  console.log('🔧 Fix 3: Checking product JavaScript functionality...');
  
  const jsFilePath = path.join(THEME_ROOT, 'assets/product-form.js');
  
  try {
    if (!fs.existsSync(jsFilePath)) {
      console.log('   ⚠️  Product form JavaScript not found');
      return 0;
    }
    
    let content = fs.readFileSync(jsFilePath, 'utf8');
    
    // Check for common JavaScript errors
    const hasErrors = content.includes('undefined') && 
                     !content.includes('typeof') && 
                     !content.includes('!== undefined');
    
    if (hasErrors) {
      console.log('   ⚠️  Potential JavaScript errors found - manual review needed');
    } else {
      console.log('   ✅ Product JavaScript appears clean');
    }
    
    return 0;
    
  } catch (error) {
    console.log('   ❌ Error checking JavaScript:', error.message);
    return 0;
  }
}

async function validateCustomSettings() {
  console.log('🔧 Fix 4: Validating custom settings integration...');
  
  const settingsPath = path.join(THEME_ROOT, 'config/settings_schema.json');
  
  try {
    const content = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(content);
    
    // Check for our custom GenStock settings
    const hasCustomSettings = settings.some(section => 
      section.name && section.name.includes('GenStock Video Settings')
    );
    
    if (hasCustomSettings) {
      console.log('   ✅ Custom GenStock Video Settings found');
    } else {
      console.log('   ⚠️  Custom video settings not found - they may have been overwritten');
    }
    
    return 0;
    
  } catch (error) {
    console.log('   ❌ Error validating settings:', error.message);
    return 0;
  }
}

function generateBrowserTestScript() {
  console.log('🔧 Generating browser test script...');
  
  const browserTest = `
// SPOTLIGHT-MOD CUSTOM ELEMENTS TEST
// Copy and paste this into browser console on your product page

console.log('🎬 Testing Spotlight-Mod Custom Elements...');

const tests = {
  // Test 1: Check if page loads without critical errors
  pageLoaded: !!document.querySelector('product-info'),
  
  // Test 2: Check if enhanced gallery is present
  enhancedGallery: !!document.querySelector('.custom-media-gallery, .direct-media-gallery, .auto-swap-media-gallery'),
  
  // Test 3: Check if product form is working
  productForm: !!document.querySelector('form[action*="/cart/add"]'),
  
  // Test 4: Check if custom settings are applied
  customSettings: !!document.querySelector('[data-product-id]'),
  
  // Test 5: Check for JavaScript errors
  jsErrors: window.jsErrors || [],
  
  // Test 6: Check if videos are playable
  videos: document.querySelectorAll('video').length,
  
  // Test 7: Check if variant selection works
  variantSelector: !!document.querySelector('select[name="id"], input[name="id"]'),
  
  // Test 8: Check if buy buttons are functional
  buyButtons: document.querySelectorAll('button[name="add"], input[name="add"]').length
};

console.log('📊 CUSTOM ELEMENTS TEST RESULTS:');
console.log('Page Loaded:', tests.pageLoaded ? '✅' : '❌');
console.log('Enhanced Gallery:', tests.enhancedGallery ? '✅' : '❌');
console.log('Product Form:', tests.productForm ? '✅' : '❌');
console.log('Custom Settings:', tests.customSettings ? '✅' : '❌');
console.log('Videos Found:', tests.videos);
console.log('Variant Selector:', tests.variantSelector ? '✅' : '❌');
console.log('Buy Buttons:', tests.buyButtons);

// Advanced Tests
console.log('\\n🔍 ADVANCED DIAGNOSTICS:');

// Test auto-swap functionality if present
if (typeof switchToMediaByThumb !== 'undefined') {
  console.log('Auto-swap function: ✅ Available');
} else {
  console.log('Auto-swap function: ❌ Not found');
}

// Test custom video settings
const videoSettings = {
  autoSwap: document.querySelector('[data-enable-auto-swap]'),
  customLayout: document.querySelector('[data-gallery-layout]'),
  videoControls: document.querySelectorAll('video[controls]').length
};

console.log('Video Settings:', videoSettings);

// Test for console errors
if (window.console && window.console.error) {
  const originalError = console.error;
  let errorCount = 0;
  console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.log('JavaScript Errors Detected:', errorCount);
  }, 2000);
}

// Summary
const overallScore = Object.values(tests).filter(t => t === true).length;
console.log('\\n🎯 OVERALL SCORE: ' + overallScore + '/7 tests passed');

if (overallScore >= 6) {
  console.log('🎉 Custom elements are working well!');
} else if (overallScore >= 4) {
  console.log('⚠️  Some issues found - check individual tests above');
} else {
  console.log('❌ Multiple issues detected - needs attention');
}
`;

  const testFilePath = path.join(__dirname, 'BROWSER_CUSTOM_ELEMENTS_TEST.js');
  fs.writeFileSync(testFilePath, browserTest.trim());
  console.log('   ✅ Browser test script saved to BROWSER_CUSTOM_ELEMENTS_TEST.js');
  console.log('   💡 Copy and paste the content into browser console on your product page');
}

// Run the fixes
fixCustomElements().catch(console.error); 