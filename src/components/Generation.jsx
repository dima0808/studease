import ReactLoading from 'react-loading';

function Generation() {
  return (
    <div className="loading-indicator generate-questions">
      <ReactLoading type="spinningBubbles" color="#4A90E2" height={60} width={60} />
      <p className="generate-questions__title">Generating questions, please wait...</p>
    </div>
  );
}

export default Generation;
