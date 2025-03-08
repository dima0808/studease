import React from 'react';
import { useState, useEffect } from 'react';
import { truncateText } from '../utils/truncateText.js';

import questionsImg from '../assets/icons/questionCount.svg';
import DropdownMenu from './DropdownMenu';

const CollectionRow = ({
  id,
  name,
  selectAll,
  questionsCount,
  onDelete,
  setSelectedCollections,
  isTest,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectAll);
    setSelectedCollections((prev) => {
      if (selectAll) {
        return [...new Set([...prev, name])];
      } else {
        return prev.filter((testName) => testName !== name);
      }
    });
  }, [selectAll, name, setSelectedCollections]);

  const handleCheckboxChange = () => {
    setIsSelected(!isSelected);
    setSelectedCollections((prev) => {
      if (prev.includes(name)) {
        return prev.filter((testName) => testName !== name);
      }
      return [...prev, name];
    });
  };

  return (
    <div className={`session-row ${isSelected ? 'selected' : ''}`}>
      <div className="session-row__checkbox">
        <input type="checkbox" checked={isSelected} onChange={handleCheckboxChange} id={id} />
        <label htmlFor={id}></label>
      </div>
      <div className="session-row__title">{truncateText(name, 24)}</div>
      <div className="session-row__dates">
        <div className="session-row__start-date"></div>
        <div className="session-row__divider"></div>
        <div className="session-row__end-date"></div>
      </div>
      <div className="session-row__status">
        <div className="status-active bg-transparent"></div>
      </div>
      <div className="session-row__status"></div>
      <div className="session-row__sessions">
        <img src={questionsImg} alt="Count" />
        <span>{questionsCount}</span>
      </div>
      <div className="session-row__actions">
        <DropdownMenu id={name} onDelete={onDelete} isTest={isTest} text="collection" />
      </div>
    </div>
  );
};

export default CollectionRow;
