import { useState, useEffect } from 'react';
import { Download, Presentation, Target, Zap, Package, AlertCircle, Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { CONFIG } from './config';
import { t } from './i18n';
import jsPDF from 'jspdf';

function App() {
    const [language, setLanguage] = useState(CONFIG.DEFAULT_LANGUAGE);
    const [isLoading, setIsLoading] = useState(false);
    const [pitchData, setPitchData] = useState(null);
    const [error, setError] = useState(null);
    const [showPresentation, setShowPresentation] = useState(false);
    const [presentationSlide, setPresentationSlide] = useState(0);
    
    const [formData, setFormData] = useState({
        website: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        description: ''
    });
    
    useEffect(() => {
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            setLanguage(savedLang);
            updateDirection(savedLang);
        }
    }, []);
    
    const updateDirection = (lang) => {
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
    };
    
    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        updateDirection(newLang);
    };
    
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };
    
    const clearForm = () => {
        setFormData({ website: '', facebook: '', instagram: '', linkedin: '', description: '' });
        setPitchData(null);
        setError(null);
    };
    
    const validateForm = () => {
        const hasInput = Object.values(formData).some(value => value.trim() !== '');
        if (!hasInput) {
            setError(t('validationError', language));
            return false;
        }
        return true;
    };
    
    const generatePitch = async () => {
        if (!validateForm()) return;
        
        setIsLoading(true);
        setError(null);
        setPitchData(null);
        
        try {
            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'pitch', companyData: formData })
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            
            setPitchData(data);
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            <Header language={language} toggleLanguage={toggleLanguage} />
            
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <InputForm
                    formData={formData}
                    language={language}
                    isLoading={isLoading}
                    error={error}
                    onInputChange={handleInputChange}
                    onGenerate={generatePitch}
                    onClear={clearForm}
                />
                
                {isLoading && <LoadingSpinner language={language} />}
                
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
            
            {CONFIG.ENABLE_FEATURE_SUGGESTIONS && <FeatureSuggestion language={language} />}
            <Footer language={language} />
        </div>
    );
}

function Header({ language, toggleLanguage }) {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-6 flex-wrap">
                        <img src={CONFIG.LOGO_EAND} alt="e& Logo" className="h-12 w-auto object-contain" />
                        <div className="h-8 w-px bg-gray-300"></div>
                        <img src={CONFIG.LOGO_ZOHO} alt="Zoho Logo" className="h-10 w-auto object-contain" />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-zohoDark flex-1 text-center md:text-left">
                        {t('appTitle', language)}
                    </h1>
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

function InputForm({ formData, language, isLoading, error, onInputChange, onGenerate, onClear }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-zohoDark mb-6">{t('inputSectionTitle', language)}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('websiteLabel', language)}</label>
                    <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => onInputChange('website', e.target.value)}
                        placeholder={t('websitePlaceholder', language)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('facebookLabel', language)}</label>
                    <input
                        type="text"
                        value={formData.facebook}
                        onChange={(e) => onInputChange('facebook', e.target.value)}
                        placeholder={t('facebookPlaceholder', language)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('instagramLabel', language)}</label>
                    <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => onInputChange('instagram', e.target.value)}
                        placeholder={t('instagramPlaceholder', language)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('linkedinLabel', language)}</label>
                    <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) => onInputChange('linkedin', e.target.value)}
                        placeholder={t('linkedinPlaceholder', language)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('descriptionLabel', language)}</label>
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
            
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
            )}
            
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

function LoadingSpinner({ language }) {
    return (
        <div className="mt-12 bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="spinner mx-auto mb-6"></div>
            <p className="text-xl font-semibold text-gray-700 mb-2">{t('loadingMessage', language)}</p>
            <p className="text-gray-500">{t('loadingSubtext', language)}</p>
        </div>
    );
}

function ResultsDisplay({ data, language, onPresentationMode }) {
    const generatePDF = (data, language) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('ZOHO Pitch', 20, 20);
        doc.setFontSize(12);
        doc.text(`Industry: ${data.industry || 'N/A'}`, 20, 40);
        doc.save('zoho-pitch.pdf');
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <h2 className="text-2xl font-bold text-zohoDark">{t('resultsGenerated', language)}</h2>
                    <div className="flex gap-3 flex-wrap">
                        {CONFIG.ENABLE_PRESENTATION_MODE && (
                            <button
                                onClick={onPresentationMode}
                                className="px-6 py-2 bg-zohoGold text-zohoDark rounded-lg hover:bg-yellow-400 font-medium transition-all flex items-center gap-2"
                            >
                                <Presentation className="w-4 h-4" />
                                {t('presentationModeButton', language)}
                            </button>
                        )}
                        <button
                            onClick={() => generatePDF(data, language)}
                            className="px-6 py-2 bg-zohoRed text-white rounded-lg hover:bg-red-700 font-medium transition-all flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            {t('downloadPDF', language)}
                        </button>
                    </div>
                </div>
            </div>

            <PartA data={data} language={language} />
            <PartB data={data} language={language} />
            <PartC data={data} language={language} />
            <PartD data={data} language={language} />
        </div>
    );
}

function PartA({ data, language }) {
    const confidenceColor = {
        high: 'text-green-600',
        medium: 'text-yellow-600',
        low: 'text-red-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-zohoDark mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-zohoRed" />
                {t('partATitle', language)}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">{t('detectedIndustry', language)}</h4>
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
                
                {data.researchSummary && (
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-2">{t('researchSummaryTitle', language)}</h4>
                        <p className="text-gray-700">{data.researchSummary}</p>
                    </div>
                )}
            </div>
            
            {data.painPoints && data.painPoints.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">{t('painPointsTitle', language)}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {data.painPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function PartB({ data, language }) {
    if (!data.automations || data.automations.length === 0) return null;
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-zohoDark mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-zohoGold" />
                {t('partBTitle', language)}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.automations.map((automation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-lg text-zohoDark mb-3">{automation.title}</h4>
                        
                        {automation.productivityGain && (
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">{t('productivityGain', language)}:</span>
                                <span className="text-sm text-gray-600">{automation.productivityGain}</span>
                            </div>
                        )}
                        
                        {automation.costSavings && (
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">{t('costSavings', language)}:</span>
                                <span className="text-sm text-gray-600">{automation.costSavings}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function PartC({ data, language }) {
    const [expandedSolution, setExpandedSolution] = useState(null);
    
    if (!data.solutions || data.solutions.length === 0) return null;
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-zohoDark mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" />
                {t('partCTitle', language)}
            </h3>
            
            <div className="space-y-4">
                {data.solutions.map((solution, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-zohoDark mb-2">{solution.title}</h4>
                                <p className="text-gray-600 mb-3">{solution.summary}</p>
                            </div>
                            
                            <button
                                onClick={() => setExpandedSolution(expandedSolution === index ? null : index)}
                                className="px-4 py-2 bg-zohoRed text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-all flex items-center gap-2"
                            >
                                {expandedSolution === index ? t('collapseDetails', language) : t('expandDetails', language)}
                                {expandedSolution === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                        
                        {expandedSolution === index && solution.expandedDetail && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="prose prose-sm max-w-none">
                                    {solution.expandedDetail.split('\n').map((paragraph, i) => (
                                        <p key={i} className="mb-3 text-gray-700">{paragraph}</p>
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

function PartD({ data, language }) {
    if (!data.proposalBenefits || data.proposalBenefits.length === 0) return null;
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-zohoDark mb-6">{t('partDTitle', language)}</h3>
            <ul className="space-y-3 mb-6">
                {data.proposalBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="text-zohoRed font-bold">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                    </li>
                ))}
            </ul>
            <p className="text-sm text-gray-600 italic">{t('proposalClosing', language)}</p>
        </div>
    );
}

function FeatureSuggestion({ language }) {
    const [suggestion, setSuggestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleSubmit = async () => {
        if (!suggestion.trim()) return;
        
        setIsSubmitting(true);
        try {
            await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'suggestion', suggestion })
            });
            setSubmitStatus('success');
            setSuggestion('');
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus(null), 3000);
        }
    };

    return (
        <div className="bg-white border-t border-gray-200 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h3 className="text-xl font-bold text-zohoDark mb-4">{t('featureSuggestionTitle', language)}</h3>
                <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder={t('featurePlaceholder', language)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zohoRed focus:border-transparent"
                    disabled={isSubmitting}
                />
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">{t('privacyNote', language)}</p>
                    <button
                        onClick={handleSubmit}
                        disabled={!suggestion.trim() || isSubmitting}
                        className="px-6 py-2 bg-zohoRed text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
                    >
                        {t('submitIdea', language)}
                    </button>
                </div>
                {submitStatus === 'success' && (
                    <p className="mt-2 text-green-600">{t('featureSuccess', language)}</p>
                )}
                {submitStatus === 'error' && (
                    <p className="mt-2 text-red-600">{t('featureError', language)}</p>
                )}
            </div>
        </div>
    );
}

function Footer({ language }) {
    return (
        <footer className="bg-zohoDark text-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm">© 2025 ZOHO Sales Expert & Pitch Generator</p>
            </div>
        </footer>
    );
}

export default App;
