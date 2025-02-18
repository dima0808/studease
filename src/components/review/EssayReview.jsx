import React from 'react';

const EssayReview = ({ answer }) => {
  return <textarea className="question__essay" value={answer} disabled />;
};

export default EssayReview;
