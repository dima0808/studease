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
import { calculateTimeDifference } from '../utils/timeUtils';
import { CLIENT_PATH } from '../utils/constraints';
import Questions from '../components/info/Questions';

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
  const testLink = `http://${CLIENT_PATH}/#/${id}`;

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
        setSortedSessions(data.sessions); // Ініціалізуємо відсортовані дані
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
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="test-info__details">
        <p>Open Date: {testData.openDate}</p>
        <p>Deadline: {testData.deadline}</p>
        <p>Time Limit: {testData.minutesToComplete} minutes</p>
        <p>Max Score: {testData.maxScore}</p>
        <p>Questions: {testData.questionsCount}</p>
        <p>Started Sessions: {testData.startedSessions}</p>
        <p>Finished Sessions: {testData.finishedSessions}</p>
      </div>

      <div className="test-info__show">
        <button
          className="test-info__import-button"
          onClick={() => setIsQuestionsVisible(!isQuestionsVisible)}>
          {isQuestionsVisible ? 'Hide Questions' : 'Show Questions'}
        </button>
        {isQuestionsVisible && <Questions questions={questions} />}
      </div>

      <button
        onClick={() => getFinishedSessionsByTestIdInCsv(testData.name, id, Cookies.get('token'))}
        className="test-info__import-button">
        Export
      </button>
      <table className="test-info__table">
        <thead>
          <tr>
            <th>
              Group
              <button className="sort-button" onClick={() => sortSessions('studentGroup')}>
                {getSortIcon('studentGroup')}
              </button>
            </th>
            <th>
              Full Name
              <button className="sort-button" onClick={() => sortSessions('studentName')}>
                {getSortIcon('studentName')}
              </button>
            </th>
            <th>Score</th>
            <th>
              Completion Time
              <button className="sort-button" onClick={() => sortSessions('completionTime')}>
                {getSortIcon('completionTime')}
              </button>
            </th>
            <th>Details</th>
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
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TestInfo;
