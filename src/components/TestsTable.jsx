import React, { useEffect } from 'react';
import { useState } from 'react';
import Header from './Header';
import SessionRow from './SessionRow';
import { deleteTestById, getAllTests } from '../utils/http';
import Cookies from 'js-cookie';
import NotFoundTest from './NotFoundTest';

const TestsTable = () => {
  const [tests, setTests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

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
    getAllTests(token)
      .then((data) => setTests(data.tests))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="tests-table">
      <Header title={'Tests'} onSearch={handleSearch} deleteSelectedTests={deleteSelectedTests} />
      <div className="session-table">
        {filteredTests.length === 0 ? (
          <NotFoundTest />
        ) : (
          <>
            <div className="session-table__header">
              <div className="session-table__header-checkbox">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <label htmlFor="selectAll"></label>
              </div>
              <div className="session-table__header-title">Title</div>
              <div className="session-table__header-start-date">Start date</div>
              <div className="session-table__header-end-date">End date</div>
              <div className="session-table__header-status">Status</div>
              <div className="session-table__header-sessions">
                <span>Active sessions</span>
              </div>
              <div className="session-table__header-actions">Actions</div>
            </div>
            <div className="session-table__body">
              {filteredTests.map((test) => (
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
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TestsTable;
