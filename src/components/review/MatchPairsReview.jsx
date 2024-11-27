import React from 'react';

function MatchPairsReview({ answers, selectedAnswer }) {
  const leftOptions = [...new Set(answers.map((answer) => answer.leftOption))];

  return (
    <div className="match-pairs-review">
      <div className="match__container">
        {leftOptions.map((left, index) => (
          <div className="match__question" key={index}>
            <div className="match__name">{left}</div>
            <div className="match__between"></div>
            <div className="match__field filled">
              {answers.find((answer) =>
                answer.leftOption === left && selectedAnswer.includes(answer.id))?.rightOption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchPairsReview;
