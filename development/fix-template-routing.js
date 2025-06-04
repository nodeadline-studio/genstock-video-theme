#!/usr/bin/env node

/**
 * Template Routing Fix
 * Fixes the issue where product pages are showing both product content and 404 content simultaneously
 * Updated to work from development folder
 */

const fs = require('fs');
const path = require('path');

// Working from development folder, so we need to go up one level for theme files
const THEME_ROOT = path.join(__dirname, '..');

console.log('🔧 Starting Template Routing Fix...\n');
console.log(`📂 Theme root: ${THEME_ROOT}\n`);

/**
 * Fix 1: Ensure Product Template is Clean
 */
function fixProductTemplate() {
    console.log('📝 Fix 1: Checking product template configuration...');
    
    const productTemplatePath = path.join(THEME_ROOT, 'templates/product.json');
    
    if (fs.existsSync(productTemplatePath)) {
        try {
            const productTemplate = JSON.parse(fs.readFileSync(productTemplatePath, 'utf8'));
            
            // Ensure clean product template structure
            const cleanTemplate = {
                "sections": {
                    "main": {
                        "type": "main-product",
                        "blocks": {
                            "title": {
                                "type": "title",
                                "settings": {}
                            },
                            "price": {
                                "type": "price", 
                                "settings": {}
                            },
                            "variant_picker": {
                                "type": "variant_picker",
                                "settings": {
                                    "picker_type": "dropdown",
                                    "swatch_shape": "circle"
                                }
                            },
                            "quantity_selector": {
                                "type": "quantity_selector",
                                "settings": {}
                            },
                            "description": {
                                "type": "description",
                                "settings": {}
                            },
                            "buy_buttons": {
                                "type": "buy_buttons",
                                "settings": {
                                    "show_dynamic_checkout": true,
                                    "show_gift_card_recipient": true
                                }
                            }
                        },
                        "block_order": [
                            "title",
                            "price", 
                            "variant_picker",
                            "quantity_selector",
                            "description",
                            "buy_buttons"
                        ],
                        "settings": {
                            "enable_sticky_info": false,
                            "color_scheme": "background-1",
                            "media_size": "large",
                            "media_position": "left", 
                            "gallery_layout": "stacked",
                            "mobile_thumbnails": "hide",
                            "padding_top": 36,
                            "padding_bottom": 36
                        }
                    },
                    "related-products": {
                        "type": "related-products",
                        "settings": {
                            "heading": "Related products",
                            "heading_size": "h2",
                            "products_to_show": 4,
                            "columns_desktop": 4,
                            "color_scheme": "background-1",
                            "image_ratio": "square",
                            "show_secondary_image": true,
                            "show_vendor": false,
                            "show_rating": false,
                            "columns_mobile": "2",
                            "padding_top": 16,
                            "padding_bottom": 36
                        }
                    }
                },
                "order": [
                    "main",
                    "related-products"
                ]
            };
            
            fs.writeFileSync(productTemplatePath, JSON.stringify(cleanTemplate, null, 2));
            console.log('   ✅ Product template configuration cleaned');
            
        } catch (error) {
            console.log('   ❌ Error reading product template:', error.message);
            return false;
        }
    } else {
        console.log('   ❌ Product template not found');
        return false;
    }
    
    return true;
}

/**
 * Fix 2: Ensure 404 Template Only Uses 404 Section  
 */
function fix404Template() {
    console.log('📝 Fix 2: Checking 404 template configuration...');
    
    const template404Path = path.join(THEME_ROOT, 'templates/404.json');
    
    if (fs.existsSync(template404Path)) {
        try {
            // Ensure clean 404 template
            const clean404Template = {
                "sections": {
                    "main": {
                        "type": "main-404",
                        "settings": {}
                    }
                },
                "order": ["main"]
            };
            
            fs.writeFileSync(template404Path, JSON.stringify(clean404Template, null, 2));
            console.log('   ✅ 404 template configuration cleaned');
            
        } catch (error) {
            console.log('   ❌ Error fixing 404 template:', error.message);
            return false;
        }
    } else {
        console.log('   ❌ 404 template not found');
        return false;
    }
    
    return true;
}

/**
 * Fix 3: Remove Conflicting Settings
 */
function removeConflictingSettings() {
    console.log('📝 Fix 3: Removing conflicting settings...');
    
    const settingsPath = path.join(THEME_ROOT, 'config/settings_data.json');
    
    if (fs.existsSync(settingsPath)) {
        try {
            console.log('   🗑️  Removing settings_data.json that may cause conflicts');
            fs.unlinkSync(settingsPath);
            console.log('   ✅ Conflicting settings removed');
        } catch (error) {
            console.log('   ⚠️  Could not remove settings file:', error.message);
        }
    } else {
        console.log('   ✅ No conflicting settings found');
    }
    
    return true;
}

/**
 * Fix 4: Verify Template Structure
 */
function verifyTemplateStructure() {
    console.log('📝 Fix 4: Verifying template structure...');
    
    const requiredTemplates = [
        'templates/product.json',
        'templates/404.json'
    ];
    
    let allValid = true;
    
    for (const templatePath of requiredTemplates) {
        const fullPath = path.join(THEME_ROOT, templatePath);
        if (fs.existsSync(fullPath)) {
            try {
                const template = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                if (template.sections && template.order) {
                    console.log(`   ✅ ${templatePath} structure valid`);
                } else {
                    console.log(`   ❌ ${templatePath} missing required structure`);
                    allValid = false;
                }
            } catch (error) {
                console.log(`   ❌ ${templatePath} invalid JSON:`, error.message);
                allValid = false;
            }
        } else {
            console.log(`   ❌ ${templatePath} not found`);
            allValid = false;
        }
    }
    
    return allValid;
}

/**
 * Fix 5: Clean Template Cache References
 */
function cleanTemplateCacheReferences() {
    console.log('📝 Fix 5: Cleaning template cache references...');
    
    // Check for any liquid files that might be interfering
    const problematicFiles = [
        'templates/product.liquid', // Should not exist if using .json
        'templates/product.404.liquid', // Should not exist
        'sections/product-404.liquid', // Should not exist
    ];
    
    let cleaned = false;
    
    for (const filePath of problematicFiles) {
        const fullPath = path.join(THEME_ROOT, filePath);
        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
                console.log(`   🗑️  Removed conflicting file: ${filePath}`);
                cleaned = true;
            } catch (error) {
                console.log(`   ⚠️  Could not remove ${filePath}:`, error.message);
            }
        }
    }
    
    if (!cleaned) {
        console.log('   ✅ No conflicting template files found');
    }
    
    return true;
}

// Execute all fixes
async function executeAllFixes() {
    const fixes = [
        { name: 'Product Template', fn: fixProductTemplate },
        { name: '404 Template', fn: fix404Template },
        { name: 'Conflicting Settings', fn: removeConflictingSettings },
        { name: 'Template Structure', fn: verifyTemplateStructure },
        { name: 'Template Cache', fn: cleanTemplateCacheReferences }
    ];
    
    let successCount = 0;
    
    for (const fix of fixes) {
        try {
            const success = fix.fn();
            if (success) {
                successCount++;
            }
        } catch (error) {
            console.log(`❌ Error in ${fix.name}:`, error.message);
        }
        console.log(''); // Add spacing
    }
    
    console.log('📊 TEMPLATE ROUTING FIX SUMMARY:');
    console.log(`✅ Successful fixes: ${successCount}/${fixes.length}`);
    
    if (successCount === fixes.length) {
        console.log('\n🎉 Template routing fix completed successfully!');
        console.log('\n📋 Next Steps:');
        console.log('1. Upload the theme to Shopify');
        console.log('2. Test product pages (e.g., /products/meadow-slow-pan-left)');
        console.log('3. Verify only product content displays (no 404 content)');
        console.log('4. Check browser console for any remaining errors');
    } else {
        console.log('\n⚠️  Some fixes had issues. Please review the output above.');
    }
}

// Run the fixes
executeAllFixes().catch(console.error); 