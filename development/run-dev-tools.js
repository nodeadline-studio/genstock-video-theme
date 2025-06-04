#!/usr/bin/env node

/**
 * SPOTLIGHT-MOD DEVELOPMENT TOOLS RUNNER
 * Master script to run all development and testing tools
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🛠️ SPOTLIGHT-MOD DEVELOPMENT TOOLS\n');

// Ensure we're in the right directory
const DEV_DIR = __dirname;
const THEME_ROOT = path.join(DEV_DIR, '..');

console.log(`📂 Development folder: ${DEV_DIR}`);
console.log(`📂 Theme root: ${THEME_ROOT}\n`);

// Available tools
const tools = {
  '1': {
    name: 'Fix Template Routing',
    script: 'fix-template-routing.js',
    description: 'Fix product page routing conflicts'
  },
  '2': {
    name: 'Apply Automated Fixes',
    script: 'automated-theme-fixes.js', 
    description: 'Apply automated theme fixes'
  },
  '3': {
    name: 'Verify Template Fix',
    script: 'verify-template-fix.js',
    description: 'Verify template fixes worked'
  },
  '4': {
    name: 'Implement Media Swapping',
    script: 'implement-media-swapping.js',
    description: 'Implement auto media swapping feature'
  },
  '5': {
    name: 'Generate Browser Test',
    script: 'BROWSER_TEMPLATE_TEST.js',
    description: 'Generate browser console test code'
  },
  '6': {
    name: 'Generate Console Diagnostics',
    script: 'CONSOLE_DIAGNOSTICS.js',
    description: 'Generate complete diagnostic script'
  },
  '7': {
    name: '🎬 Shopify Theme Debug Pro',
    script: 'run-shopify-debug.js',
    description: 'Professional Shopify theme analysis & auto-fixes'
  },
  'all': {
    name: 'Run All Automated Tools',
    description: 'Run all automated fixing tools in sequence'
  },
  'debug': {
    name: 'Quick Shopify Debug',
    description: 'Run Shopify Theme Debug analysis only'
  }
};

function displayMenu() {
  console.log('📋 AVAILABLE TOOLS:\n');
  
  Object.entries(tools).forEach(([key, tool]) => {
    console.log(`${key}. ${tool.name}`);
    console.log(`   ${tool.description}\n`);
  });
  
  console.log('Usage: node run-dev-tools.js [tool-number]');
  console.log('Example: node run-dev-tools.js 1');
  console.log('Example: node run-dev-tools.js all');
  console.log('Example: node run-dev-tools.js debug\n');
}

function runTool(toolKey) {
  const tool = tools[toolKey];
  
  if (!tool) {
    console.log(`❌ Invalid tool: ${toolKey}`);
    displayMenu();
    return;
  }
  
  if (toolKey === 'all') {
    console.log('🚀 Running all automated tools...\n');
    
    // Run tools in logical order
    const sequence = ['1', '2', '3'];
    
    for (const key of sequence) {
      runSingleTool(key);
    }
    
    console.log('\n✅ All automated tools completed!');
    return;
  }
  
  if (toolKey === 'debug') {
    console.log('🎬 Running Quick Shopify Debug Analysis...\n');
    runSingleTool('7');
    return;
  }
  
  runSingleTool(toolKey);
}

function runSingleTool(toolKey) {
  const tool = tools[toolKey];
  
  console.log(`🔧 Running: ${tool.name}...`);
  console.log(`📄 Script: ${tool.script}\n`);
  
  try {
    // Check if script exists
    const scriptPath = path.join(DEV_DIR, tool.script);
    
    if (!fs.existsSync(scriptPath)) {
      console.log(`❌ Script not found: ${tool.script}`);
      return;
    }
    
    // For JS scripts that can be executed
    if (tool.script.endsWith('.js') && !tool.script.includes('BROWSER') && !tool.script.includes('CONSOLE')) {
      execSync(`node "${scriptPath}"`, { 
        stdio: 'inherit',
        cwd: DEV_DIR 
      });
    } else {
      // For browser scripts, just display the content
      console.log(`📋 ${tool.name} content:`);
      console.log(`Copy and paste this into browser console:\n`);
      
      const content = fs.readFileSync(scriptPath, 'utf8');
      console.log(content);
    }
    
    console.log(`\n✅ ${tool.name} completed!\n`);
    
  } catch (error) {
    console.log(`❌ Error running ${tool.name}:`, error.message);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  displayMenu();
} else {
  const toolKey = args[0].toLowerCase();
  runTool(toolKey);
}

// Export for use as module
module.exports = {
  tools,
  runTool,
  displayMenu
}; 