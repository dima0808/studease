import React from 'react';
import { useState } from 'react';
import searchImg from '../assets/icons/search.svg';
import deleteImg from '../assets/icons/delete.svg';

function Search({ onSearch, isTest = true }) {
  const [searchValue, setSearchValue] = useState('');

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
        placeholder={`search ${isTest ? 'test' : 'collection'}...`}
        className="search__input"
      />
      {searchValue && (
        <img onClick={handleDelete} className="search__delete" src={deleteImg} alt="delete" />
      )}
    </div>
  );
}

export default Search;
