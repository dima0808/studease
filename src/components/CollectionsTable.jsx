import React, { useEffect } from 'react';
import { useState } from 'react';
import Header from './Header';
import NotFoundTest from './NotFoundTest';
import { deleteCollectionByName, getAllCollections } from '../utils/http';
import Cookies from 'js-cookie';
import CollectionRow from './CollectionRow';
import RowLoader from './RowLoader';

const CollectionsTable = () => {
  const [collections, setCollections] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const filteredCollections = collections.filter((test) =>
    test.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleDeleteCollection = async (name) => {
    const token = Cookies.get('token');
    try {
      await deleteCollectionByName(name, token);
      setCollections(collections.filter((collection) => collection.name !== name));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelectedCollections = async () => {
    const token = Cookies.get('token');
    try {
      await Promise.all(selectedCollections.map((name) => deleteCollectionByName(name, token)));
      setCollections(
        collections.filter((collection) => !selectedCollections.includes(collection.name)),
      );
      setSelectedCollections([]);
      setSelectAll(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoading(true);
    getAllCollections(token)
      .then((data) => {
        setCollections(data.collections);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="tests-table">
      <Header
        title={'Collections'}
        onSearch={handleSearch}
        deleteSelectedTests={deleteSelectedCollections}
        isTest={false}
      />
      <div className="session-table">
        <div className="session-table__header">
          <div className="session-table__header-checkbox">
            <input type="checkbox" id="selectAll" checked={selectAll} onChange={handleSelectAll} />
            <label htmlFor="selectAll"></label>
          </div>
          <div className="session-table__header-title">Title</div>
          <div className="session-table__header-start-date transparent">Start date</div>
          <div className="session-table__header-end-date transparent">End date</div>
          <div className="session-table__header-status transparent">Status</div>
          <div className="session-table__header-sessions">Questions</div>
          <div className="session-table__header-actions">Actions</div>
        </div>
        <div className="session-table__body">
          {isLoading ? (
            [...Array(5)].map((_, index) => <RowLoader key={index} />)
          ) : filteredCollections.length === 0 ? (
            <NotFoundTest isTest={false} />
          ) : (
            filteredCollections.map((collection) => (
              <CollectionRow
                key={collection.id}
                id={collection.id}
                name={collection.name}
                questionsCount={collection.questionsCount}
                selectAll={selectAll}
                onDelete={handleDeleteCollection}
                setSelectedCollections={setSelectedCollections}
                isTest={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionsTable;
