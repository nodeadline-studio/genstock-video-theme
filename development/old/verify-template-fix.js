#!/usr/bin/env node

/**
 * Template Fix Verification Script
 * Tests that the template routing conflict has been resolved
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Template Routing Fix...\n');

/**
 * Verification 1: Template Configuration Check
 */
function verifyTemplateConfigurations() {
    console.log('📋 Verification 1: Template Configuration Check');
    
    const tests = [
        {
            name: 'Product Template',
            path: 'templates/product.json',
            expectedType: 'main-product',
            shouldNotContain: ['main-404', '404', 'error']
        },
        {
            name: '404 Template', 
            path: 'templates/404.json',
            expectedType: 'main-404',
            shouldNotContain: ['main-product', 'product', 'buy_buttons']
        }
    ];
    
    let allPassed = true;
    
    for (const test of tests) {
        try {
            const content = fs.readFileSync(test.path, 'utf8');
            const config = JSON.parse(content);
            
            // Check main section type
            if (config.sections?.main?.type === test.expectedType) {
                console.log(`   ✅ ${test.name}: Correct section type (${test.expectedType})`);
            } else {
                console.log(`   ❌ ${test.name}: Wrong section type. Expected ${test.expectedType}, got ${config.sections?.main?.type}`);
                allPassed = false;
            }
            
            // Check for conflicting content
            let hasConflicts = false;
            for (const forbidden of test.shouldNotContain) {
                if (content.toLowerCase().includes(forbidden.toLowerCase())) {
                    console.log(`   ⚠️  ${test.name}: Contains forbidden content: ${forbidden}`);
                    hasConflicts = true;
                }
            }
            
            if (!hasConflicts) {
                console.log(`   ✅ ${test.name}: No conflicting content found`);
            } else {
                allPassed = false;
            }
            
        } catch (error) {
            console.log(`   ❌ ${test.name}: Error reading template - ${error.message}`);
            allPassed = false;
        }
    }
    
    return allPassed;
}

/**
 * Verification 2: Section File Integrity
 */
function verifySectionFiles() {
    console.log('\n📋 Verification 2: Section File Integrity');
    
    const requiredSections = [
        {
            name: 'Main Product Section',
            path: 'sections/main-product.liquid',
            shouldContain: ['product', 'add_to_cart', 'buy_buttons'],
            shouldNotContain: ['Video Not Found', '404', 'error-title']
        },
        {
            name: 'Main 404 Section',
            path: 'sections/main-404.liquid', 
            shouldContain: ['Video Not Found', '404', 'error-title'],
            shouldNotContain: ['add_to_cart', 'buy_buttons', 'product.id']
        }
    ];
    
    let allPassed = true;
    
    for (const section of requiredSections) {
        try {
            const content = fs.readFileSync(section.path, 'utf8');
            
            // Check required content
            let hasRequired = true;
            for (const required of section.shouldContain) {
                if (!content.includes(required)) {
                    console.log(`   ❌ ${section.name}: Missing required content: ${required}`);
                    hasRequired = false;
                }
            }
            
            if (hasRequired) {
                console.log(`   ✅ ${section.name}: Contains all required content`);
            } else {
                allPassed = false;
            }
            
            // Check forbidden content
            let hasForbidden = false;
            for (const forbidden of section.shouldNotContain) {
                if (content.includes(forbidden)) {
                    console.log(`   ⚠️  ${section.name}: Contains forbidden content: ${forbidden}`);
                    hasForbidden = true;
                }
            }
            
            if (!hasForbidden) {
                console.log(`   ✅ ${section.name}: No forbidden content found`);
            } else {
                allPassed = false;
            }
            
        } catch (error) {
            console.log(`   ❌ ${section.name}: Error reading section - ${error.message}`);
            allPassed = false;
        }
    }
    
    return allPassed;
}

/**
 * Verification 3: No Conflicting Files
 */
function verifyNoConflictingFiles() {
    console.log('\n📋 Verification 3: No Conflicting Files');
    
    const conflictingFiles = [
        'templates/product.liquid',
        'templates/product.404.liquid',
        'sections/product-404.liquid',
        'sections/main-product-404.liquid',
        'config/settings_data.json'
    ];
    
    let allPassed = true;
    
    for (const filePath of conflictingFiles) {
        if (fs.existsSync(filePath)) {
            console.log(`   ⚠️  Found conflicting file: ${filePath}`);
            allPassed = false;
        } else {
            console.log(`   ✅ No conflicting file: ${filePath}`);
        }
    }
    
    return allPassed;
}

/**
 * Verification 4: Template Structure Validation
 */
function verifyTemplateStructure() {
    console.log('\n📋 Verification 4: Template Structure Validation');
    
    const templates = ['templates/product.json', 'templates/404.json'];
    let allPassed = true;
    
    for (const templatePath of templates) {
        try {
            const content = fs.readFileSync(templatePath, 'utf8');
            const config = JSON.parse(content);
            
            // Check required structure
            if (!config.sections) {
                console.log(`   ❌ ${templatePath}: Missing 'sections' property`);
                allPassed = false;
                continue;
            }
            
            if (!config.order) {
                console.log(`   ❌ ${templatePath}: Missing 'order' property`);
                allPassed = false;
                continue;
            }
            
            if (!config.sections.main) {
                console.log(`   ❌ ${templatePath}: Missing 'main' section`);
                allPassed = false;
                continue;
            }
            
            if (!config.sections.main.type) {
                console.log(`   ❌ ${templatePath}: Missing section type`);
                allPassed = false;
                continue;
            }
            
            console.log(`   ✅ ${templatePath}: Valid structure`);
            
        } catch (error) {
            console.log(`   ❌ ${templatePath}: Invalid JSON - ${error.message}`);
            allPassed = false;
        }
    }
    
    return allPassed;
}

/**
 * Verification 5: Generate Browser Console Test
 */
function generateBrowserTest() {
    console.log('\n📋 Verification 5: Browser Console Test Generated');
    
    const browserTest = `
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
console.log('\\n🎯 TEMPLATE FIX STATUS:', isFixed ? '✅ SUCCESS - Templates Fixed!' : '❌ FAILED - Still has conflicts');

if (!isFixed) {
    console.log('\\n🔧 DEBUGGING INFO:');
    if (!tests.hasProductContent) console.log('- Missing product content (product form, data-product-id)');
    if (tests.has404Content) console.log('- Still showing 404 content (.error-title, .page-404)');
    if (!tests.hasAddToCart) console.log('- Missing add to cart functionality');
}
`;
    
    const testFilePath = 'BROWSER_TEMPLATE_TEST.js';
    fs.writeFileSync(testFilePath, browserTest.trim());
    console.log(`   ✅ Browser test saved to: ${testFilePath}`);
    console.log('   📋 Copy and paste the content into browser console on a product page');
    
    return true;
}

// Execute all verifications
async function executeAllVerifications() {
    const verifications = [
        { name: 'Template Configurations', fn: verifyTemplateConfigurations },
        { name: 'Section File Integrity', fn: verifySectionFiles },
        { name: 'No Conflicting Files', fn: verifyNoConflictingFiles },
        { name: 'Template Structure', fn: verifyTemplateStructure },
        { name: 'Browser Test Generator', fn: generateBrowserTest }
    ];
    
    let successCount = 0;
    
    for (const verification of verifications) {
        try {
            const success = verification.fn();
            if (success) {
                successCount++;
            }
        } catch (error) {
            console.log(`❌ Error in ${verification.name}:`, error.message);
        }
    }
    
    console.log('\n📊 TEMPLATE FIX VERIFICATION SUMMARY:');
    console.log(`✅ Passed verifications: ${successCount}/${verifications.length}`);
    
    if (successCount === verifications.length) {
        console.log('\n🎉 Template routing fix verification PASSED!');
        console.log('\n📋 Next Steps:');
        console.log('1. Upload theme to Shopify');
        console.log('2. Visit product page (e.g., /products/meadow-slow-pan-left)');
        console.log('3. Run the browser console test');
        console.log('4. Verify only product content displays (no 404 error)');
    } else {
        console.log('\n⚠️  Some verifications failed. Review the output above.');
    }
}

// Run all verifications
executeAllVerifications().catch(console.error); 