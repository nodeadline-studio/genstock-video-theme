#!/usr/bin/env node

/**
 * SPOTLIGHT-MOD ↔ SHOPIFY THEME DEBUG INTEGRATION
 * Bridge script to use the advanced Shopify Theme Debug system with our Spotlight-Mod
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔗 SPOTLIGHT-MOD ↔ SHOPIFY THEME DEBUG INTEGRATION\n');

// Paths
const SPOTLIGHT_MOD_ROOT = path.join(__dirname, '..');
const THEME_DEBUG_ROOT = path.join(__dirname, '../../../Theme Updates/Shopify Theme Debug');

console.log(`📂 Spotlight-Mod: ${SPOTLIGHT_MOD_ROOT}`);
console.log(`📂 Theme Debug System: ${THEME_DEBUG_ROOT}\n`);

// Check if Theme Debug system exists
if (!fs.existsSync(THEME_DEBUG_ROOT)) {
    console.log('❌ Shopify Theme Debug system not found!');
    console.log('📍 Expected location: ../../../Theme Updates/Shopify Theme Debug');
    console.log('\n💡 Make sure the path is correct or adjust THEME_DEBUG_ROOT in this script');
    process.exit(1);
}

// Available integration commands
const commands = {
    '1': {
        name: 'Quick Analysis',
        description: 'Run basic theme analysis on Spotlight-Mod',
        command: 'node test-analyzer.js'
    },
    '2': {
        name: 'Auto-Fix Spotlight Issues', 
        description: 'Apply automated fixes specifically for Spotlight theme',
        command: 'node fix-spotlight-theme.js'
    },
    '3': {
        name: 'Fix Form ID Issues',
        description: 'Fix form declaration and ID conflicts',
        command: 'node fix-form-id-issue.js'
    },
    '4': {
        name: 'Fix Thumbnail Layers',
        description: 'Fix media gallery thumbnail layering issues',
        command: 'node fix-thumbnail-layers.js'
    },
    '5': {
        name: 'Error-Only Analysis',
        description: 'Focus only on critical errors and issues',
        command: 'node fix-error-only.js'
    },
    '6': {
        name: 'Start Full Debug Server',
        description: 'Launch web interface for comprehensive debugging',
        command: 'npm run server'
    },
    '7': {
        name: 'Demo Mode',
        description: 'Run in demo mode (no Shopify connection required)',
        command: 'npm run server'
    },
    'all': {
        name: 'Complete Analysis & Fix Pipeline',
        description: 'Run comprehensive analysis and apply all safe fixes'
    }
};

function displayMenu() {
    console.log('🛠️ AVAILABLE THEME DEBUG TOOLS:\n');
    
    Object.entries(commands).forEach(([key, cmd]) => {
        console.log(`${key}. ${cmd.name}`);
        console.log(`   ${cmd.description}\n`);
    });
    
    console.log('Usage: node integrate-theme-debug.js [command-number]');
    console.log('Example: node integrate-theme-debug.js 2');
    console.log('Example: node integrate-theme-debug.js all\n');
}

function runCommand(cmdKey) {
    const cmd = commands[cmdKey];
    
    if (!cmd) {
        console.log(`❌ Invalid command: ${cmdKey}`);
        displayMenu();
        return;
    }
    
    if (cmdKey === 'all') {
        console.log('🚀 Running complete analysis and fix pipeline...\n');
        
        // Run in sequence: analyze → fix forms → fix spotlight → fix errors
        const sequence = ['1', '3', '2', '5'];
        
        for (const key of sequence) {
            console.log(`\n${'='.repeat(60)}`);
            runSingleCommand(key);
            console.log(`${'='.repeat(60)}\n`);
        }
        
        console.log('✅ Complete pipeline finished!');
        console.log('\n📋 Next Steps:');
        console.log('1. Review the fixes applied above');
        console.log('2. Test your theme in Shopify');
        console.log('3. Run option 6 for web interface if needed');
        return;
    }
    
    if (cmdKey === '6' || cmdKey === '7') {
        console.log(`🌐 Starting web interface...`);
        console.log(`📍 URL: http://localhost:3000${cmdKey === '7' ? '/demo' : '/spotlight'}`);
        console.log('🔄 Server will start in Theme Debug directory...\n');
    }
    
    runSingleCommand(cmdKey);
}

function runSingleCommand(cmdKey) {
    const cmd = commands[cmdKey];
    
    console.log(`🔧 Running: ${cmd.name}...`);
    console.log(`📝 Description: ${cmd.description}\n`);
    
    try {
        // Change to Theme Debug directory and run command
        process.chdir(THEME_DEBUG_ROOT);
        console.log(`📂 Working directory: ${process.cwd()}\n`);
        
        // For web server commands, provide instructions instead of blocking
        if (cmd.command.includes('npm run server')) {
            console.log('🚀 To start the server, run:');
            console.log(`cd "${THEME_DEBUG_ROOT}"`);
            console.log(`${cmd.command}`);
            
            if (cmdKey === '6') {
                console.log('\n🌐 Then open: http://localhost:3000/spotlight');
                console.log('🎯 This provides a web interface for comprehensive theme debugging');
            } else if (cmdKey === '7') {
                console.log('\n🌐 Then open: http://localhost:3000/demo');
                console.log('🎯 This runs in demo mode without Shopify connection');
            }
            
            return;
        }
        
        // Execute the command
        execSync(cmd.command, { 
            stdio: 'inherit',
            env: { 
                ...process.env,
                SPOTLIGHT_THEME_PATH: SPOTLIGHT_MOD_ROOT
            }
        });
        
        console.log(`\n✅ ${cmd.name} completed!`);
        
    } catch (error) {
        console.log(`❌ Error running ${cmd.name}:`, error.message);
        
        // Provide helpful debugging info
        console.log('\n🔍 Debugging Info:');
        console.log(`- Theme Debug Path: ${THEME_DEBUG_ROOT}`);
        console.log(`- Command: ${cmd.command}`);
        console.log(`- Current Directory: ${process.cwd()}`);
        
        // Check if npm install is needed
        if (error.message.includes('Cannot find module')) {
            console.log('\n💡 Try running: npm install');
            console.log(`   In directory: ${THEME_DEBUG_ROOT}`);
        }
    }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    displayMenu();
} else {
    const cmdKey = args[0].toLowerCase();
    runCommand(cmdKey);
}

// Provide quick setup instructions
console.log('\n📋 QUICK SETUP GUIDE:');
console.log('If this is your first time using the Theme Debug system:');
console.log('1. cd "' + THEME_DEBUG_ROOT + '"');
console.log('2. npm install');
console.log('3. cd "' + __dirname + '"');
console.log('4. node integrate-theme-debug.js 2');

module.exports = {
    commands,
    runCommand,
    displayMenu,
    THEME_DEBUG_ROOT,
    SPOTLIGHT_MOD_ROOT
}; 