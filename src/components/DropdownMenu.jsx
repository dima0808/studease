import React, { useEffect, useRef } from 'react';
import { useState } from 'react';

import info from '../assets/icons/info.svg';
import clone from '../assets/icons/clone.svg';
import remove from '../assets/icons/remove.svg';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DropdownMenu = ({ id, onDelete, isTest = true, text }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleInfo = () => {
    navigate(`/${isTest ? 'tests' : 'collections'}/${id}`);
    // window.open(`#/${isTest ? 'tests' : 'collections'}/${id}`, '_blank');
    setIsMenuOpen(false);
  };

  const handleClone = async () => {
    navigate(`/create-${isTest ? 'test' : 'collection'}?clone${isTest ? 'Id' : 'Name'}=${id}`);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(t('dropdownMenu.confirm'))) {
      onDelete(id);
    }
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        onClick={handleMenuToggle}
        className={`dropdown-toggle ${isMenuOpen ? 'dropdown-toggle--inactive' : ''}`}
        title={t('dropdownMenu.dataTitle.menu')}
        type="button">
        <span>{t('dropdownMenu.title')}</span>
        <svg
          width="22"
          height="22"
          viewBox="0 0 15 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.59801 9.11886L0.226195 2.15009L1.81887 0.408203L7.39435 6.50603L12.9698 0.408203L14.5625 2.15009L8.19068 9.11886C7.97946 9.3498 7.69302 9.47953 7.39435 9.47953C7.09568 9.47953 6.80923 9.3498 6.59801 9.11886Z"
            fill="white"
          />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="dropdown__menu">
          <button
            type="button"
            onClick={handleInfo}
            className="dropdown__item"
            data-title={
              isTest
                ? t('dropdownMenu.dataTitle.infoTest')
                : t('dropdownMenu.dataTitle.infoCollection')
            }>
            <img src={info} alt="info" />
            {t('dropdownMenu.info')}
          </button>
          <button
            type="button"
            onClick={handleClone}
            className="dropdown__item"
            data-title={
              isTest
                ? t('dropdownMenu.dataTitle.cloneTest')
                : t('dropdownMenu.dataTitle.cloneCollection')
            }>
            <img src={clone} alt="clone" />
            {t('dropdownMenu.clone')}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="dropdown__item remove"
            data-title={
              isTest
                ? t('dropdownMenu.dataTitle.removeTest')
                : t('dropdownMenu.dataTitle.removeCollection')
            }>
            <img src={remove} alt="remove" />
            {t('dropdownMenu.remove')}
          </button>
        </div>
      )}
    </div>
  );
};
export default DropdownMenu;
