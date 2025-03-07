import React, { useEffect, useState } from 'react';

import {
  createTest,
  generateQuestions,
  getAllCollections,
  getQuestionsByTestId,
  getSamplesByTestId,
  getTestById,
} from '../utils/http';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Questions from '../components/creation/Questions';
import Trash from '../assets/icons/trash.svg';
import { FaPlus, FaFolderPlus, FaCheck, FaRobot } from 'react-icons/fa';
import Generation from '../components/Generation';
import ErrorGeneration from '../components/ErrorGeneration';
import BackButton from '../components/BackButton';

function TestCreation() {
  const location = useLocation();
  const [test, setTest] = useState({
    name: '',
    openDate: '',
    deadline: '',
    minutesToComplete: 10,
    questions: [],
    samples: [],
  });
  const [prompt, setPrompt] = useState(null);
  const [collections, setCollections] = useState([]);
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorGenerate, setErrorGenerate] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cloneId = params.get('cloneId');
    if (cloneId) {
      const token = Cookies.get('token');
      getTestById(cloneId, token)
        .then((testData) => {
          getQuestionsByTestId(cloneId, token)
            .then((questionsData) => {
              getSamplesByTestId(cloneId, token)
                .then((samplesData) => {
                  setTest({
                    name: testData.name,
                    openDate: testData.openDate,
                    deadline: testData.deadline,
                    minutesToComplete: testData.minutesToComplete,
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
                      collection: '',
                      isSaved: false,
                    })),
                    samples: samplesData.samples.map((sample) => ({
                      collectionName: sample.collectionName,
                      points: sample.points,
                      questionsCount: sample.questionsCount,
                    })),
                  });
                })
                .catch((error) => console.error('Error fetching collections:', error));
            })
            .catch((error) => console.error('Error fetching questions:', error));
        })
        .catch((error) => console.error('Error fetching test data:', error));
    }
  }, [location.search]);

  useEffect(() => {
    const token = Cookies.get('token');
    getAllCollections(token)
      .then((data) => setCollections(data.collections))
      .catch((error) => console.error('Error fetching collections:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTest({ ...test, [name]: value });
  };

  const handleAddQuestion = () => {
    setTest({
      ...test,
      questions: [
        ...test.questions,
        {
          content: '',
          points: 1,
          type: 'multiple_choices',
          answers: [],
          collection: '',
          isSaved: false,
        },
      ],
    });
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
        setTest({
          ...test,
          questions: [
            ...test.questions,
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
              collection: '',
              isSaved: false,
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

  const handleAddCollection = () => {
    setTest({
      ...test,
      samples: [
        ...test.samples,
        {
          collectionName: collections[0]?.name || '',
          points: 1,
          questionsCount: 1,
        },
      ],
    });
  };

  const handleDeleteCollection = (collectionIndex) => {
    const samples = [...test.samples];
    samples.splice(collectionIndex, 1);
    setTest({ ...test, samples });
  };

  const handleCollectionChange = (collectionIndex, e) => {
    const { name, value } = e.target;
    const samples = [...test.samples];
    samples[collectionIndex][name] = value;
    setTest({ ...test, samples });
  };

  const handleCollectionNameChange = (collectionIndex, e) => {
    const { value } = e.target;
    const samples = [...test.samples];
    samples[collectionIndex].collectionName = value;
    setTest({ ...test, samples });
  };

  const validateField = (key, value) => {
    let error = '';
    const dateTimeRegex = /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/;

    if (key === 'testName' && !value) {
      error = 'Test name cannot be empty.';
    } else if (key === 'openDate' && (!value || !dateTimeRegex.test(value))) {
      error = 'Open date must be in the format DD.MM.YYYY HH:MM.';
    } else if (key === 'deadline' && (!value || !dateTimeRegex.test(value))) {
      error = 'Deadline must be in the format DD.MM.YYYY HH:MM.';
    } else if (key === 'minutesToComplete' && (!value || value <= 0)) {
      error = 'Minutes to complete must be greater than 0.';
    }
    setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));
    return error === '';
  };

  const handleSubmit = async () => {
    const token = Cookies.get('token');
    createTest(test, token)
      .then(() => navigate('/tests'))
      .catch((error) => {
        setErrors((prevErrors) => ({ ...prevErrors, submit: error.message }));
      });
  };

  return (
    <>
      <BackButton />
      <div className="test-creation">
        <h2>{t('create_page.title')}</h2>
        <div className="test-creation__name">
          <label>{t('create_page.form.title')}:</label>
          <input
            type="text"
            name="name"
            value={test.name}
            onChange={handleInputChange}
            onBlur={(e) => validateField('testName', e.target.value)}
            className={errors.testName ? 'error-border' : ''}
          />
          {errors.testName && <div className="error-message">{errors.testName}</div>}
        </div>
        <div>
          <label>{t('create_page.form.openDate')}:</label>
          <input
            type="text"
            name="openDate"
            placeholder="e.g., 11.11.2024 12:35"
            value={test.openDate}
            onChange={handleInputChange}
            onBlur={(e) => validateField('openDate', e.target.value)}
            className={errors.openDate ? 'error-border' : ''}
          />
          {errors.openDate && <div className="error-message">{errors.openDate}</div>}
        </div>
        <div>
          <label>{t('create_page.form.deadline')}:</label>
          <input
            type="text"
            name="deadline"
            placeholder="e.g., 11.11.2024 15:35"
            value={test.deadline}
            onChange={handleInputChange}
            onBlur={(e) => validateField('deadline', e.target.value)}
            className={errors.deadline ? 'error-border' : ''}
          />
          {errors.deadline && <div className="error-message">{errors.deadline}</div>}
        </div>
        <div>
          <label>{t('create_page.form.minutesToComplete')}:</label>
          <input
            type="number"
            name="minutesToComplete"
            value={test.minutesToComplete}
            onChange={handleInputChange}
            onBlur={(e) => validateField('minutesToComplete', e.target.value)}
            className={errors.minutesToComplete ? 'error-border' : ''}
          />
          {errors.minutesToComplete && (
            <div className="error-message">{errors.minutesToComplete}</div>
          )}
        </div>
      </div>
      <div className="test-creation__questions">
        <Questions
          instance={test}
          collections={collections}
          errors={errors}
          setInstance={setTest}
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
                  <textarea
                    type="text"
                    name="theme"
                    placeholder="Theme"
                    value={prompt.theme}
                    onChange={(e) => setPrompt({ ...prompt, theme: e.target.value })}
                  />
                </div>
                <div className="answer__controller--score">
                  <label>{t('create_page.generateForm.points')}:</label>
                  <input
                    type="text"
                    name="points"
                    placeholder={t('create_page.generateForm.points')}
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
                    <option value="essay">{t('create_page.questionForm.option.essay')}</option>
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

      <div className="test-creation__questions">
        {test.samples.map((sample, sIndex) => (
          <div className="collection" key={sIndex}>
            <div className="question-form">
              <div className="collection__controll">
                <label>{t('create_page.collectionForm.name')}:</label>
                <select
                  name="collectionName"
                  value={sample.collectionName}
                  onChange={(e) => handleCollectionNameChange(sIndex, e)}>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.name}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="collection__controll">
                <label>{t('create_page.generateForm.points')}:</label>
                <input
                  type="number"
                  name="points"
                  value={sample.points}
                  onChange={(e) => handleCollectionChange(sIndex, e)}
                  onBlur={(e) => validateField('collection-points', e.target.value, sIndex)}
                  className={errors[`collection-points-${sIndex}`] ? 'error-border' : ''}
                />
                {errors[`collection-points-${sIndex}-0`] && (
                  <div className="error-message">{errors[`collection-points-${sIndex}-0`]}</div>
                )}
              </div>
              <div className="collection__controll">
                <label>{t('create_page.generateForm.questionCount')}:</label>
                <input
                  type="number"
                  name="questionsCount"
                  value={sample.questionsCount}
                  onChange={(e) => handleCollectionChange(sIndex, e)}
                  onBlur={(e) => validateField('collection-points', e.target.value, sIndex)}
                  className={errors[`collection-questions-count-${sIndex}`] ? 'error-border' : ''}
                />
                {errors[`collection-questions-count-${sIndex}-0`] && (
                  <div className="error-message">
                    {errors[`collection-questions-count-${sIndex}-0`]}
                  </div>
                )}
              </div>
              <button className="questions-delete" onClick={() => handleDeleteCollection(sIndex)}>
                <img src={Trash} alt="delete" />

                {t('create_page.questionForm.buttons.remove')}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="buttons-container">
        <button onClick={handleAddQuestion}>
          <FaPlus /> {t('create_page.form.buttons.addQuestion')}
        </button>
        <button onClick={handleAddQuestionPrompt}>
          <FaRobot /> {t('create_page.form.buttons.generateWithAI')}
        </button>
        <button onClick={handleAddCollection}>
          <FaFolderPlus /> {t('create_page.form.buttons.addCollection')}
        </button>
        <button onClick={handleSubmit}>
          <FaCheck /> {t('create_page.form.buttons.submit')}
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

export default TestCreation;
