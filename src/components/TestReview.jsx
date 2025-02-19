import React, { useState } from 'react';
import SingleChoiceReview from '../components/review/SingleChoiceReview';
import MultipleChoicesReview from '../components/review/MultipleChoicesReview';
import MatchPairsReview from '../components/review/MatchPairsReview';
import { calculateTimeDifference } from '../utils/timeUtils';
import download from '../assets/icons/download.svg';
import { useTranslation } from 'react-i18next';
import EssayReview from './review/EssayReview';

function TestReview({ testSession }) {
  const [IsAnswer, setIsAnswer] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="container">
      {IsAnswer ? (
        <div className="mt-55 mb-55">
          <h2 className="test-info__title">{t('testReview_page.title')}</h2>
          <div className="test-info__details mt-55">
            <div className="test-info__item">
              <span className="test-info__label">{t('testReview_page.student')}:</span>{' '}
              {testSession.studentGroup} {testSession.studentName}
            </div>
            <div className="test-info__item">
              <span className="test-info__label">{t('testReview_page.started')}:</span>{' '}
              {testSession.startedAt}
            </div>
            <div className="test-info__item">
              <span className="test-info__label">{t('testReview_page.finished')}:</span>{' '}
              {testSession.finishedAt}
            </div>
            <div className="test-info__item">
              <span className="test-info__label">{t('testReview_page.duration')}:</span>{' '}
              {calculateTimeDifference(testSession.startedAt, testSession.finishedAt)}
            </div>
          </div>
          {testSession.responses.map((response, index) => (
            <div key={index} className="question__body mt-55">
              <div className="question__timer">
                <div className="question__counter">
                  {index + 1}/{testSession.responses.length}
                </div>
              </div>
              <h1 className="question__type">
                {(() => {
                  switch (response.question.type) {
                    case 'single_choice':
                      return t('question_page.chooseOption');
                    case 'multiple_choices':
                      return t('question_page.chooseOptions');
                    case 'matching':
                      return t('question_page.matchPairs');
                    case 'essay':
                      return t('question_page.essay');
                    default:
                      return '';
                  }
                })()}
              </h1>
              <h1 className="question__name">{response.question.content}</h1>
              {response.question.image && (
                <img className="question__image" src={response.question.image} alt="question" />
              )}
              {/* <img className="question__image" src={foto} alt="question" /> */}
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
              {response.question.type === 'essay' && <EssayReview answer={response.answerContent} />}
            </div>
          ))}
          <button onClick={() => window.print()} className="test-info__pdf-button">
            <img src={download} alt="download" />
            {t('testReview_page.download')}
          </button>
        </div>
      ) : (
        <div className="finished">
          <h1>{t('testReview_page.finishedText')}</h1>
          <div className="finished__answer">
            <button
              onClick={() => {
                setIsAnswer(true);
              }}
              className="finished__check">
              {t('testReview_page.checkAnswers')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestReview;
