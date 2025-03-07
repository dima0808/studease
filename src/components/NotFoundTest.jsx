import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function NotFoundTest({ isTest = true }) {
  const { t } = useTranslation();
  const [quicklyTest, createTest, ...textTest] = t('notFound.createTest').split(' ');
  const [quicklyCollection, createCollections, ...textCollection] = t(
    'notFound.createCollection',
  ).split(' ');

  return isTest ? (
    <div className="no-tests">
      {t('notFound.test')}
      <span role="img" aria-label="sad">
        😢
      </span>
      <div className="create-test">
        {quicklyTest}{' '}
        <Link className="link-to-create" to={`/create-test`}>
          {createTest}{' '}
        </Link>
        {textTest.join(' ')}
        <span role="img" aria-label="happy">
          😊
        </span>
      </div>
    </div>
  ) : (
    <div className="no-tests">
      {t('notFound.collection')}
      <span role="img" aria-label="sad">
        😢
      </span>
      <div className="create-test">
        {quicklyCollection}{' '}
        <Link className="link-to-create" to={`/create-collection`}>
          {createCollections}{' '}
        </Link>
        {textCollection.join(' ')}
        <span role="img" aria-label="happy">
          😊
        </span>
      </div>
    </div>
  );
}

export default NotFoundTest;
