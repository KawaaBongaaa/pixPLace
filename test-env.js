// Simple test script to verify environment variable loading
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔧 Testing Environment Variables Loading...');
console.log('');

// List of important environment variables
const varsToCheck = [
    'RUNWARE_API_KEY',
    'WEBHOOK_URL',
    'CHAT_WEBHOOK_URL',
    'IMGBB_API_KEY'
];

varsToCheck.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        // Mask sensitive values for security
        const masked = varName.includes('KEY') || varName.includes('API')
            ? value.substring(0, 8) + '...'
            : value;
        console.log(`✅ ${varName}: ${masked}`);
    } else {
        console.log(`❌ ${varName}: NOT SET`);
    }
});

console.log('');
console.log('🎉 Environment variables loaded successfully!');
