import React, { useEffect, useState } from 'react';
import { createCollection, getCollectionByName, getQuestionsByCollectionName } from '../utils/http';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import Questions from '../components/creation/Questions';

function CollectionCreation() {
  const location = useLocation();
  const [collection, setCollection] = useState({
    name: '',
    questions: [],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cloneName = params.get('cloneName');
    if (cloneName) {
      const token = Cookies.get('token');
      getCollectionByName(cloneName, token)
        .then((collectionData) => {
          getQuestionsByCollectionName(cloneName, token)
            .then((questionsData) => {
              setCollection({
                name: collectionData.name,
                questions: questionsData.questions.map((question) => ({
                  content: question.content,
                  points: question.points,
                  type: question.type,
                  answers:
                    question.type === 'matching'
                      ? question.answers
                          .filter((answer) => answer.isCorrect)
                          .map((answer) => ({
                            leftOption: answer.leftOption,
                            rightOption: answer.rightOption,
                          }))
                      : question.answers,
                })),
              });
            })
            .catch((error) => console.error('Error fetching questions:', error));
        })
        .catch((error) => console.error('Error fetching collection data:', error));
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCollection({ ...collection, [name]: value });
  };

  const handleAddQuestion = () => {
    setCollection({
      ...collection,
      questions: [
        ...collection.questions,
        {
          content: '',
          points: 0,
          type: 'multiple_choices',
          answers: [],
        },
      ],
    });
  };

  const validateField = (key, value) => {
    let error = '';

    if (key === 'collectionName' && !value) {
      error = 'Collection name cannot be empty.';
    }
    setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));
    return error === '';
  };

  const handleSubmit = async () => {
    const token = Cookies.get('token');
    createCollection(collection, token)
      .then(() => navigate('/collections'))
      .catch((error) => {
        setErrors((prevErrors) => ({ ...prevErrors, submit: error.message }));
      });
  };

  return (
    <>
      <div className="test-creation">
        <h2>Create a Collection</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={collection.name}
            onChange={handleInputChange}
            onBlur={(e) => validateField('collectionName', e.target.value)}
            className={errors.collectionName ? 'error-border' : ''}
          />
          {errors.collectionName && <div className="error-message">{errors.collectionName}</div>}
        </div>
      </div>
      <div className="test-creation__questions">
        <Questions
          instance={collection}
          errors={errors}
          setInstance={setCollection}
          setErrors={setErrors}
        />
      </div>
      <div className="buttons-container">
        <button onClick={handleAddQuestion}>Add Question</button>
        <button onClick={handleSubmit}>Create Collection</button>
      </div>
      {errors.submit &&
        errors.submit.split(',').map((error, index) => (
          <div key={index} className="test-creation__questions error-message">
            {error}
          </div>
        ))}
    </>
  );
}

export default CollectionCreation;
