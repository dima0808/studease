import React, { useEffect, useState } from 'react';
import {getCollectionByName, getQuestionsByCollectionName} from '../utils/http';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Questions from "../components/info/Questions";

function CollectionInfo() {
  const { name } = useParams();
  const [collectionData, setCollectionData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    getCollectionByName(name, token)
      .then(setCollectionData)
      .catch((error) => setError({ message: error.message || 'An error occurred' }));
    getQuestionsByCollectionName(name, token)
      .then((data) => setQuestions(data.questions))
      .catch((error) => setError({ message: error.message || 'An error occurred' }));
  }, [name]);

  if (error) return <div>{error.message}</div>;
  else if (!collectionData) return <div>Loading...</div>;

  return (
    <div className="test-info">
      <h2 className="test-info__title">{collectionData.name}</h2>

      <div className="test-info__details">
        <p>Questions: {collectionData.questionsCount}</p>
      </div>

      <Questions questions={questions} />
    </div>
  );
}

export default CollectionInfo;
