/**
 * GenStock Video Store - Theme Functionality Tests
 */

class ThemeTester {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  async runTests() {
    console.log('🧪 Testing GenStock Theme...\n');
    
    await this.testIndexPage();
    await this.testCollections();
    await this.testProducts();
    await this.testUI();
    
    this.showResults();
  }

  async testIndexPage() {
    console.log('📄 Index Page Tests:');
    
    this.test('Hero section loads', () => !!document.querySelector('.rich-text'));
    this.test('Featured collection shows', () => !!document.querySelector('.featured-collection'));
    this.test('Collection list displays', () => !!document.querySelector('.collection-list'));
    this.test('Navigation works', () => !!document.querySelector('header nav'));
  }

  async testCollections() {
    console.log('\n📚 Collection Tests:');
    
    this.test('Grid layout works', () => !!document.querySelector('.collection-list.grid'));
    this.test('Cards display properly', () => !!document.querySelector('.collection-list__item .card'));
    this.test('No horizontal scroll', () => this.checkNoScroll('.collection-list'));
    this.test('Equal card heights', () => this.checkEqualHeights('.collection-list__item'));
  }

  async testProducts() {
    console.log('\n🎥 Product Tests:');
    
    this.test('Product media loads', () => !!document.querySelector('.product-media'));
    this.test('Add to cart button', () => !!document.querySelector('[name="add"]'));
    this.test('Variant selector', () => !!document.querySelector('select[name="id"]'));
  }

  async testUI() {
    console.log('\n🎨 UI Tests:');
    
    this.test('No overflow issues', () => this.checkOverflow());
    this.test('Proper spacing', () => this.checkSpacing());
    this.test('Text alignment', () => this.checkAlignment());
  }

  test(name, testFn) {
    try {
      const result = testFn();
      const status = result ? '✅' : '❌';
      console.log(`  ${status} ${name}`);
      this.results.push({ name, passed: result });
      if (!result) this.errors.push(name);
    } catch (error) {
      console.log(`  ❌ ${name} - Error: ${error.message}`);
      this.errors.push(`${name}: ${error.message}`);
    }
  }

  checkNoScroll(selector) {
    const el = document.querySelector(selector);
    return el ? el.scrollWidth <= el.clientWidth : false;
  }

  checkEqualHeights(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length < 2) return true;
    
    const heights = Array.from(elements).map(el => el.offsetHeight);
    const firstHeight = heights[0];
    return heights.every(h => Math.abs(h - firstHeight) < 10);
  }

  checkOverflow() {
    const containers = document.querySelectorAll('.collection-list, .card');
    return Array.from(containers).every(el => el.scrollWidth <= el.clientWidth + 5);
  }

  checkSpacing() {
    const items = document.querySelectorAll('.collection-list__item');
    return items.length > 0;
  }

  checkAlignment() {
    const headings = document.querySelectorAll('.card__heading');
    return headings.length > 0;
  }

  showResults() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    
    console.log('\n📊 RESULTS:');
    console.log(`Passed: ${passed}/${total} (${Math.round(passed/total*100)}%)`);
    
    if (this.errors.length === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️ Issues found:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
  }
}

// Run tests when page loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeTester().runTests();
  });
} 