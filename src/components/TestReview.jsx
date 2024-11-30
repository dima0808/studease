import React, { useState } from 'react';
import SingleChoiceReview from '../components/review/SingleChoiceReview';
import MultipleChoicesReview from '../components/review/MultipleChoicesReview';
import MatchPairsReview from '../components/review/MatchPairsReview';
import { calculateTimeDifference } from '../utils/timeUtils';
import download from '../assets/icons/download.svg';

function TestReview({ testSession }) {
  const [IsAnswer, setIsAnswer] = useState(false);

  return (
    <div className="container">
      {IsAnswer ? (
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
            </div>
          ))}
          <button onClick={() => window.print()} className="test-info__pdf-button">
            <img src={download} alt="download" />
            Download my answers
          </button>
        </div>
      ) : (
        <div className="finished">
          <h1>Test have been completed!</h1>
          <div className="finished__answer">
            <button
              onClick={() => {
                setIsAnswer(true);
              }}
              className="finished__check">
              Check my answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestReview;
