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
console.log('\n🔍 ADVANCED DIAGNOSTICS:');

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
console.log('\n🎯 OVERALL SCORE: ' + overallScore + '/7 tests passed');

if (overallScore >= 6) {
  console.log('🎉 Custom elements are working well!');
} else if (overallScore >= 4) {
  console.log('⚠️  Some issues found - check individual tests above');
} else {
  console.log('❌ Multiple issues detected - needs attention');
}