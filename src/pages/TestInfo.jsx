import React, { useEffect, useState } from 'react';
import { FaCopy, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; // Іконки сортування
import {
  getFinishedSessionsByTestId,
  getFinishedSessionsByTestIdInCsv,
  getQuestionsByTestId,
  getTestById,
} from '../utils/http';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { calculateTimeDifference } from '../utils/timeUtils';
import { CLIENT_PATH } from '../utils/constraints';
import Questions from '../components/info/Questions';
import BackButton from '../components/BackButton';

function TestInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);
  const [testFinishedSessions, setTestFinishedSessions] = useState([]);
  const [sortedSessions, setSortedSessions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // Для збереження стану сортування
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [isQuestionsVisible, setIsQuestionsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const testLink = `http://${CLIENT_PATH}/#/${id}`;

  console.log(testFinishedSessions);

  useEffect(() => {
    const token = Cookies.get('token');
    getTestById(id, token)
      .then(setTestData)
      .catch((error) => setError({ message: error.message || 'An error occurred' }));
    getQuestionsByTestId(id, token)
      .then((data) => setQuestions(data.questions))
      .catch((error) => setError({ message: error.message || 'An error occurred' }));
    getFinishedSessionsByTestId(id, token)
      .then((data) => {
        setTestFinishedSessions(data.sessions);
        setSortedSessions(data.sessions);
      })
      .catch((error) => setError({ message: error.message || 'An error occurred' }));
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const sortSessions = (key) => {
    let direction = 'asc';

    // Перевірка напряму сортування
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...testFinishedSessions].sort((a, b) => {
      if (key === 'studentName') {
        // Сортування за прізвищем
        const surnameA = a[key].split(' ')[0];
        const surnameB = b[key].split(' ')[0];
        return direction === 'asc'
          ? surnameA.localeCompare(surnameB)
          : surnameB.localeCompare(surnameA);
      }

      if (key === 'completionTime') {
        // Обчислення тривалості часу завершення
        const timeA =
          new Date(a.finishedAt.split('.').reverse().join('-')) -
          new Date(a.startedAt.split('.').reverse().join('-'));
        const timeB =
          new Date(b.finishedAt.split('.').reverse().join('-')) -
          new Date(b.startedAt.split('.').reverse().join('-'));
        return direction === 'asc' ? timeA - timeB : timeB - timeA;
      }

      // Сортування за іншими текстовими полями
      return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
    });

    setSortedSessions(sorted);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  if (error) return <div>{error.message}</div>;
  else if (!testData) return <div>Loading...</div>;

  return (
    <div className="test-info">
      <h2 className="test-info__title">{testData.name}</h2>

      <div className="test-info__controls">
        <div className="test-info__link">
          <input type="text" value={testLink} readOnly className="test-info__link-input" />
          <button onClick={handleCopyLink} className="test-info__copy-button">
            <FaCopy className="test-info__copy-icon" />
            {copied ? t('testInfo_page.buttons.copied') : t('testInfo_page.buttons.copyLink')}
          </button>
        </div>
      </div>

      <div className="test-info__details">
        <p>
          {t('testInfo_page.openDate')}: {testData.openDate}
        </p>
        <p>
          {t('testInfo_page.deadline')}: {testData.deadline}
        </p>
        <p>
          {t('testInfo_page.timeLimit')}: {testData.minutesToComplete}
        </p>
        <p>
          {t('testInfo_page.maxScore')}: {testData.maxScore}
        </p>
        <p>
          {t('testInfo_page.questionsCount')}:{testData.questionsCount}
        </p>
        <p>
          {t('testInfo_page.startedSessions')}: {testData.startedSessions}
        </p>
        <p>
          {t('testInfo_page.finishedSessions')}: {testData.finishedSessions}
        </p>
      </div>

      <div className="test-info__show">
        <button
          className="test-info__import-button"
          onClick={() => setIsQuestionsVisible(!isQuestionsVisible)}>
          {isQuestionsVisible
            ? t('testInfo_page.buttons.hideQuestions')
            : t('testInfo_page.buttons.showQuestions')}
        </button>
        {isQuestionsVisible && <Questions questions={questions} />}
      </div>

      <button
        onClick={() => getFinishedSessionsByTestIdInCsv(testData.name, id, Cookies.get('token'))}
        className="test-info__import-button">
        {t('testInfo_page.export')}
      </button>
      <table className="test-info__table">
        <thead>
          <tr>
            <th>
              {t('testInfo_page.table.group')}
              <button className="sort-button" onClick={() => sortSessions('studentGroup')}>
                {getSortIcon('studentGroup')}
              </button>
            </th>
            <th>
              {t('testInfo_page.table.fullName')}
              <button className="sort-button" onClick={() => sortSessions('studentName')}>
                {getSortIcon('studentName')}
              </button>
            </th>
            <th>{t('testInfo_page.table.score')}</th>
            <th>
              {t('testInfo_page.table.completionTime')}
              <button className="sort-button" onClick={() => sortSessions('completionTime')}>
                {getSortIcon('completionTime')}
              </button>
            </th>
            <th>{t('testInfo_page.table.details')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedSessions.map((session, index) => (
            <tr key={index}>
              <td>{session.studentGroup}</td>
              <td>{session.studentName}</td>
              <td>{session.mark}</td>
              <td>{calculateTimeDifference(session.startedAt, session.finishedAt)}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(
                      `/session-details/${id}?credentials=${session.studentGroup}:${session.studentName}`,
                    )
                  }
                  className="test-info__details-button">
                  {t('testInfo_page.table.details')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <BackButton />
    </div>
  );
}

export default TestInfo;
