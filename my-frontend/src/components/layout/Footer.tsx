import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        {/* Main Footer Content */}
        <div style={footerStyles.mainContent}>
          {/* Company Info */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>QuickAssist</h3>            <p style={footerStyles.description}>
              {t('footerDescription')}
            </p>
            <div style={footerStyles.socialLinks}>
              <a href="#" style={footerStyles.socialLink} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" style={footerStyles.socialLink} aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" style={footerStyles.socialLink} aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" style={footerStyles.socialLink} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
            {/* Quick Links */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>{t('quickLinks')}</h3>
            <ul style={footerStyles.linkList}>
              <li><Link to="/services" style={footerStyles.link}>{t('ourServices')}</Link></li>
              <li><Link to="/about" style={footerStyles.link}>{t('about')}</Link></li>
              <li><Link to="/contact" style={footerStyles.link}>{t('contact')}</Link></li>
              <li><Link to="/register" style={footerStyles.link}>{t('becomeProvider')}</Link></li>
              <li><Link to="/faq" style={footerStyles.link}>{t('faq')}</Link></li>
            </ul>
          </div>
            {/* Service Categories */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>{t('serviceCategories')}</h3>
            <ul style={footerStyles.linkList}>
              <li><Link to="/categories/home" style={footerStyles.link}>{t('homeServices')}</Link></li>
              <li><Link to="/categories/roadside" style={footerStyles.link}>{t('roadsideAssistance')}</Link></li>
              <li><Link to="/categories/personal" style={footerStyles.link}>{t('personalCare')}</Link></li>
              <li><Link to="/categories/business" style={footerStyles.link}>{t('businessServices')}</Link></li>
              <li><Link to="/categories" style={footerStyles.link}>{t('viewAll')}</Link></li>
            </ul>
          </div>
            {/* Contact Info */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>{t('contactUs')}</h3>
            <div style={footerStyles.contactInfo}>
              <div style={footerStyles.contactItem}>
                <Mail size={16} style={footerStyles.contactIcon} />
                <span>info@quickassist.co.tz</span>
              </div>
              <div style={footerStyles.contactItem}>
                <Phone size={16} style={footerStyles.contactIcon} />
                <span>+255 123 456 789</span>
              </div>
              <div style={footerStyles.contactItem}>
                <MapPin size={16} style={footerStyles.contactIcon} />
                <span>Dar es Salaam, Tanzania</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div style={footerStyles.bottomBar}>
          <div style={footerStyles.bottomContent}>
            <p style={footerStyles.copyright}>
              &copy; {new Date().getFullYear()} QuickAssist. {t('allRightsReserved')}
            </p>
            <div style={footerStyles.legalLinks}>
              <Link to="/privacy" style={footerStyles.legalLink}>{t('privacyPolicy')}</Link>
              <Link to="/terms" style={footerStyles.legalLink}>{t('termsOfService')}</Link>
              <Link to="/cookies" style={footerStyles.legalLink}>{t('cookiePolicy')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Inline styles for the footer
const footerStyles = {
  footer: {
    backgroundColor: '#1f2937',
    color: '#e5e7eb',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    padding: '60px 0 40px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#ffffff',
  },
  description: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '20px',
    color: '#d1d5db',
  },
  socialLinks: {
    display: 'flex',
    gap: '15px',
  },
  socialLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#147c3c',
    color: 'white',
    borderRadius: '50%',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  linkList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  link: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.95rem',
    lineHeight: '2',
    transition: 'color 0.3s ease',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.95rem',
  },
  contactIcon: {
    color: '#147c3c',
    flexShrink: 0,
  },
  bottomBar: {
    borderTop: '1px solid #374151',
    paddingTop: '30px',
    paddingBottom: '30px',
  },
  bottomContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '20px',
  },
  copyright: {
    margin: '0',
    fontSize: '0.9rem',
    color: '#9ca3af',
  },
  legalLinks: {
    display: 'flex',
    gap: '25px',
    flexWrap: 'wrap' as const,
  },
  legalLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease',
  },
};

export default Footer;

