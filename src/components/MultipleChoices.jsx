import React from 'react';

function MultipleChoices({ answers, selectedAnswers, setSelectedAnswers }) {

  const handleAnswerChange = (id) => {
    setSelectedAnswers((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((answerId) => answerId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  return (
    <div className="multiple-choice">
      {answers.map((answer) => (
        <label key={answer.id} className="option">
          <input
            type="checkbox"
            name="multiple-choice"
            value={answer.id}
            checked={selectedAnswers.includes(answer.id)}
            onChange={() => handleAnswerChange(answer.id)}
          />
          <span className="custom-checkbox"></span>
          <span>{answer.content}</span>
        </label>
      ))}
    </div>
  );
}

export default MultipleChoices;
