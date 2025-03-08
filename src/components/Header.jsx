import React from 'react';
import HeaderDropdownMenu from './HeaderDropdownMenu';
import Search from './Search';

import Tests from '../assets/icons/big-tests.svg';
import Collections from '../assets/icons/big-collections.svg';
import { useLocation } from 'react-router-dom';

function Header({ title, deleteSelectedTests, onSearch, isTest }) {
  const location = useLocation();

  return (
    <div className="tests__header">
      <div className="tests__slogan">
        <img
          className="tests__img"
          src={location.pathname === '/tests' ? Tests : Collections}
          alt="foto"
        />
        <h1 className={`tests__title--${location.pathname === '/tests' ? 'green' : 'purple'}`}>
          {title}
        </h1>
      </div>
      <div className="tests__tools">
        <HeaderDropdownMenu
          deleteSelectedTests={deleteSelectedTests}
          text={location.pathname === '/tests' ? 'test' : 'collection'}
        />
        <Search onSearch={onSearch} isTest={isTest} />
      </div>
    </div>
  );
}

export default Header;
