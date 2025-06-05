// BROWSER CONSOLE TEST - Paste this into browser console on product page
// This will verify the template routing fix worked

console.log('🔍 Testing Template Routing Fix...');

const tests = {
    hasProductContent: !!document.querySelector('[data-product-id], .product-form, input[name="id"]'),
    has404Content: !!document.querySelector('.error-title, .page-404'),
    productSections: document.querySelectorAll('section[id*="product"], .product').length,
    errorSections: document.querySelectorAll('.page-404, .error-container').length,
    pageTitle: document.title,
    hasAddToCart: !!document.querySelector('button[name="add"], .btn-add-to-cart'),
    hasBuyNow: !!document.querySelector('.shopify-payment-button, [data-shopify="payment-button"]')
};

console.log('📊 TEMPLATE ROUTING TEST RESULTS:');
console.log('Product Content:', tests.hasProductContent ? '✅ Present' : '❌ Missing');
console.log('404 Content:', tests.has404Content ? '❌ Still Present (BAD)' : '✅ Removed (GOOD)');
console.log('Product Sections:', tests.productSections);
console.log('Error Sections:', tests.errorSections);
console.log('Page Title:', tests.pageTitle);
console.log('Add to Cart:', tests.hasAddToCart ? '✅ Present' : '❌ Missing');
console.log('Buy Now:', tests.hasBuyNow ? '✅ Present' : '❌ Missing');

const isFixed = tests.hasProductContent && !tests.has404Content && tests.hasAddToCart;
console.log('\n🎯 TEMPLATE FIX STATUS:', isFixed ? '✅ SUCCESS - Templates Fixed!' : '❌ FAILED - Still has conflicts');

if (!isFixed) {
    console.log('\n🔧 DEBUGGING INFO:');
    if (!tests.hasProductContent) console.log('- Missing product content (product form, data-product-id)');
    if (tests.has404Content) console.log('- Still showing 404 content (.error-title, .page-404)');
    if (!tests.hasAddToCart) console.log('- Missing add to cart functionality');
}