import { calculateTimeDifference } from '../utils/timeUtils';
import SingleChoiceReview from '../components/review/SingleChoiceReview';
import MultipleChoicesReview from '../components/review/MultipleChoicesReview';
import MatchPairsReview from '../components/review/MatchPairsReview';
import download from '../assets/icons/download.svg';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { getFinishedSessionsByTestId } from '../utils/http';
import BackButton from '../components/BackButton';
import EssayReview from "../components/review/EssayReview";

function SessionDetails() {
  const location = useLocation();
  const { id } = useParams();
  const [testSession, setTestSession] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const credentials = params.get('credentials');
    if (credentials) {
      getFinishedSessionsByTestId(id, Cookies.get('token'), credentials)
        .then((data) => {
          setTestSession(data);
        })
        .catch((error) => console.error('Error fetching finished sessions: ', error));
    }
  }, [id, location.search]);

  if (!testSession) return <div>Loading...</div>;
  return (
    <div className="container">
      <div className="mt-55 mb-55">
        <h2 className="test-info__title">The answers you chose</h2>
        <div className="test-info__details mt-55">
          <div className="test-info__item">
            <span className="test-info__label">Student:</span> {testSession.studentGroup}{' '}
            {testSession.studentName}
          </div>
          <div className="test-info__item">
            <span className="test-info__label">Started:</span> {testSession.startedAt}
          </div>
          <div className="test-info__item">
            <span className="test-info__label">Finished:</span> {testSession.finishedAt}
          </div>
          <div className="test-info__item">
            <span className="test-info__label">Duration:</span>{' '}
            {calculateTimeDifference(testSession.startedAt, testSession.finishedAt)}
          </div>
        </div>
        {testSession.responses.map((response, index) => (
          <div key={response.id} className="question__body mt-55">
            <div className="question__timer">
              <div className="question__counter">
                {index + 1}/{testSession.responses.length}
              </div>
            </div>
            <h1 className="question__type">
              {(() => {
                switch (response.question.type) {
                  case 'single_choice':
                    return 'Choose your option';
                  case 'multiple_choices':
                    return 'Choose your options';
                  case 'matching':
                    return 'Match the pairs';
                  case 'essay':
                    return 'Essay';
                  default:
                    return '';
                }
              })()}
            </h1>
            <h1 className="question__name">{response.question.content}</h1>

            {response.question.type === 'single_choice' && (
              <SingleChoiceReview
                answers={response.question.answers}
                selectedAnswer={response.answerIds}
                questionId={response.question.id}
              />
            )}
            {response.question.type === 'multiple_choices' && (
              <MultipleChoicesReview
                answers={response.question.answers}
                selectedAnswer={response.answerIds}
                questionId={response.question.id}
              />
            )}
            {response.question.type === 'matching' && (
              <MatchPairsReview
                answers={response.question.answers}
                selectedAnswer={response.answerIds}
              />
            )}
            {response.question.type === 'essay' && (
              <EssayReview
                answer={response.answerContent}
              />
            )}
          </div>
        ))}
        <button onClick={() => window.print()} className="test-info__pdf-button">
          <img src={download} alt="download" />
          Download my answers
        </button>
      </div>
      <BackButton />
    </div>
  );
}

export default SessionDetails;
