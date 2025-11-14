// pixPLace Development Server with Environment Variables Support
// =============================================================================
// This server serves the static pixPLace app and injects environment variables
// into the HTML for client-side access (secure for development only).

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables to expose to the client (whitelist for security)
const CLIENT_ENV_VARS = [
    'RUNWARE_API_KEY',
    'IMGBB_API_KEY',
    'WEBHOOK_URL',
    'CHAT_WEBHOOK_URL',
    'TELEGRAM_BOT_URL',
    'SHARE_DEFAULT_HASHTAGS',
    'DEFAULT_LANGUAGE',
    'DEFAULT_THEME',
    'MAX_IMAGE_MB',
    'TIMEOUT',
    'DEV_MODE'
];

// Middleware to inject environment variables into HTML responses
app.use((req, res, next) => {
    // Detect if this is an HTML request by path
    const isHtmlRequest = req.path.endsWith('.html') ||
                         req.path === '/' ||
                         req.path === '' ||
                         req.path.endsWith('/') ||
                         !req.path.includes('.'); // No extension = probably HTML

    if (!isHtmlRequest) {
        return next(); // Skip non-HTML requests
    }

    console.log(`🔧 HTML request detected: ${req.path} - will inject env vars`);

    // Store original send method
    const originalSend = res.send;

    // Override send to inject environment variables
    res.send = function(body) {
        const content = typeof body === 'string' ? body : body?.toString() || '';

        if (content && (content.includes('<html') || content.includes('<!DOCTYPE html'))) {
            console.log(`✅ Injecting env vars into HTML content`);

            // Create environment variables script
            const envScript = createEnvScript();

            // Inject the script before closing </head> tag
            const modifiedBody = content.replace(
                '</head>',
                `${envScript}\n    </head>`
            );

            console.log(`🎯 Env vars injected successfully`);

            // Send modified content
            return originalSend.call(this, modifiedBody);
        }

        // Send original content for non-HTML
        return originalSend.call(this, body);
    };

    next();
});

// Serve static files from current directory (MUST COME AFTER our middleware)
app.use(express.static(path.join(__dirname)));

// Function to create environment variables injection script
function createEnvScript() {
    const envVars = {};

    // Collect whitelisted environment variables
    CLIENT_ENV_VARS.forEach(varName => {
        if (process.env[varName] !== undefined) {
            envVars[varName] = process.env[varName];
        }
    });

    // Create script tag with environment variables
    return `
    <!-- Environment Variables Injected by Dev Server -->
    <script>
        // Global environment variables for client-side access
        window.ENV = ${JSON.stringify(envVars, null, 2)};

        // Log loaded environment variables in development
        if (window.ENV.DEV_MODE === 'true') {
            console.log('🌍 Environment variables loaded:', window.ENV);
        }
    </script>`;
}

// Add basic API route for health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Handle root route by serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 pixPLace Development Server Started');
    console.log(`📍 Server running at: http://localhost:${PORT}`);
    console.log(`🔧 Environment variables will be injected into HTML pages`);
    console.log(`🌍 Environment loaded from: ${path.join(__dirname, '.env')}`);

    // Log exposed environment variables (without values for security)
    console.log('📋 Exposed client variables:', CLIENT_ENV_VARS);

    console.log('\n⚠️  IMPORTANT SECURITY NOTICE:');
    console.log('   This dev server exposes environment variables to the client.');
    console.log('   Never deploy this configuration to production!');
    console.log('   For production, ensure all sensitive data is handled server-side.\n');
});
