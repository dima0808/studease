import React from 'react';

function SingleChoice({ answers, selectedAnswers, setSelectedAnswers }) {

  const handleAnswerChange = (id) => {
    setSelectedAnswers([id]);
  };

  return (
    <div className="single-choice">
      {answers.map((answer) => (
        <label key={answer.id} className="option">
          <input
            type="radio"
            name="single-choice"
            value={answer.id}
            checked={selectedAnswers[0] === answer.id}
            onChange={() => handleAnswerChange(answer.id)}
          />
          <span className="custom-radio"></span>
          <span>{answer.content}</span>
        </label>
      ))}
    </div>
  );
}

export default SingleChoice;
