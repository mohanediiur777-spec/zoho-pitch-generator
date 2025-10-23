const { useState, useEffect, useRef } = React;

// Main App Component
function App() {
    // State Management
    const [language, setLanguage] = useState(CONFIG.DEFAULT_LANGUAGE);
    const [isLoading, setIsLoading] = useState(false);
    const [pitchData, setPitchData] = useState(null);
    const [error, setError] = useState(null);
    const [showPresentation, setShowPresentation] = useState(false);
    const [presentationSlide, setPresentationSlide] = useState(0);
    
    // Form State
    const [formData, setFormData] = useState({
        website: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        description: ''
    });
    
    // Load language preference
    useEffect(() => {
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            setLanguage(savedLang);
            updateDirection(savedLang);
        }
    }, []);
    
    // Update HTML direction for RTL
    const updateDirection = (lang) => {
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
    };
    
    // Toggle Language
    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        updateDirection(newLang);
    };
    
    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(null);
    };
    
    // Clear all inputs
    const clearForm = () => {
        setFormData({
            website: '',
            facebook: '',
            instagram: '',
            linkedin: '',
            description: ''
        });
        setPitchData(null);
        setError(null);
    };
    
    // Validate form
    const validateForm = () => {
        const hasInput = Object.values(formData).some(value => value.trim() !== '');
        if (!hasInput) {
            setError(t('validationError', language));
            return false;
        }
        return true;
    };
    
    // Generate Pitch - API Call
    const generatePitch = async () => {
        if (!validateForm()) return;
        
        setIsLoading(true);
        setError(null);
        setPitchData(null);
        
        try {
            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'pitch',
                    companyData: formData
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            setPitchData(data);
            
            // Scroll to results
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
            
        } catch (err) {
            console.error('Error generating pitch:', err);
            setError(err.message || t('errorFallback', language));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-zohoGray">
            {/* Header */}
            <Header 
                language={language}
                toggleLanguage={toggleLanguage}
            />
            
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Input Form */}
                <InputForm
                    formData={formData}
                    language={language}
                    isLoading={isLoading}
                    error={error}
                    onInputChange={handleInputChange}
                    onGenerate={generatePitch}
                    onClear={clearForm}
                />
                
                {/* Loading State */}
                {isLoading && <LoadingSpinner language={language} />}
                
                {/* Results */}
                {pitchData && !isLoading && (
                    <div id="results-section" className="mt-12 slide-in">
                        <ResultsDisplay 
                            data={pitchData}
                            language={language}
                            onPresentationMode={() => setShowPresentation(true)}
                        />
                    </div>
                )}
            </main>
            
            {/* Feature Suggestion Section */}
            {CONFIG.ENABLE_FEATURE_SUGGESTIONS && (
                <FeatureSuggestion language={language} />
            )}
            
            {/* Footer */}
            <Footer language={language} />
            
            {/* Presentation Mode Modal */}
            {showPresentation && pitchData && (
                <PresentationMode
                    data={pitchData}
                    language={language}
                    currentSlide={presentationSlide}
                    onSlideChange={setPresentationSlide}
                    onClose={() => {
                        setShowPresentation(false);
                        setPresentationSlide(0);
                    }}
                />
            )}
        </div>
    );
}

// Header Component
function Header({ language, toggleLanguage }) {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Logos */}
                    <div className="flex items-center gap-6 flex-wrap">
                        <img 
                            src={CONFIG.LOGO_EAND} 
                            alt="e& Logo" 
                            className="h-12 w-auto object-contain"
                        />
                        <div className="h-8 w-px bg-gray-300"></div>
                        <img 
                            src={CONFIG.LOGO_ZOHO} 
                            alt="Zoho Logo" 
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-xl md:text-2xl font-bold text-zohoDark flex-1 text-center md:text-left">
                        {t('appTitle', language)}
                    </h1>
                    
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="px-4 py-2 bg-zohoRed text-white rounded-lg hover:bg-red-700 font-medium transition-all"
                    >
                        {t('languageToggle', language)}
                    </button>
                </div>
            </div>
        </header>
    );
}

// Input Form Component
function InputForm({ formData, language, isLoading, error, onInputChange, onGenerate, onClear }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-zohoDark mb-6">
                {t('inputSectionTitle', language)}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Website URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('websiteLabel', language)}
                    </label>
                    <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => onInputChange('website', e.target.value)}
                        placeholder={t('websitePlaceholder', language)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                {/* Facebook */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('facebookLabel', language)}
                    </label>
                    <input
                        type="text"
                        value={formData.facebook}
                        onChange={(e) => onInputChange('facebook', e.target.value)}
                        placeholder={t('facebookPlaceholder', language)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                {/* Instagram */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('instagramLabel', language)}
                    </label>
                    <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => onInputChange('instagram', e.target.value)}
                        placeholder={t('instagramPlaceholder', language)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                {/* LinkedIn */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('linkedinLabel', language)}
                    </label>
                    <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) => onInputChange('linkedin', e.target.value)}
                        placeholder={t('linkedinPlaceholder', language)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                {/* Description - Full Width */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('descriptionLabel', language)}
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        placeholder={t('descriptionPlaceholder', language)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent resize-none"
                        disabled={isLoading}
                    />
                </div>
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-6 flex gap-4 flex-wrap">
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="flex-1 md:flex-none px-8 py-3 bg-zohoRed text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-all"
                >
                    {t('generateButton', language)}
                </button>
                
                <button
                    onClick={onClear}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                >
                    {t('clearButton', language)}
                </button>
            </div>
        </div>
    );
}

// Loading Spinner Component
function LoadingSpinner({ language }) {
    return (
        <div className="mt-12 bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="spinner mx-auto mb-6"></div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
                {t('loadingMessage', language)}
            </p>
            <p className="text-gray-500">
                {t('loadingSubtext', language)}
            </p>
        </div>
    );
}
