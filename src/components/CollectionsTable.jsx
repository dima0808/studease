import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import Header from './Header';
import NotFoundTest from './NotFoundTest';
import { deleteCollectionByName, getAllCollections } from '../utils/http';
import Cookies from 'js-cookie';
import CollectionRow from './CollectionRow';
import RowLoader from './RowLoader';
import { useTranslation } from 'react-i18next';

const CollectionsTable = () => {
  const [collections, setCollections] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const filteredCollections = useMemo(() => {
    return collections.filter((test) =>
      test.name.toLowerCase().includes(searchValue.toLowerCase().trim()),
    );
  }, [collections, searchValue]);

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
        title={t('collection_page.title')}
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
          <div className="session-table__header-title">{t('collection_page.collection.title')}</div>
          <div className="session-table__header-start-date transparent">Start date</div>
          <div className="session-table__header-end-date transparent">End date</div>
          <div className="session-table__header-status transparent">Status</div>
          <div className="session-table__header-sessions">
            {t('collection_page.collection.questions')}
          </div>
          <div className="session-table__header-actions">
            {t('collection_page.collection.actions')}
          </div>
        </div>
        <div className="session-table__body">
          {isLoading ? (
            [...Array(5)].map((_, index) => <RowLoader key={index} />)
          ) : filteredCollections.length > 0 ? (
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
          ) : !isLoading && collections.length === 0 ? (
            <NotFoundTest isTest={false} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CollectionsTable;
