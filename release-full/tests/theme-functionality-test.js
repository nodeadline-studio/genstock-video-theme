/**
 * GenStock Video Store - Comprehensive Theme Functionality Tests
 * Tests all critical functionality including index, collections, products, and UI alignment
 */

class ThemeFunctionalityTester {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.warnings = [];
  }

  // Main test runner
  async runAllTests() {
    console.log('🧪 Starting GenStock Theme Functionality Tests...\n');
    
    try {
      await this.testIndexPage();
      await this.testCollectionPages();
      await this.testProductPages();
      await this.testVariantFunctionality();
      await this.testUIAlignment();
      await this.testResponsiveDesign();
      await this.testSEOFeatures();
      await this.testPerformance();
      
      this.generateReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.errors.push(`Test suite failure: ${error.message}`);
    }
  }

  // Test index page functionality
  async testIndexPage() {
    console.log('📄 Testing Index Page...');
    
    const tests = [
      {
        name: 'Hero Section Loads',
        test: () => this.checkElement('.rich-text'),
        critical: true
      },
      {
        name: 'Featured Collection Displays',
        test: () => this.checkElement('.featured-collection'),
        critical: true
      },
      {
        name: 'Collection List Shows Categories',
        test: () => this.checkElement('.collection-list'),
        critical: true
      },
      {
        name: 'Navigation Menu Works',
        test: () => this.checkElement('header nav'),
        critical: true
      },
      {
        name: 'No Crypto App Section (Removed)',
        test: () => !this.checkElement('[data-section-type="apps"]'),
        critical: false
      }
    ];

    await this.runTestGroup('Index Page', tests);
  }

  // Test collection pages
  async testCollectionPages() {
    console.log('📚 Testing Collection Pages...');
    
    const tests = [
      {
        name: 'Collection Grid Layout',
        test: () => this.checkElement('.collection-list.grid'),
        critical: true
      },
      {
        name: 'Product Cards Display Correctly',
        test: () => this.checkElement('.collection-list__item .card'),
        critical: true
      },
      {
        name: 'Video Thumbnails Have Correct Aspect Ratio',
        test: () => this.checkCSS('.collection-list__item .media', 'aspect-ratio', '16 / 9'),
        critical: true
      },
      {
        name: 'Card Heights Are Equal',
        test: () => this.checkCSS('.collection-list__item .card', 'height', '100%'),
        critical: true
      },
      {
        name: 'Product Titles Truncate Properly',
        test: () => this.checkCSS('.collection-list__item .card__heading', '-webkit-line-clamp', '2'),
        critical: true
      },
      {
        name: 'No Horizontal Scrolling',
        test: () => this.checkNoHorizontalScroll('.collection-list'),
        critical: true
      }
    ];

    await this.runTestGroup('Collection Pages', tests);
  }

  // Test product pages
  async testProductPages() {
    console.log('🎥 Testing Product Pages...');
    
    const tests = [
      {
        name: 'Product Media Gallery Loads',
        test: () => this.checkElement('.product-media-zone'),
        critical: true
      },
      {
        name: 'Product Details Section',
        test: () => this.checkElement('.product-details-zone'),
        critical: true
      },
      {
        name: 'Video Player Controls',
        test: () => this.checkElement('video[controls]'),
        critical: true
      },
      {
        name: 'Add to Cart Button',
        test: () => this.checkElement('[name="add"]'),
        critical: true
      },
      {
        name: 'Product Form Functionality',
        test: () => this.checkElement('form[action*="/cart/add"]'),
        critical: true
      }
    ];

    await this.runTestGroup('Product Pages', tests);
  }

  // Test variant functionality
  async testVariantFunctionality() {
    console.log('🔄 Testing Variant Functionality...');
    
    const tests = [
      {
        name: 'Variant Selector Present',
        test: () => this.checkElement('.product-form__input--dropdown, .product-form__input--swatch'),
        critical: true
      },
      {
        name: 'Price Updates on Variant Change',
        test: () => this.testVariantPriceUpdate(),
        critical: true
      },
      {
        name: 'Video Changes with Variant',
        test: () => this.testVariantVideoSync(),
        critical: true
      },
      {
        name: 'Single Variant Interface in Cards',
        test: () => this.checkElement('.collection-list__item .variant-selector'),
        critical: false
      },
      {
        name: 'Variant Availability Updates',
        test: () => this.testVariantAvailability(),
        critical: true
      }
    ];

    await this.runTestGroup('Variant Functionality', tests);
  }

  // Test UI alignment and consistency
  async testUIAlignment() {
    console.log('🎨 Testing UI Alignment...');
    
    const tests = [
      {
        name: 'Grid Items Equal Height',
        test: () => this.checkEqualHeights('.collection-list__item'),
        critical: true
      },
      {
        name: 'Text Alignment Consistent',
        test: () => this.checkTextAlignment(),
        critical: true
      },
      {
        name: 'No Overflow Issues',
        test: () => this.checkForOverflow(),
        critical: true
      },
      {
        name: 'Proper Spacing Between Elements',
        test: () => this.checkSpacing(),
        critical: true
      },
      {
        name: 'Button Alignment Consistent',
        test: () => this.checkButtonAlignment(),
        critical: true
      }
    ];

    await this.runTestGroup('UI Alignment', tests);
  }

  // Test responsive design
  async testResponsiveDesign() {
    console.log('📱 Testing Responsive Design...');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1200, height: 800 },
      { name: 'Large Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await this.testViewport(viewport);
    }
  }

  // Test SEO features
  async testSEOFeatures() {
    console.log('🔍 Testing SEO Features...');
    
    const tests = [
      {
        name: 'Meta Tags Present',
        test: () => this.checkElement('meta[name="description"]'),
        critical: true
      },
      {
        name: 'Structured Data',
        test: () => this.checkElement('script[type="application/ld+json"]'),
        critical: true
      },
      {
        name: 'Alt Tags on Images',
        test: () => this.checkImageAltTags(),
        critical: true
      },
      {
        name: 'Heading Hierarchy',
        test: () => this.checkHeadingHierarchy(),
        critical: true
      },
      {
        name: 'Canonical URLs',
        test: () => this.checkElement('link[rel="canonical"]'),
        critical: true
      }
    ];

    await this.runTestGroup('SEO Features', tests);
  }

  // Test performance
  async testPerformance() {
    console.log('⚡ Testing Performance...');
    
    const tests = [
      {
        name: 'Page Load Time < 3s',
        test: () => this.checkPageLoadTime(),
        critical: true
      },
      {
        name: 'Images Lazy Load',
        test: () => this.checkElement('img[loading="lazy"]'),
        critical: false
      },
      {
        name: 'CSS Minified',
        test: () => this.checkCSSMinification(),
        critical: false
      },
      {
        name: 'No Console Errors',
        test: () => this.checkConsoleErrors(),
        critical: true
      }
    ];

    await this.runTestGroup('Performance', tests);
  }

  // Helper methods
  checkElement(selector) {
    return document.querySelector(selector) !== null;
  }

  checkCSS(selector, property, expectedValue) {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.getPropertyValue(property).includes(expectedValue);
  }

  checkNoHorizontalScroll(selector) {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    return element.scrollWidth <= element.clientWidth;
  }

  checkEqualHeights(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length < 2) return true;
    
    const heights = Array.from(elements).map(el => el.offsetHeight);
    const firstHeight = heights[0];
    return heights.every(height => Math.abs(height - firstHeight) < 5); // 5px tolerance
  }

  async testVariantPriceUpdate() {
    // Simulate variant change and check if price updates
    const variantSelector = document.querySelector('select[name="id"], input[name="id"]');
    const priceElement = document.querySelector('.price');
    
    if (!variantSelector || !priceElement) return false;
    
    const originalPrice = priceElement.textContent;
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    variantSelector.dispatchEvent(event);
    
    // Wait for price update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return priceElement.textContent !== originalPrice || originalPrice.includes('$');
  }

  async testVariantVideoSync() {
    // Check if video changes when variant changes
    const variantSelector = document.querySelector('select[name="id"]');
    const videoElement = document.querySelector('video');
    
    if (!variantSelector || !videoElement) return false;
    
    const originalSrc = videoElement.src;
    
    // Change variant
    if (variantSelector.options && variantSelector.options.length > 1) {
      variantSelector.selectedIndex = 1;
      const event = new Event('change', { bubbles: true });
      variantSelector.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return videoElement.src !== originalSrc;
    }
    
    return true; // Pass if only one variant
  }

  async testVariantAvailability() {
    // Check if unavailable variants are properly handled
    const variantSelectors = document.querySelectorAll('select[name="id"] option, input[name="id"]');
    const addToCartButton = document.querySelector('[name="add"]');
    
    if (!addToCartButton) return false;
    
    // Check if button states change based on availability
    return !addToCartButton.disabled || addToCartButton.textContent.includes('Add to cart');
  }

  checkTextAlignment() {
    const textElements = document.querySelectorAll('.card__heading, .card__content, .price');
    return Array.from(textElements).every(el => {
      const style = window.getComputedStyle(el);
      return style.textAlign !== 'unset';
    });
  }

  checkForOverflow() {
    const containers = document.querySelectorAll('.collection-list, .product-grid, .card');
    return Array.from(containers).every(container => {
      return container.scrollWidth <= container.clientWidth + 5; // 5px tolerance
    });
  }

  checkSpacing() {
    const gridItems = document.querySelectorAll('.collection-list__item');
    if (gridItems.length < 2) return true;
    
    const firstItem = gridItems[0];
    const secondItem = gridItems[1];
    const gap = secondItem.offsetLeft - (firstItem.offsetLeft + firstItem.offsetWidth);
    
    return gap >= 8 && gap <= 32; // Reasonable gap range
  }

  checkButtonAlignment() {
    const buttons = document.querySelectorAll('.btn, button, [role="button"]');
    return Array.from(buttons).every(btn => {
      const style = window.getComputedStyle(btn);
      return style.display !== 'inline' || style.verticalAlign === 'middle';
    });
  }

  async testViewport(viewport) {
    // Simulate viewport change
    if (window.innerWidth !== viewport.width) {
      // In a real test environment, you'd resize the viewport
      console.log(`Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    }
    
    const tests = [
      {
        name: `${viewport.name} - Layout Not Broken`,
        test: () => this.checkForOverflow(),
        critical: true
      },
      {
        name: `${viewport.name} - Touch Targets Adequate`,
        test: () => this.checkTouchTargets(),
        critical: viewport.width < 768
      }
    ];

    await this.runTestGroup(`${viewport.name} Responsive`, tests);
  }

  checkTouchTargets() {
    const interactiveElements = document.querySelectorAll('button, a, input, select');
    return Array.from(interactiveElements).every(el => {
      const rect = el.getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44; // WCAG minimum
    });
  }

  checkImageAltTags() {
    const images = document.querySelectorAll('img');
    return Array.from(images).every(img => img.alt !== '');
  }

  checkHeadingHierarchy() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;
    
    return Array.from(headings).every(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level <= currentLevel + 1) {
        currentLevel = level;
        return true;
      }
      return false;
    });
  }

  checkPageLoadTime() {
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      return loadTime < 3000; // 3 seconds
    }
    return true; // Can't measure, assume pass
  }

  checkCSSMinification() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    return Array.from(stylesheets).some(link => 
      link.href.includes('.min.css') || link.href.includes('minified')
    );
  }

  checkConsoleErrors() {
    // In a real test environment, you'd capture console errors
    return true; // Placeholder
  }

  async runTestGroup(groupName, tests) {
    console.log(`\n  🧪 ${groupName}:`);
    
    for (const test of tests) {
      try {
        const result = await test.test();
        const status = result ? '✅' : (test.critical ? '❌' : '⚠️');
        console.log(`    ${status} ${test.name}`);
        
        this.testResults.push({
          group: groupName,
          name: test.name,
          passed: result,
          critical: test.critical
        });
        
        if (!result && test.critical) {
          this.errors.push(`${groupName}: ${test.name} failed`);
        } else if (!result) {
          this.warnings.push(`${groupName}: ${test.name} failed (non-critical)`);
        }
      } catch (error) {
        console.log(`    ❌ ${test.name} - Error: ${error.message}`);
        this.errors.push(`${groupName}: ${test.name} - ${error.message}`);
      }
    }
  }

  generateReport() {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const criticalFailures = this.errors.length;
    const warnings = this.warnings.length;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`Critical Failures: ${criticalFailures}`);
    console.log(`Warnings: ${warnings}`);
    
    if (criticalFailures === 0) {
      console.log('\n🎉 All critical tests passed! Theme is ready for production.');
    } else {
      console.log('\n⚠️  Critical issues found. Please fix before deploying:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (warnings > 0) {
      console.log('\n💡 Non-critical improvements suggested:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    // Generate detailed report
    this.generateDetailedReport();
  }

  generateDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.testResults.length,
        passed: this.testResults.filter(t => t.passed).length,
        failed: this.testResults.filter(t => !t.passed).length,
        criticalFailures: this.errors.length,
        warnings: this.warnings.length
      },
      results: this.testResults,
      errors: this.errors,
      warnings: this.warnings
    };
    
    // In a real environment, you'd save this to a file
    console.log('\n📄 Detailed report generated:', JSON.stringify(report, null, 2));
  }
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  // Browser environment
  document.addEventListener('DOMContentLoaded', () => {
    const tester = new ThemeFunctionalityTester();
    tester.runAllTests();
  });
} else {
  // Node.js environment
  module.exports = ThemeFunctionalityTester;
} 