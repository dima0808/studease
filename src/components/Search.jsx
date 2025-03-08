import React from 'react';
import { useState } from 'react';
import searchImg from '../assets/icons/search.svg';
import deleteImg from '../assets/icons/delete.svg';
import { useTranslation } from 'react-i18next';

function Search({ onSearch, isTest = true }) {
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleDelete = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <div className="search__wrapper">
      <img src={searchImg} alt="search" />
      <input
        onChange={handleSearch}
        value={searchValue}
        type="text"
        placeholder={`${isTest ? t('search.test') : t('search.collection')}`}
        className="search__input"
      />
      {searchValue && (
        <button type="button" className="search__delete" onClick={handleDelete}>
          <img src={deleteImg} alt="delete" />
        </button>
      )}
    </div>
  );
}

export default Search;
