import React from 'react';

interface FooterProps {
  onAboutClick?: () => void;
  onContactClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onCareersClick?: () => void;
  onSupportClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onAboutClick,
  onContactClick,
  onPrivacyClick,
  onTermsClick,
  onCareersClick,
  onSupportClick
}) => {
  return (
    <footer className="w-full px-4 sm:px-6 lg:px-4 py-6 bg-black/20 border-t border-white/10 shadow-lg relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          
          {/* Left Side - Logo and Description */}
          <div className="flex flex-col space-y-4">
            {/* NEXTskill Logo */}
            <div className="text-2xl font-bold select-none">
              <span className="text-gray-100">NEXT</span>
              <span className="text-blue-500">skill</span>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 text-sm max-w-sm">
              Empowering learners with cutting-edge skills for the future. 
              Join thousands of students on their journey to success.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="text-lg">📧</span>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="text-lg">🐦</span>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="text-lg">📘</span>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="text-lg">💼</span>
              </button>
            </div>
          </div>
          
          {/* Right Side - Links */}
          <div className="flex flex-col sm:flex-row gap-8">
            
            {/* Company Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white font-medium text-sm">Company</h3>
              <button 
                onClick={onAboutClick}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left"
              >
                About Us
              </button>
              <button 
                onClick={onCareersClick}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left"
              >
                Careers
              </button>
              <button 
                onClick={onContactClick}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left"
              >
                Contact
              </button>
            </div>
            
            {/* Support Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white font-medium text-sm">Support</h3>
              <button 
                onClick={onSupportClick}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left"
              >
                Help Center
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left">
                Documentation
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left">
                Community
              </button>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white font-medium text-sm">Legal</h3>
              <button 
                onClick={onPrivacyClick}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left"
              >
                Privacy Policy
              </button>
              <button 
                onClick={onTermsClick}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left"
              >
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors duration-300 text-left">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs">
              © 2024 NEXTskill. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button className="text-gray-400 hover:text-white text-xs transition-colors duration-300">
                Status
              </button>
              <button className="text-gray-400 hover:text-white text-xs transition-colors duration-300">
                Security
              </button>
              <button className="text-gray-400 hover:text-white text-xs transition-colors duration-300">
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;