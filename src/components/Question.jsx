import React, {useEffect, useRef, useState} from 'react';
import SingleChoice from '../components/SingleChoice';
import MultipleChoices from './MultipleChoices';
import MatchPairs from '../components/MatchPairs';
import { useTranslation } from 'react-i18next';

function Question({
  test,
  handleSaveAnswer,
  handleFinishTest,
  testSession,
  question,
  error,
  clearError,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const answerContentRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!endTime) {
      const calculateEndTime = () => {
        const deadline = new Date(
          test.deadline.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1'),
        ).getTime();
        const now = new Date().getTime();
        const timeToDeadline = (deadline - now) / 1000; // in seconds
        const timeToComplete = test.minutesToComplete * 60; // in seconds
        return now + Math.min(timeToDeadline, timeToComplete) * 1000;
      };
      setEndTime(calculateEndTime());
    }
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = Math.max(Math.ceil((endTime - now) / 1000), 0);
      setTimeLeft(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timer);
        handleSaveAnswer(selectedAnswers, answerContentRef.current?.value);
        setSelectedAnswers([]);
        if (answerContentRef.current) {
          answerContentRef.current.value = '';
        }
        handleFinishTest();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, handleFinishTest, handleSaveAnswer, selectedAnswers, test]);

  const handleNext = () => {
    handleSaveAnswer(selectedAnswers, answerContentRef.current?.value);
    setSelectedAnswers([]);
    if (answerContentRef.current) {
      answerContentRef.current.value = '';
    }
    clearError();
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours === 0) {
      return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div
        className={`question__body ${error === 'Answers must not be empty' ? 'border-error' : ''}`}>
        <div className="question__timer">
          <div className="question__counter">
            {testSession.currentQuestionIndex + 1}/{test.questionsCount}
          </div>
          {timeLeft !== 0 && (
            <div className={`timer__count ${timeLeft <= 60 ? 'timer__red' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <h1
          className={`question__type ${
            error === 'Answers must not be empty' ? 'color-error' : ''
          }`}>
          {(() => {
            switch (question.type) {
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
        <h1 className="question__name">{question.content}</h1>

        {/* {question.image && <img className="question__image" src={question.image} alt="question" />} */}

        {question.type === 'single_choice' && (
          <SingleChoice
            answers={question.answers}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
          />
        )}
        {question.type === 'multiple_choices' && (
          <MultipleChoices
            answers={question.answers}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
          />
        )}
        {question.type === 'matching' && (
          <MatchPairs answers={question.answers} setSelectedAnswers={setSelectedAnswers} />
        )}

        {question.type === 'essay' && (
          <textarea
            ref={answerContentRef}
            className="question__essay"
            placeholder={t('question_page.essayPlaceholder')}
          />
        )}

        <div className="question__next">
          <button className="question__next-btn" onClick={handleNext}>
            {testSession.currentQuestionIndex < test.questionsCount - 1
              ? t('question_page.buttons.next')
              : t('question_page.buttons.finish')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Question;
