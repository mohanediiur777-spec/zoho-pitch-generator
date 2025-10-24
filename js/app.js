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
// Results Display Component (Continuing from where you left off)
function ResultsDisplay({ data, language, onPresentationMode }) {
    useEffect(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, [data]);

    return (
        <div className="space-y-8">
            {/* Action Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <h2 className="text-2xl font-bold text-zohoDark">
                        {t('resultsGenerated', language)}
                    </h2>
                    <div className="flex gap-3 flex-wrap">
                        {CONFIG.ENABLE_PRESENTATION_MODE && (
                            <button
                                onClick={onPresentationMode}
                                className="px-6 py-2 bg-zohoGold text-zohoDark rounded-lg hover:bg-yellow-400 font-medium transition-all flex items-center gap-2"
                            >
                                <i data-lucide="presentation" className="w-4 h-4"></i>
                                {t('presentationModeButton', language)}
                            </button>
                        )}
                        <button
                            onClick={() => generatePDF(data, language)}
                            className="px-6 py-2 bg-zohoRed text-white rounded-lg hover:bg-red-700 font-medium transition-all flex items-center gap-2"
                        >
                            <i data-lucide="download" className="w-4 h-4"></i>
                            {t('downloadPDF', language)}
                        </button>
                    </div>
                </div>
            </div>

            {/* Part A: Industry & Pain Points */}
            <PartA data={data} language={language} />
            
            {/* Part B: Automation Opportunities */}
            <PartB data={data} language={language} />
            
            {/* Part C: Customized Solutions */}
            <PartC data={data} language={language} />
            
            {/* Part D: Quick Proposal */}
            <PartD data={data} language={language} />
            
            {/* Additional Features */}
            <AdditionalFeatures data={data} language={language} />
        </div>
    );
}

// Part A: Industry Confirmation & Pain Points
function PartA({ data, language }) {
    const confidenceColor = {
        high: 'text-green-600',
        medium: 'text-yellow-600',
        low: 'text-red-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-zohoDark mb-6 flex items-center gap-3">
                <i data-lucide="target" className="w-6 h-6 text-zohoRed"></i>
                {t('partATitle', language)}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Industry Detection */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                        {t('detectedIndustry', language)}
                    </h4>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-zohoDark">
                            {data.industry || t('noData', language)}
                        </span>
                        {data.industryConfidence && (
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${confidenceColor[data.industryConfidence] || 'text-gray-600'} bg-gray-100`}>
                                {t(`confidence${data.industryConfidence.charAt(0).toUpperCase() + data.industryConfidence.slice(1)}`, language)}
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Research Summary */}
                {data.researchSummary && (
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-2">
                            {t('researchSummaryTitle', language)}
                        </h4>
                        <p className="text-gray-700">
                            {data.researchSummary}
                        </p>
                    </div>
                )}
            </div>
            
            {/* Pain Points */}
            {data.painPoints && data.painPoints.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">
                        {t('painPointsTitle', language)}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {data.painPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                <i data-lucide="alert-circle" className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"></i>
                                <span className="text-gray-700">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Part B: Automation Opportunities
function PartB({ data, language }) {
    if (!data.automations || data.automations.length === 0) return null;
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-zohoDark mb-6 flex items-center gap-3">
                <i data-lucide="zap" className="w-6 h-6 text-zohoGold"></i>
                {t('partBTitle', language)}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.automations.map((automation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-lg text-zohoDark mb-3">
                            {automation.title}
                        </h4>
                        
                        {automation.productivityGain && (
                            <div className="flex items-center gap-3 mb-2">
                                <i data-lucide="clock" className="w-4 h-4 text-green-600"></i>
                                <span className="text-sm font-medium text-gray-700">
                                    {t('productivityGain', language)}:
                                </span>
                                <span className="text-sm text-gray-600">
                                    {automation.productivityGain}
                                </span>
                            </div>
                        )}
                        
                        {automation.costSavings && (
                            <div className="flex items-center gap-3">
                                <i data-lucide="dollar-sign" className="w-4 h-4 text-green-600"></i>
                                <span className="text-sm font-medium text-gray-700">
                                    {t('costSavings', language)}:
                                </span>
                                <span className="text-sm text-gray-600">
                                    {automation.costSavings}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Part C: Customized Solutions
function PartC({ data, language }) {
    const [expandedSolution, setExpandedSolution] = useState(null);
    
    if (!data.solutions || data.solutions.length === 0) return null;
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-zohoDark mb-6 flex items-center gap-3">
                <i data-lucide="package" className="w-6 h-6 text-blue-600"></i>
                {t('partCTitle', language)}
            </h3>
            
            <div className="space-y-4">
                {data.solutions.map((solution, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-zohoDark mb-2">
                                    {solution.title}
                                </h4>
                                <p className="text-gray-600 mb-3">
                                    {solution.summary}
                                </p>
                            </div>
                            
                            <button
                                onClick={() => setExpandedSolution(expandedSolution === index ? null : index)}
                                className="px-4 py-2 bg-zohoRed text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-all flex items-center gap-2"
                            >
                                {expandedSolution === index ? t('collapseDetails', language) : t('expandDetails', language)}
                                <i 
                                    data-lucide={expandedSolution === index ? "chevron-up" : "chevron-down"} 
                                    className="w-4 h-4"
                                ></i>
                            </button>
                        </div>
                        
                        {expandedSolution === index && solution.expandedDetail && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="prose prose-sm max-w-none">
                                    {solution.expandedDetail.split('\n').map((paragraph, i) => (
                                        <p key={i} className="mb-3 text-gray-700">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Part D: Quick Proposal
function PartD({ data, language }) {
    const [copied, setCopied] = useState(false);
    
    const shareText = data.proposalBenefits 
        ? `${data.proposalBenefits.join('\n• ')}\n\n${t('proposalClosing', language)}`
        : t('proposalClosing', language);
    
    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    
    const handleShareWhatsApp = () => {
        const text = encodeURIComponent(shareText);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };
    
    const handleShareEmail = () => {
        const subject = encodeURIComponent('Zoho CRM Proposal');
        const body = encodeURIComponent(shareText);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-zohoDark mb-6 flex items-center gap-3">
                <i data-lucide="file-text" className="w-6 h-6 text-green-600"></i>
                {t('partDTitle', language)}
            </h3>
            
            {/* Benefits List */}
            {data.proposalBenefits && data.proposalBenefits.length > 0 && (
                <div className="mb-6">
                    <ul className="space-y-3">
                        {data.proposalBenefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <i data-lucide="check-circle" className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"></i>
                                <span className="text-gray-700">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Closing Statement */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700 italic">
                    {t('proposalClosing', language)}
                </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleCopyToClipboard}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all flex items-center gap-2"
                >
                    <i data-lucide={copied ? "check" : "copy"} className="w-4 h-4"></i>
                    {copied ? t('copied', language) : t('copyToClipboard', language)}
                </button>
                
                <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all flex items-center gap-2"
                >
                    <i data-lucide="message-circle" className="w-4 h-4"></i>
                    {t('shareWhatsApp', language)}
                </button>
                
                <button
                    onClick={handleShareEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all flex items-center gap-2"
                >
                    <i data-lucide="mail" className="w-4 h-4"></i>
                    {t('shareEmail', language)}
                </button>
            </div>
        </div>
    );
}

// Additional Features Component
function AdditionalFeatures({ data, language }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Tip */}
            {data.salesTip && (
                <div className="bg-gradient-to-r from-zohoGold to-yellow-400 rounded-xl shadow-lg p-6">
                    <h4 className="font-bold text-lg text-zohoDark mb-3 flex items-center gap-2">
                        <i data-lucide="lightbulb" className="w-5 h-5"></i>
                        {t('salesTipTitle', language)}
                    </h4>
                    <p className="text-zohoDark font-medium">
                        {data.salesTip}
                    </p>
                </div>
            )}
            
            {/* Deep Dive Examples */}
            {data.deepDiveExamples && data.deepDiveExamples.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="font-bold text-lg text-zohoDark mb-4 flex items-center gap-2">
                        <i data-lucide="layers" className="w-5 h-5 text-zohoRed"></i>
                        {t('deepDiveTitle', language)}
                    </h4>
                    <div className="space-y-4">
                        {data.deepDiveExamples.slice(0, 2).map((example, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-zohoRed text-white text-xs font-bold px-2 py-1 rounded">
                                        {example.zohoApp}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {example.feature}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>{t('benefit', language)}:</strong> {example.benefit}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>{t('howToBuild', language)}:</strong> {example.implementation}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Feature Suggestion Component
function FeatureSuggestion({ language }) {
    const [suggestion, setSuggestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    
    const handleSubmit = async () => {
        if (!suggestion.trim()) return;
        
        setIsSubmitting(true);
        setMessage('');
        
        try {
            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'suggestion',
                    suggestion: suggestion.trim(),
                    userAgent: navigator.userAgent
                })
            });
            
            if (response.ok) {
                setSuggestion('');
                setMessage(t('featureSuccess', language));
                setTimeout(() => setMessage(''), 5000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            setMessage(t('featureError', language));
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-zohoDark mb-4">
                {t('featureSuggestionTitle', language)}
            </h3>
            
            <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={t('featurePlaceholder', language)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent resize-none mb-3"
                maxLength="500"
            />
            
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-sm text-gray-500">
                    {t('privacyNote', language)}
                </div>
                
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        {suggestion.length}/500
                    </span>
                    <button
                        onClick={handleSubmit}
                        disabled={!suggestion.trim() || isSubmitting}
                        className="px-6 py-2 bg-zohoRed text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                    >
                        {isSubmitting ? t('loading', language) : t('submitIdea', language)}
                    </button>
                </div>
            </div>
            
            {message && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                    message.includes('✅') 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
}

// Footer Component
function Footer({ language }) {
    return (
        <footer className="mt-16 bg-zohoDark text-white py-8">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-6 mb-4 flex-wrap">
                    <img 
                        src={CONFIG.LOGO_EAND} 
                        alt="e& Logo" 
                        className="h-8 w-auto object-contain opacity-80"
                    />
                    <img 
                        src={CONFIG.LOGO_ZOHO} 
                        alt="Zoho Logo" 
                        className="h-6 w-auto object-contain opacity-80"
                    />
                </div>
                <p className="text-gray-400 text-sm">
                    {t('appTitle', language)} - {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}

// Presentation Mode Component
function PresentationMode({ data, language, currentSlide, onSlideChange, onClose }) {
    useEffect(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, [data, currentSlide]);

    const slides = [
        {
            title: t('presentationSlide1', language),
            content: (
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-zohoDark mb-6">
                        {data.industry || t('noData', language)}
                    </h2>
                    {data.researchSummary && (
                        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                            {data.researchSummary}
                        </p>
                    )}
                </div>
            )
        },
        {
            title: t('presentationSlide2', language),
            content: (
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-zohoDark mb-6">
                        {t('painPointsTitle', language)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.painPoints && data.painPoints.map((point, index) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 font-medium">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: t('presentationSlide3', language),
            content: (
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-zohoDark mb-6">
                        {t('partCTitle', language)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.solutions && data.solutions.slice(0, 4).map((solution, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <h4 className="font-bold text-lg text-zohoDark mb-2">
                                    {solution.title}
                                </h4>
                                <p className="text-gray-600">{solution.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: t('presentationSlide4', language),
            content: (
                <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-3xl font-bold text-zohoDark mb-6">
                        {t('presentationSlide4', language)}
                    </h3>
                    <p className="text-xl text-gray-700 mb-6">
                        Complete business operating system in one platform
                    </p>
                    <div className="bg-gradient-to-r from-zohoRed to-red-600 text-white rounded-lg p-6">
                        <p className="text-lg font-semibold">
                            45+ Integrated Applications • One Unified Platform
                        </p>
                    </div>
                </div>
            )
        }
    ];
    
    return (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <img src={CONFIG.LOGO_EAND} alt="e&" className="h-8 w-auto" />
                        <img src={CONFIG.LOGO_ZOHO} alt="Zoho" className="h-6 w-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-zohoDark">
                        {slides[currentSlide].title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <i data-lucide="x" className="w-6 h-6"></i>
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                    {slides[currentSlide].content}
                </div>
                
                {/* Navigation */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                    <button
                        onClick={() => onSlideChange(Math.max(0, currentSlide - 1))}
                        disabled={currentSlide === 0}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center gap-2"
                    >
                        <i data-lucide="chevron-left" className="w-4 h-4"></i>
                        {t('previousSlide', language)}
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => onSlideChange(index)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    index === currentSlide ? 'bg-zohoRed' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    
                    <button
                        onClick={() => onSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
                        disabled={currentSlide === slides.length - 1}
                        className="px-6 py-2 bg-zohoRed text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center gap-2"
                    >
                        {t('nextSlide', language)}
                        <i data-lucide="chevron-right" className="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

// PDF Generation Function
function generatePDF(data, language) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add logos
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('ZOHO CRM Proposal', 20, 30);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        
        let yPosition = 50;
        
        // Industry
        if (data.industry) {
            doc.setFont(undefined, 'bold');
            doc.text('Industry:', 20, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(data.industry, 60, yPosition);
            yPosition += 10;
        }
        
        // Pain Points
        if (data.painPoints && data.painPoints.length > 0) {
            yPosition += 10;
            doc.setFont(undefined, 'bold');
            doc.text('Key Challenges:', 20, yPosition);
            yPosition += 7;
            doc.setFont(undefined, 'normal');
            data.painPoints.forEach(point => {
                doc.text('• ' + point, 25, yPosition);
                yPosition += 7;
            });
        }
        
        // Solutions
        if (data.solutions && data.solutions.length > 0) {
            yPosition += 10;
            doc.setFont(undefined, 'bold');
            doc.text('Recommended Solutions:', 20, yPosition);
            yPosition += 7;
            doc.setFont(undefined, 'normal');
            data.solutions.forEach(solution => {
                doc.text('• ' + solution.title + ': ' + solution.summary, 25, yPosition);
                yPosition += 7;
            });
        }
        
        // Benefits
        if (data.proposalBenefits && data.proposalBenefits.length > 0) {
            yPosition += 10;
            doc.setFont(undefined, 'bold');
            doc.text('Key Benefits:', 20, yPosition);
            yPosition += 7;
            doc.setFont(undefined, 'normal');
            data.proposalBenefits.forEach(benefit => {
                doc.text('• ' + benefit, 25, yPosition);
                yPosition += 7;
            });
        }
        
        // Closing
        yPosition += 10;
        doc.setFont(undefined, 'italic');
        doc.text(t('proposalClosing', language), 20, yPosition, { maxWidth: 170 });
        
        // Save the PDF
        doc.save('zoho-crm-proposal.pdf');
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('PDF generation failed. Please try again.');
    }
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
