import React from 'react';
import { Globe, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-tagline">Let's work together, connect today.</p>
          <span className="footer-divider">|</span>
          <p className="footer-copyright">
            © {new Date().getFullYear()} QRG Creator • Built with <Heart size={12} fill="var(--danger)" color="var(--danger)" style={{ display: 'inline', verticalAlign: 'middle' }} /> by Saurabh Saini
          </p>
        </div>
        
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/iamsaurabhsaini" target="_blank" rel="noopener noreferrer" className="footer-link" title="LinkedIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span>LinkedIn</span>
          </a>
          <a href="https://iamsaurabhsaini.com/" target="_blank" rel="noopener noreferrer" className="footer-link" title="Portfolio">
            <Globe size={16} />
            <span>Portfolio</span>
          </a>
          <a href="mailto:saurabhsaini789@gmail.com" className="footer-link" title="Email Me">
            <Mail size={16} />
            <span>Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
