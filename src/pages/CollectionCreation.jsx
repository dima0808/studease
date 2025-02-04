import React, { useEffect, useState } from 'react';
import {
  createCollection,
  getCollectionByName,
  getQuestionsByCollectionName,
  generateQuestions,
} from '../utils/http';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Questions from '../components/creation/Questions';
import { FaPlus, FaCheck, FaRobot } from 'react-icons/fa';
import Generation from '../components/Generation';
import ErrorGeneration from '../components/ErrorGeneration';
import BackButton from '../components/BackButton';

function CollectionCreation() {
  const location = useLocation();
  const [collection, setCollection] = useState({
    name: '',
    questions: [],
  });
  const [prompt, setPrompt] = useState(null); // Для налаштування запиту
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorGenerate, setErrorGenerate] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleAddQuestionPrompt = () => {
    setPrompt({
      theme: '',
      type: 'single_choice',
      points: 1,
      questionsCount: 1,
    });
  };

  const handleGenerateQuestions = (prompt) => {
    const token = Cookies.get('token');
    setIsGenerating(true);
    generateQuestions(prompt, token)
      .then((data) => {
        setCollection({
          ...collection,
          questions: [
            ...collection.questions,
            ...data.questions.map((question) => ({
              content: question.content,
              points: question.points,
              type: question.type,
              answers:
                question.type === 'matching'
                  ? question.answers.map((answer) => ({
                      leftOption: answer.leftOption,
                      rightOption: answer.rightOption,
                    }))
                  : question.answers,
            })),
          ],
        });
        setPrompt(null);
        setIsGenerating(false);
        setErrorGenerate(false);
      })
      .catch((error) => {
        setErrors((prevErrors) => ({ ...prevErrors, submit: error.message }));
        setIsGenerating(false);
        setErrorGenerate(true);
      });
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
      <BackButton />
      <div className="test-creation">
        <h2>{t('collection_creation_page.title')}</h2>
        <div>
          <label>{t('collection_creation_page.form.title')}:</label>
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
      {prompt && (
        <div className="test-creation__questions">
          <div className="question-form">
            {isGenerating ? (
              <Generation />
            ) : errorGenerate ? (
              <ErrorGeneration />
            ) : (
              <>
                <div className="collection__controll">
                  <label>{t('create_page.generateForm.theme')}:</label>
                  <input
                    type="text"
                    name="theme"
                    placeholder={t('create_page.generateForm.theme')}
                    value={prompt.theme}
                    onChange={(e) => setPrompt({ ...prompt, theme: e.target.value })}
                  />
                </div>
                <div className="answer__controller--score">
                  <label>{t('create_page.generateForm.points')}:</label>
                  <input
                    type="text"
                    name="points"
                    placeholder="Points"
                    value={prompt.points}
                    onChange={(e) => setPrompt({ ...prompt, points: e.target.value })}
                  />
                </div>
                <div className="answer__controller--type">
                  <label>{t('create_page.generateForm.type')}:</label>
                  <select
                    name="type"
                    value={prompt.type}
                    onChange={(e) => setPrompt({ ...prompt, type: e.target.value })}>
                    <option value="multiple_choices">
                      {t('create_page.questionForm.option.multipleChoices')}
                    </option>
                    <option value="single_choice">
                      {t('create_page.questionForm.option.singleChoice')}
                    </option>
                    <option value="matching">
                      {t('create_page.questionForm.option.matching')}
                    </option>
                  </select>
                </div>
                <div className="collection__controll">
                  <label>{t('create_page.generateForm.questionCount')}:</label>
                  <input
                    type="number"
                    name="questionsCount"
                    value={prompt.questionsCount}
                    onChange={(e) => setPrompt({ ...prompt, questionsCount: e.target.value })}
                  />
                </div>
                <button onClick={() => setPrompt(null)}>
                  {t('create_page.questionForm.buttons.remove')}
                </button>
                <button onClick={() => handleGenerateQuestions(prompt)}>
                  {t('create_page.generateForm.button')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="buttons-container">
        <button onClick={handleAddQuestion}>
          <FaPlus />
          {t('create_page.form.buttons.addQuestion')}
        </button>
        <button onClick={handleAddQuestionPrompt}>
          <FaRobot /> {t('create_page.form.buttons.generateWithAI')}
        </button>
        <button onClick={handleSubmit}>
          <FaCheck />
          {t('create_page.form.buttons.submit')}
        </button>
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
