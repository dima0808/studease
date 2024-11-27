import React from 'react';
import { useState, useRef, useEffect } from 'react';

import create from '../assets/icons/create-tests.svg';
import importImg from '../assets/icons/import.svg';
import exportImg from '../assets/icons/export.svg';
import remove from '../assets/icons/remove.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const HeaderDropdownMenu = ({ deleteSelectedTests }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

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
        className={`dropdown-toggle header-toggle ${
          isMenuOpen ? 'dropdown-toggle--inactive' : ''
        }`}>
        <span>Actions</span>
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
        <div className="dropdown__menu header-menu">
          <div
            onClick={() => {
              location.pathname === '/tests'
                ? navigate('/create-test')
                : navigate('/create-collection');
            }}
            className="dropdown__item">
            <img src={create} alt="info" />
            Create
          </div>
          <div className="dropdown__item">
            <img src={importImg} alt="clone" />
            Import
          </div>
          <div className="dropdown__item">
            <img src={exportImg} alt="edit" />
            Export
          </div>
          <div
            onClick={() => {
              deleteSelectedTests();
              setIsMenuOpen(false);
            }}
            className="dropdown__item remove">
            <img src={remove} alt="remove" />
            Remove
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderDropdownMenu;
