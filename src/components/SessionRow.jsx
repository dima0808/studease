import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { truncateText } from '../utils/truncateText.js';
import { useTranslation } from 'react-i18next';

import DropdownMenu from './DropdownMenu';

import borderBetween from '../assets/icons/brd-between-small.svg';
import people from '../assets/icons/people.svg';

const SessionRow = ({
  id,
  name,
  openDate,
  deadline,
  startedSessions,
  selectAll,
  onDelete,
  setSelectedTests,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsSelected(selectAll);
    setSelectedTests((prev) => {
      if (selectAll) {
        return [...new Set([...prev, id])];
      } else {
        return prev.filter((testId) => testId !== id);
      }
    });
  }, [selectAll, id, setSelectedTests]);

  const handleCheckboxChange = () => {
    setIsSelected(!isSelected);
    setSelectedTests((prev) => {
      if (prev.includes(id)) {
        return prev.filter((testId) => testId !== id);
      }
      return [...prev, id];
    });
  };

  const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const getStatus = useCallback(
    (deadline) => {
      const currentDate = new Date();
      const deadlineTime = parseDate(deadline);
      const openDateTime = parseDate(openDate);
      return currentDate <= deadlineTime && currentDate >= openDateTime;
    },
    [openDate],
  );

  const [status, setStatus] = useState(getStatus(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getStatus(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, getStatus]);

  const [openDatePart, openTimePart] = openDate.split(' ');
  const [deadlineDatePart, deadlineTimePart] = deadline.split(' ');

  return (
    <div className={`session-row ${isSelected ? 'selected' : ''}`}>
      <div className="session-row__checkbox">
        <input type="checkbox" checked={isSelected} onChange={handleCheckboxChange} id={id} />
        <label htmlFor={id}></label>
      </div>
      <div className="session-row__title">{truncateText(name, 20)}</div>
      <div className="session-row__dates">
        <div className="session-row__start-date">
          <span>{openTimePart} UTC+2</span>
          <span>{openDatePart}</span>
        </div>
        <div className="session-row__divider">
          <img src={borderBetween} alt="border" />
        </div>
        <div className="session-row__end-date">
          <span>{deadlineTimePart} UTC+2</span>
          <span>{deadlineDatePart}</span>
        </div>
      </div>
      <div className="session-row__status">
        <div className={`status-${status ? 'active' : 'inactive'}`}>
          <div className={`circle-${status ? 'green' : 'red'}`}></div>
          <span>{status ? t('test_page.session.active') : t('test_page.session.inactive')}</span>
        </div>
      </div>
      <div className="session-row__sessions">
        <img src={people} alt="" />
        <span>{startedSessions}</span>
      </div>
      <div className="session-row__actions">
        <DropdownMenu id={id} onDelete={onDelete} text="test" />
      </div>
    </div>
  );
};

export default SessionRow;
