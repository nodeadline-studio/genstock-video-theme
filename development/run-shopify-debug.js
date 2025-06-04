#!/usr/bin/env node

/**
 * SHOPIFY THEME DEBUG INTEGRATION
 * Runs the professional Shopify theme debug tool on Spotlight-Mod
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🎬 SHOPIFY THEME DEBUG INTEGRATION\n');

// Paths
const DEV_DIR = __dirname;
const THEME_ROOT = path.join(DEV_DIR, '..');
const DEBUG_TOOL_PATH = path.join(THEME_ROOT, '../../Theme Updates/Shopify Theme Debug');

console.log(`📂 Theme root: ${THEME_ROOT}`);
console.log(`🛠️ Debug tool: ${DEBUG_TOOL_PATH}\n`);

// Available debug operations
const operations = {
  '1': {
    name: 'Quick Analysis',
    description: 'Run quick theme analysis and show results',
    command: 'node test-analyzer.js'
  },
  '2': {
    name: 'Auto-Fix Spotlight Issues',
    description: 'Apply automatic fixes to Spotlight theme',
    command: 'node fix-spotlight-theme.js'
  },
  '3': {
    name: 'Fix Form Issues',
    description: 'Fix form ID and declaration issues',
    command: 'node fix-form-id-issue.js'
  },
  '4': {
    name: 'Fix Thumbnail Layers',
    description: 'Fix thumbnail layer and media issues',
    command: 'node fix-thumbnail-layers.js'
  },
  '5': {
    name: 'Start Web Interface',
    description: 'Start the full web debug interface',
    command: 'npm run server',
    background: true
  },
  'all': {
    name: 'Run All Fixes',
    description: 'Apply all automatic fixes in sequence'
  }
};

function displayMenu() {
  console.log('🔧 SHOPIFY THEME DEBUG OPERATIONS:\n');
  
  Object.entries(operations).forEach(([key, op]) => {
    console.log(`${key}. ${op.name}`);
    console.log(`   ${op.description}\n`);
  });
  
  console.log('💡 Web Interface URLs:');
  console.log('   Demo: http://localhost:3000/demo');
  console.log('   Spotlight: http://localhost:3000/spotlight');
  console.log('   Full Interface: http://localhost:3000\n');
  
  console.log('Usage: node run-shopify-debug.js [operation-number]');
  console.log('Example: node run-shopify-debug.js 1\n');
}

function runOperation(opKey) {
  const operation = operations[opKey];
  
  if (!operation) {
    console.log(`❌ Invalid operation: ${opKey}`);
    displayMenu();
    return;
  }
  
  // Check if debug tool directory exists
  if (!fs.existsSync(DEBUG_TOOL_PATH)) {
    console.log(`❌ Debug tool not found at: ${DEBUG_TOOL_PATH}`);
    console.log('💡 Make sure the "Theme Updates/Shopify Theme Debug" folder exists');
    return;
  }
  
  if (opKey === 'all') {
    console.log('🚀 Running all automatic fixes...\n');
    
    const sequence = ['1', '2', '3', '4'];
    
    for (const key of sequence) {
      runSingleOperation(key);
    }
    
    console.log('\n✅ All automatic fixes completed!');
    console.log('💡 Start web interface with: node run-shopify-debug.js 5');
    return;
  }
  
  runSingleOperation(opKey);
}

function runSingleOperation(opKey) {
  const operation = operations[opKey];
  
  console.log(`🔧 ${operation.name}...`);
  console.log(`📄 Command: ${operation.command}\n`);
  
  try {
    if (operation.background) {
      console.log('🌐 Starting web server in background...');
      console.log('💡 Access at: http://localhost:3000');
      console.log('⚠️  Press Ctrl+C to stop the server\n');
    }
    
    execSync(operation.command, { 
      stdio: 'inherit',
      cwd: DEBUG_TOOL_PATH
    });
    
    console.log(`\n✅ ${operation.name} completed!\n`);
    
  } catch (error) {
    console.log(`❌ Error in ${operation.name}:`, error.message);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  displayMenu();
} else {
  const opKey = args[0].toLowerCase();
  runOperation(opKey);
}

// Export for use as module
module.exports = {
  operations,
  runOperation,
  displayMenu
}; 