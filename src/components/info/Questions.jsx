import React from 'react';
import SingleChoiceReview from '../../components/review/SingleChoiceReview';
import MultipleChoicesReview from '../../components/review/MultipleChoicesReview';
import MatchPairsReview from '../../components/review/MatchPairsReview';

function Questions({ questions }) {
  return (
    <div>
      <div className="mt-55 mb-55">
        {questions.map((question, index) => (
          <div key={index} className="question__body mt-55">
            <div className="question__timer">
              <div className="question__counter">
                {index + 1}/{questions.length}
              </div>
            </div>
            <h1 className="question__type">
              {(() => {
                switch (question.type) {
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
            <h1 className="question__name">{question.content}</h1>

            {question.type === 'single_choice' && (
              <SingleChoiceReview
                answers={question.answers}
                selectedAnswer={question.answers
                  .filter((answer) => answer.isCorrect)
                  .map((answer) => answer.id)}
                questionId={question.id}
              />
            )}
            {question.type === 'multiple_choices' && (
              <MultipleChoicesReview
                answers={question.answers}
                selectedAnswer={question.answers
                  .filter((answer) => answer.isCorrect)
                  .map((answer) => answer.id)}
                questionId={question.id}
              />
            )}
            {question.type === 'matching' && (
              <MatchPairsReview
                answers={question.answers}
                selectedAnswer={question.answers
                  .filter((answer) => answer.isCorrect)
                  .map((answer) => answer.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questions;
