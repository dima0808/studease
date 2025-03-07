import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import Header from './Header';
import SessionRow from './SessionRow';
import { deleteTestById, getAllTests } from '../utils/http';
import Cookies from 'js-cookie';
import NotFoundTest from './NotFoundTest';
import RowLoader from './RowLoader';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const TestsTable = () => {
  const [tests, setTests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const filteredTests = useMemo(() => {
    return tests.filter((test) =>
      test.name.toLowerCase().includes(searchValue.toLowerCase().trim()),
    );
  }, [tests, searchValue]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleDeleteTest = async (id) => {
    const token = Cookies.get('token');
    try {
      await deleteTestById(id, token);
      setTests(tests.filter((test) => test.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelectedTests = async () => {
    const token = Cookies.get('token');
    try {
      await Promise.all(selectedTests.map((id) => deleteTestById(id, token)));
      setTests(tests.filter((test) => !selectedTests.includes(test.id)));
      setSelectedTests([]);
      setSelectAll(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoading(true);
    getAllTests(token)
      .then((data) => {
        setTests(data.tests);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const styleText =
    i18next.language === 'uk'
      ? { transform: 'translate(-50%, -50%)' }
      : { transform: 'translate(-50%, -75%)' };

  return (
    <div className="tests-table">
      <Header
        title={t('test_page.title')}
        onSearch={handleSearch}
        deleteSelectedTests={deleteSelectedTests}
      />
      <div className="session-table">
        <div className="session-table__header">
          <div className="session-table__header-checkbox">
            <input type="checkbox" id="selectAll" checked={selectAll} onChange={handleSelectAll} />
            <label htmlFor="selectAll"></label>
          </div>
          <div className="session-table__header-title">{t('test_page.session.title')}</div>
          <div className="session-table__header-start-date">{t('test_page.session.startDate')}</div>
          <div className="session-table__header-end-date">{t('test_page.session.endDate')}</div>
          <div className="session-table__header-status">{t('test_page.session.status')}</div>
          <div className="session-table__header-sessions">
            <span style={styleText}>{t('test_page.session.activeSession')}</span>
          </div>
          <div className="session-table__header-actions">{t('test_page.session.actions')}</div>
        </div>
        <div className="session-table__body">
          {isLoading ? (
            [...Array(5)].map((_, index) => <RowLoader key={index} />)
          ) : filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <SessionRow
                key={test.id}
                id={test.id}
                name={test.name}
                openDate={test.openDate}
                deadline={test.deadline}
                startedSessions={test.startedSessions}
                selectAll={selectAll}
                onDelete={handleDeleteTest}
                setSelectedTests={setSelectedTests}
              />
            ))
          ) : !isLoading && tests.length === 0 ? (
            <NotFoundTest isTest={true} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TestsTable;
