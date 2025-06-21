import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Translation object with all text content
const translations = {
  sw: {
    // Hero Section
    heroTitle: "Msaada Haraka, Wakati Unapohitaji",
    heroSubtitle: "Unganisha na watoa huduma wenye ujuzi karibu na wewe kwa huduma za nyumbani, msaada wa barabarani, na huduma za kibinafsi. Jukwaa lako la kuaminika la msaada wa haraka.",
    getStarted: "Anza Leo",
    exploreServices: "Angalia Huduma",

    // How It Works Section
    howItWorksTitle: "Jinsi Inavyofanya Kazi",
    findServicesTitle: "Tafuta Huduma",
    findServicesDesc: "Vinjari kupitia makundi mbalimbali na upate huduma unayohitaji. Jukwaa letu linafanya iwe rahisi kupata wataalamu wa kuhakikishwa.",
    bookProviderTitle: "Weka Nafasi",
    bookProviderDesc: "Chagua mtoa huduma wa kuaminika kulingana na ukadiriaji na mapitio. Panga huduma yako wakati unaofaa kwako.",
    getDoneTitle: "Ipate Imefanyika",
    getDoneDesc: "Pumzika wakati huduma yako inakamilishwa na mtaalamu aliyethibitishwa. Kadiria uzoefu wako ili kuwasaidia wengine.",

    // Service Categories
    servicesTitle: "Makundi ya Huduma Zetu",
    servicesSubtitle: "Huduma za kitaalamu zilizoundwa kwa nyumba na familia za Kitanzania",
    homeServicesTitle: "Huduma za Nyumbani",
    homeServicesList: [
      "• Matunzo ya Bustani na Mazingira",
      "• Kufulia Nguo na Dobi",
      "• Kusafisha Zulia na Vifaa",
      "• Kusafisha Nyumba na Kupanga",
      "• Huduma za Kudhibiti Wadudu"
    ],
    bookHomeService: "Weka Huduma ya Nyumbani",

    personalCareTitle: "Huduma za Kibinafsi",
    personalCareList: [
      "• Huduma za Kucha za Kitaalamu",
      "• Kinyozi cha Wanaume",
      "• Kutengeneza Nywele na Matibabu",
      "• Kupumua na Ustawi",
      "• Urembo na Huduma za Ngozi"
    ],
    bookPersonalCare: "Weka Huduma za Kibinafsi",

    roadsideTitle: "Msaada wa Barabarani",
    roadsideList: [
      "• Ukarabati wa Gari wa Dharura",
      "• Kubadilisha na Kuweka Matairi",
      "• Kuanza Betri",
      "• Huduma za Kuburuta Gari",
      "• Uwasilishaji wa Mafuta"
    ],
    getRoadHelp: "Pata Msaada wa Barabara",

    viewAllServices: "Angalia Huduma Zote",

    // Why Choose Us
    whyChooseTitle: "Kwa Nini Utuchague QuickAssist?",
    verifiedTitle: "Watoa Huduma Waliothibitishwa",
    verifiedDesc: "Watoa huduma wote wamepimwa kikamilifu na kuthibitishwa kwa usalama na utulivu wa akili yako.",
    quickResponseTitle: "Mwitikio wa Haraka",
    quickResponseDesc: "Pata muunganisho na watoa huduma wanaopatikana ndani ya dakika, si masaa. Huduma ya haraka na ya kuaminika unapohitaji.",
    communityTrustedTitle: "Kuaminika na Jamii",
    communityTrustedDesc: "Jiunge na maelfu ya wateja walioridhishwa ambao wanaamini QuickAssist kwa mahitaji yao ya huduma.",

    // Testimonials
    testimonialsTitle: "Watumiaji Wetu Wanasema Nini",
    testimonial1: "Nilipata msafishaji wa nyumba mzuri kupitia QuickAssist. Mchakato wa kuweka nafasi ulikuwa rahisi sana, na huduma ilikuwa bora! Napendekeza jukwaa hili.",
    testimonial2: "Nilishikwa na gurudumu dogo na nilitumia QuickAssist kupata fundi wa gari karibu. Alifika ndani ya dakika 20. Msaada mkuu!",
    testimonial3: "Kama mbuzi wa nywele, QuickAssist imenisaidia kupata wateja wapya katika eneo langu. Jukwaa ni rahisi kutumia na limekuwa bora kwa biashara yangu.",

    // CTA Section
    ctaTitle: "Uko Tayari Kuanza?",
    ctaDescription: "Jiunge na QuickAssist leo na uunganishe na watoa huduma wa kuaminika au utoe huduma zako kwa watu wanaohitaji. Safari yako ya huduma bora inaanza hapa.",
    signUpFree: "Jisajili Sasa - Ni Bure",    // Navbar
    services: "Huduma",
    howItWorks: "Jinsi Inavyofanya Kazi",
    whyUs: "Kwa Nini Sisi",
    reviews: "Mapitio",
    login: "Ingia",
    register: "Jisajili",

    // Footer
    footerDescription: "Tukukuunganishe na watoa huduma wa kuaminika karibu na wewe. Pata msaada unaohitaji, wakati unahitaji. Jukwaa lako la kuaminika la huduma za ubora.",
    quickLinks: "Viungo vya Haraka",
    ourServices: "Huduma Zetu",
    about: "Kuhusu",
    contact: "Mawasiliano",
    becomeProvider: "Kuwa Mtoa Huduma",
    faq: "Maswali Yanayoulizwa Sana",
    serviceCategories: "Makundi ya Huduma",
    homeServices: "Huduma za Nyumbani",
    roadsideAssistance: "Msaada wa Barabarani",
    personalCare: "Huduma za Kibinafsi",
    businessServices: "Huduma za Biashara",
    viewAll: "Angalia Zote",
    contactUs: "Wasiliana Nasi",
    allRightsReserved: "Haki zote zimehifadhiwa.",
    privacyPolicy: "Sera ya Faragha",
    termsOfService: "Masharti ya Huduma",
    cookiePolicy: "Sera ya Kuki"
  },

  en: {
    // Hero Section
    heroTitle: "Quick Help, When You Need It",
    heroSubtitle: "Connect with skilled service providers in your area for home services, roadside assistance, and personal care. Your trusted platform for reliable help.",
    getStarted: "Get Started Today",
    exploreServices: "Explore Services",

    // How It Works Section
    howItWorksTitle: "How It Works",
    findServicesTitle: "Find Services",
    findServicesDesc: "Browse through various categories and find the exact service you need. Our platform makes it easy to discover qualified professionals.",
    bookProviderTitle: "Book a Provider",
    bookProviderDesc: "Choose a trusted service provider based on ratings and reviews. Schedule your service at a time that works for you.",
    getDoneTitle: "Get it Done",
    getDoneDesc: "Relax while your service is completed by a verified professional. Rate your experience to help others.",

    // Service Categories
    servicesTitle: "Our Service Categories",
    servicesSubtitle: "Professional services tailored for Tanzanian homes and families",
    homeServicesTitle: "Home Services",
    homeServicesList: [
      "• Garden Maintenance & Landscaping",
      "• Clothes Washing & Laundry",
      "• Carpet & Upholstery Cleaning",
      "• House Cleaning & Organization",
      "• Pest Control Services"
    ],
    bookHomeService: "Book Home Service",

    personalCareTitle: "Personal Care",
    personalCareList: [
      "• Professional Nail Services",
      "• Men's Salon & Barbering",
      "• Hair Styling & Treatment",
      "• Massage & Wellness",
      "• Beauty & Skincare"
    ],
    bookPersonalCare: "Book Personal Care",

    roadsideTitle: "Roadside Assistance",
    roadsideList: [
      "• Emergency Car Repair",
      "• Tyre Change & Replacement",
      "• Battery Jump Start",
      "• Vehicle Towing Service",
      "• Fuel Delivery"
    ],
    getRoadHelp: "Get Road Help",

    viewAllServices: "View All Services",

    // Why Choose Us
    whyChooseTitle: "Why Choose QuickAssist?",
    verifiedTitle: "Verified Providers",
    verifiedDesc: "All service providers are thoroughly vetted and verified for your safety and peace of mind.",
    quickResponseTitle: "Quick Response",
    quickResponseDesc: "Get connected with available providers in minutes, not hours. Fast, reliable service when you need it.",
    communityTrustedTitle: "Community Trusted",
    communityTrustedDesc: "Join thousands of satisfied customers who trust QuickAssist for their service needs.",

    // Testimonials
    testimonialsTitle: "What Our Users Say",
    testimonial1: "Found an amazing house cleaner through QuickAssist. The booking process was so simple, and the service was excellent! Highly recommend this platform.",
    testimonial2: "Got stranded with a flat tire and used QuickAssist to find a nearby mechanic. He arrived in 20 minutes. Absolute lifesaver!",
    testimonial3: "As a hairstylist, QuickAssist has helped me find new clients in my area. The platform is user-friendly and has been amazing for my business growth.",

    // CTA Section
    ctaTitle: "Ready to Get Started?",
    ctaDescription: "Join QuickAssist today and connect with reliable service providers or offer your services to people in need. Your journey to better service starts here.",
    signUpFree: "Sign Up Now - It's Free",    // Navbar
    services: "Services",
    howItWorks: "How It Works",
    whyUs: "Why Us",
    reviews: "Reviews",
    login: "Login",
    register: "Register",

    // Footer
    footerDescription: "Connecting you with trusted service providers in your area. Get the help you need, when you need it. Your reliable platform for quality services.",
    quickLinks: "Quick Links",
    ourServices: "Our Services",
    about: "About",
    contact: "Contact",
    becomeProvider: "Become a Provider",
    faq: "FAQ",
    serviceCategories: "Service Categories",
    homeServices: "Home Services",
    roadsideAssistance: "Roadside Assistance",
    personalCare: "Personal Care",
    businessServices: "Business Services",
    viewAll: "View All",
    contactUs: "Contact Us",
    allRightsReserved: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy"
  }
};

interface LanguageContextType {
  language: 'sw' | 'en';
  setLanguage: (lang: 'sw' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'sw' | 'en'>('sw'); // Default to Swahili
  const t = (key: string): any => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key; // Return key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
