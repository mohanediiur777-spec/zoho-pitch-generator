// Configuration File
// IMPORTANT: Update APPS_SCRIPT_URL with your deployed Apps Script URL

const CONFIG = {
    // ⚠️ REPLACE THIS with your actual Apps Script deployment URL
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyt1FBbG7i5r6-MWFCUh_TKHK8PEIB6RYii6f1NHLnw4oXQzJZSaCnmmhDPPm6tZLSn/exec",
    
    // Logo URLs (already configured)
    LOGO_EAND: "https://ik.imagekit.io/xtj3m9hth/image-remove1bg-preview%20(3).png?updatedAt=1761220721716",
    LOGO_ZOHO: "https://ik.imagekit.io/xtj3m9hth/image-removebg-preview%20(3).png?updatedAt=1761220721361",
    
    // API Settings
    TIMEOUT: 60000, // 60 seconds timeout for API calls
    RETRY_ATTEMPTS: 2,
    
    // Feature flags
    ENABLE_PRESENTATION_MODE: true,
    ENABLE_FEATURE_SUGGESTIONS: true,
    
    // Default language
    DEFAULT_LANGUAGE: 'en'
};

// Freeze config to prevent accidental modifications
Object.freeze(CONFIG);
