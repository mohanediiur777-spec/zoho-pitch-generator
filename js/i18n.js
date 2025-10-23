// Internationalization (i18n) - English & Arabic Translations

const translations = {
    en: {
        // Header
        appTitle: "ZOHO Sales Expert & Pitch Generator",
        languageToggle: "العربية",
        
        // Input Form
        inputSectionTitle: "Company Research",
        websiteLabel: "Company Website URL",
        websitePlaceholder: "https://example.com",
        facebookLabel: "Facebook Profile/Page",
        facebookPlaceholder: "CompanyName or profile URL",
        instagramLabel: "Instagram Profile",
        instagramPlaceholder: "@companyname",
        linkedinLabel: "LinkedIn Company/Profile",
        linkedinPlaceholder: "Company name or profile URL",
        descriptionLabel: "Manual Company Description (optional)",
        descriptionPlaceholder: "Provide company details if URLs are not available...",
        generateButton: "Generate Pitch",
        clearButton: "Clear All",
        validationError: "Please provide at least one input (URL or description)",
        
        // Loading
        loadingMessage: "Analyzing company data and generating customized pitch...",
        loadingSubtext: "This may take 10-15 seconds",
        
        // Output Sections
        partATitle: "Industry Confirmation & Pain Points",
        partBTitle: "Automation Opportunities",
        partCTitle: "Customized Zoho Solutions",
        partDTitle: "Quick Proposal",
        
        // Part A
        detectedIndustry: "Detected Industry",
        confidenceHigh: "High Confidence",
        confidenceMedium: "Medium Confidence",
        confidenceLow: "Low Confidence",
        painPointsTitle: "Key Pain Points",
        
        // Part B
        productivityGain: "Productivity Gain",
        costSavings: "Cost Savings",
        
        // Part C
        expandDetails: "Expand Details",
        collapseDetails: "Collapse",
        zohoApps: "Zoho Apps Involved",
        implementation: "Implementation Steps",
        
        // Part D
        proposalClosing: "This is a quick generic system creation based on general search. More specific and detailed solutions can be discussed with our expertise.",
        downloadPDF: "Download PDF",
        shareEmail: "Share via Email",
        shareWhatsApp: "Share on WhatsApp",
        copyToClipboard: "Copy to Clipboard",
        copied: "Copied!",
        
        // Additional Features
        salesTipTitle: "Sales Tip & Opening Angle",
        deepDiveTitle: "Deep Dive Battle Cards",
        researchSummaryTitle: "Company Research Summary",
        presentationModeButton: "Presentation Mode",
        
        // Presentation Mode
        presentationSlide1: "Company Overview",
        presentationSlide2: "Challenges & Pain Points",
        presentationSlide3: "Zoho Solutions",
        presentationSlide4: "The Power of Zoho One",
        closePresentationpresentation: "Close Presentation",
        nextSlide: "Next",
        previousSlide: "Previous",
        
        // Feature Suggestion
        featureSuggestionTitle: "💡 Suggest a Feature",
        featurePlaceholder: "Have an idea to make this app better? Share your enhancement suggestions here...",
        submitIdea: "Submit Idea",
        featureSuccess: "✅ Thank you! Your idea has been submitted for review.",
        featureError: "Failed to submit suggestion. Please try again.",
        privacyNote: "Your suggestions help us improve. No personal data is collected.",
        
        // Error Messages
        errorTitle: "Oops! Something went wrong",
        errorRetry: "Retry",
        errorFallback: "Failed to generate pitch. Please check your inputs and try again.",
        networkError: "Network error. Please check your connection and try again.",
        
        // Deep Dive
        benefit: "Benefit",
        feature: "Feature",
        howToBuild: "How to Build This",
        
        // General
        close: "Close",
        save: "Save",
        cancel: "Cancel",
        loading: "Loading...",
        noData: "No data available"
    },
    
    ar: {
        // Header
        appTitle: "خبير مبيعات ZOHO ومولد العروض",
        languageToggle: "English",
        
        // Input Form
        inputSectionTitle: "بحث الشركة",
        websiteLabel: "رابط موقع الشركة",
        websitePlaceholder: "https://example.com",
        facebookLabel: "صفحة/حساب فيسبوك",
        facebookPlaceholder: "اسم الشركة أو رابط الصفحة",
        instagramLabel: "حساب إنستغرام",
        instagramPlaceholder: "@اسم_الشركة",
        linkedinLabel: "حساب/صفحة لينكد إن",
        linkedinPlaceholder: "اسم الشركة أو رابط الحساب",
        descriptionLabel: "وصف يدوي للشركة (اختياري)",
        descriptionPlaceholder: "قدم تفاصيل الشركة إذا لم تكن الروابط متاحة...",
        generateButton: "إنشاء العرض",
        clearButton: "مسح الكل",
        validationError: "يرجى تقديم مدخل واحد على الأقل (رابط أو وصف)",
        
        // Loading
        loadingMessage: "جاري تحليل بيانات الشركة وإنشاء عرض مخصص...",
        loadingSubtext: "قد يستغرق هذا 10-15 ثانية",
        
        // Output Sections
        partATitle: "تأكيد الصناعة ونقاط الألم",
        partBTitle: "فرص الأتمتة",
        partCTitle: "حلول Zoho المخصصة",
        partDTitle: "عرض سريع",
        
        // Part A
        detectedIndustry: "الصناعة المكتشفة",
        confidenceHigh: "ثقة عالية",
        confidenceMedium: "ثقة متوسطة",
        confidenceLow: "ثقة منخفضة",
        painPointsTitle: "نقاط الألم الرئيسية",
        
        // Part B
        productivityGain: "زيادة الإنتاجية",
        costSavings: "توفير التكاليف",
        
        // Part C
        expandDetails: "توسيع التفاصيل",
        collapseDetails: "طي",
        zohoApps: "تطبيقات Zoho المستخدمة",
        implementation: "خطوات التنفيذ",
        
        // Part D
        proposalClosing: "هذا إنشاء نظام عام سريع بناءً على البحث العام. يمكن مناقشة حلول أكثر تحديدًا وتفصيلاً مع خبرائنا.",
        downloadPDF: "تحميل PDF",
        shareEmail: "مشاركة عبر البريد الإلكتروني",
        shareWhatsApp: "مشاركة على واتساب",
        copyToClipboard: "نسخ إلى الحافظة",
        copied: "تم النسخ!",
        
        // Additional Features
        salesTipTitle: "نصيحة مبيعات وزاوية افتتاحية",
        deepDiveTitle: "بطاقات معركة التعمق",
        researchSummaryTitle: "ملخص بحث الشركة",
        presentationModeButton: "وضع العرض التقديمي",
        
        // Presentation Mode
        presentationSlide1: "نظرة عامة على الشركة",
        presentationSlide2: "التحديات ونقاط الألم",
        presentationSlide3: "حلول Zoho",
        presentationSlide4: "قوة Zoho One",
        closePresentation: "إغلاق العرض التقديمي",
        nextSlide: "التالي",
        previousSlide: "السابق",
        
        // Feature Suggestion
        featureSuggestionTitle: "💡 اقترح ميزة",
        featurePlaceholder: "هل لديك فكرة لجعل هذا التطبيق أفضل؟ شارك مقترحات التحسين هنا...",
        submitIdea: "إرسال الفكرة",
        featureSuccess: "✅ شكراً لك! تم إرسال فكرتك للمراجعة.",
        featureError: "فشل إرسال الاقتراح. يرجى المحاولة مرة أخرى.",
        privacyNote: "اقتراحاتك تساعدنا على التحسين. لا يتم جمع أي بيانات شخصية.",
        
        // Error Messages
        errorTitle: "عذراً! حدث خطأ ما",
        errorRetry: "إعادة المحاولة",
        errorFallback: "فشل إنشاء العرض. يرجى التحقق من المدخلات والمحاولة مرة أخرى.",
        networkError: "خطأ في الشبكة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.",
        
        // Deep Dive
        benefit: "الفائدة",
        feature: "الميزة",
        howToBuild: "كيفية البناء",
        
        // General
        close: "إغلاق",
        save: "حفظ",
        cancel: "إلغاء",
        loading: "جاري التحميل...",
        noData: "لا توجد بيانات متاحة"
    }
};

// Get translation function
function t(key, lang = 'en') {
    return translations[lang]?.[key] || translations['en'][key] || key;
}
