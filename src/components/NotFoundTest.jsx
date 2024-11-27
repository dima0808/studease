import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundTest({ isTest = true }) {
  return isTest ? (
    <div className="no-tests">
      Ой, немає теста?
      <span role="img" aria-label="sad">
        😢
      </span>
      <div className="create-test">
        Скоріш{' '}
        <Link className="link-to-create" to={`/create-test`}>
          створи{' '}
        </Link>
        свій тест
        <span role="img" aria-label="happy">
          😊
        </span>
      </div>
    </div>
  ) : (
    <div className="no-tests">
      Ой, немає колекції?
      <span role="img" aria-label="sad">
        😢
      </span>
      <div className="create-test">
        Скоріш{' '}
        <Link className="link-to-create" to={`/create-collections`}>
          створи{' '}
        </Link>
        свою колекцію
        <span role="img" aria-label="happy">
          😊
        </span>
      </div>
    </div>
  );
}

export default NotFoundTest;
