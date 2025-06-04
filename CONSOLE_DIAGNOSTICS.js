// 🔍 SPOTLIGHT-MOD PRODUCT PAGE DIAGNOSTICS
// Copy and paste this entire script into browser console (F12) on the product page

console.log("🚀 Starting Spotlight-Mod Product Page Diagnostics...");
console.log("=====================================");

// 1. CHECK PAGE TYPE
console.log("📄 PAGE TYPE CHECK:");
const isProductPage = window.location.pathname.includes('/products/');
const isNotFoundPage = document.title.includes('404') || document.body.innerHTML.includes('Video Not Found');
console.log(`- Is Product Page URL: ${isProductPage}`);
console.log(`- Shows 404 Content: ${isNotFoundPage}`);
console.log(`- Current URL: ${window.location.href}`);
console.log(`- Page Title: ${document.title}`);

// 2. CHECK PRODUCT OBJECT
console.log("\n🛍️ PRODUCT OBJECT CHECK:");
if (typeof window.ShopifyAnalytics !== 'undefined' && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product) {
    console.log("✅ Product found in ShopifyAnalytics");
    console.log("Product ID:", window.ShopifyAnalytics.meta.product.id);
    console.log("Product Handle:", window.ShopifyAnalytics.meta.product.handle);
} else {
    console.log("❌ No product found in ShopifyAnalytics");
}

// Check for product-info element
const productInfo = document.querySelector('product-info');
console.log(`- Product-info element found: ${!!productInfo}`);
if (productInfo) {
    console.log(`- Product ID from element: ${productInfo.dataset.productId}`);
    console.log(`- Section ID: ${productInfo.dataset.section}`);
}

// 3. CHECK TEMPLATE AND SECTION
console.log("\n🎨 TEMPLATE & SECTION CHECK:");
const mainProductSection = document.querySelector('[data-section-type="main-product"], .main-product, section[id*="MainProduct"]');
console.log(`- Main product section found: ${!!mainProductSection}`);

// Check for specific elements
const elements = {
    'Page Width Container': 'div.page-width',
    'Minimal Product': 'div.minimal-product', 
    'Minimal Media': 'div.minimal-media',
    'Minimal Info': 'div.minimal-info',
    'Product Title': 'h1.minimal-title, .product-title, h1',
    'Buy Buttons': 'form[action="/cart/add"], .shopify-payment-button, .product-form',
    'Price Display': '.minimal-price, .price'
};

Object.entries(elements).forEach(([name, selector]) => {
    const found = document.querySelector(selector);
    console.log(`- ${name}: ${found ? '✅ Found' : '❌ Missing'}`);
    if (found && name === 'Product Title') {
        console.log(`  Title text: "${found.textContent.trim()}"`);
    }
});

// 4. CHECK SCRIPTS AND ASSETS
console.log("\n📜 SCRIPTS & ASSETS CHECK:");
const scripts = [
    'product-info.js',
    'product-form.js', 
    'section-main-product.css'
];

scripts.forEach(script => {
    const found = document.querySelector(`script[src*="${script}"], link[href*="${script}"]`);
    console.log(`- ${script}: ${found ? '✅ Loaded' : '❌ Missing'}`);
});

// 5. CHECK CONSOLE ERRORS
console.log("\n🚨 RECENT CONSOLE ERRORS:");
// This will show recent errors
const originalError = console.error;
const errors = [];
console.error = function(...args) {
    errors.push(args);
    originalError.apply(console, args);
};

// Check for specific error patterns
const errorPatterns = [
    'Liquid error',
    '404',
    'template',
    'section',
    'undefined',
    'Cannot read',
    'CSP violation'
];

console.log("Checking for error patterns in page source...");
const pageSource = document.documentElement.innerHTML;
errorPatterns.forEach(pattern => {
    if (pageSource.toLowerCase().includes(pattern.toLowerCase())) {
        console.log(`⚠️ Found "${pattern}" in page source`);
    }
});

// 6. CHECK NETWORK REQUESTS
console.log("\n🌐 NETWORK CHECK:");
console.log("Checking for failed requests in Network tab...");
console.log("Look for RED (failed) requests to:");
console.log("- /products/[product-handle]");
console.log("- main-product section");
console.log("- CSS/JS assets");

// 7. CHECK SHOPIFY THEME INFO
console.log("\n🎨 THEME INFO:");
const themeInfo = document.querySelector('meta[name="shopify-theme"]');
if (themeInfo) {
    console.log(`- Theme ID: ${themeInfo.content}`);
} else {
    console.log("- Theme meta tag not found");
}

// Check for theme name in footer or other locations
const possibleThemeNames = document.body.innerHTML.match(/spotlight[-_]mod/gi);
if (possibleThemeNames) {
    console.log(`- Found theme references: ${possibleThemeNames.join(', ')}`);
}

// 8. SPECIFIC TROUBLESHOOTING
console.log("\n🔧 TROUBLESHOOTING RECOMMENDATIONS:");

if (isProductPage && isNotFoundPage) {
    console.log("❌ ISSUE: Product URL loads but shows 404 content");
    console.log("🔧 LIKELY CAUSES:");
    console.log("   1. Template product.json points to wrong section");
    console.log("   2. main-product.liquid has syntax errors");
    console.log("   3. Section schema doesn't match template blocks");
    console.log("   4. Product object not accessible in template");
}

if (!productInfo) {
    console.log("❌ ISSUE: No product-info element found");
    console.log("🔧 CHECK: main-product.liquid file exists and renders");
}

// 9. QUICK FIXES TO TRY
console.log("\n⚡ QUICK CONSOLE FIXES TO TRY:");
console.log("// Try accessing product data directly:");
console.log("fetch(window.location.pathname + '.js').then(r => r.json()).then(console.log)");

console.log("\n// Check current theme sections:");
console.log("Object.keys(window.Shopify?.theme?.sections || {})");

console.log("\n=====================================");
console.log("🔍 Diagnostics Complete!");
console.log("📋 Copy this output and share the results.");

// Auto-run product fetch test
if (isProductPage) {
    console.log("\n🧪 AUTO-TESTING PRODUCT DATA FETCH...");
    fetch(window.location.pathname + '.js')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        })
        .then(product => {
            console.log("✅ Product data fetched successfully:");
            console.log(`- Title: ${product.title}`);
            console.log(`- Handle: ${product.handle}`);
            console.log(`- Available: ${product.available}`);
            console.log(`- Variants: ${product.variants.length}`);
        })
        .catch(error => {
            console.log("❌ Product data fetch failed:");
            console.log(error);
        });
} 