import React, { useState } from 'react';
import i18next from 'i18next';

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState(i18next.language);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'uk' ? 'en' : 'uk'));
    i18next.changeLanguage(language === 'uk' ? 'en' : 'uk');
  };

  return (
    <div className="language-switcher-container">
      <span className="language-text">{language === 'uk' ? 'Українська' : 'English'}</span>
      <button onClick={toggleLanguage} className="language-toggle-btn">
        {i18next.language === 'uk' ? 'EN' : 'UK'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
