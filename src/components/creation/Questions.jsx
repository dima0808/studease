import React from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { addQuestionToCollection } from '../../utils/http';
import Trash from '../../assets/icons/trash.svg';

function Questions({ instance, collections, errors, setInstance, setErrors }) {
  const { t } = useTranslation();
  // const fileInputRefs = useRef([]);

  const handleDeleteQuestion = (questionIndex) => {
    const questions = [...instance.questions];
    questions.splice(questionIndex, 1);
    setInstance({ ...instance, questions });
  };

  const handleQuestionChange = (questionIndex, e) => {
    const { name, value } = e.target;
    const questions = [...instance.questions];
    questions[questionIndex][name] = value;
    questions[questionIndex].collection = '';
    questions[questionIndex].isSaved = false;
    setInstance({ ...instance, questions });
  };

  const handleQuestionCollectionChange = (questionIndex, e) => {
    const { value } = e.target;
    const questions = [...instance.questions];
    questions[questionIndex].collection = value;
    questions[questionIndex].isSaved = false;
    setInstance({ ...instance, questions });
  };

  const handleAddQuestionToCollection = (questionIndex) => {
    const questions = [...instance.questions];
    const question = questions[questionIndex];
    const token = Cookies.get('token');
    if (
      !validateField('question-collection', question.collection, questionIndex) ||
      !validateField('question-saved', question.isSaved, questionIndex)
    ) {
      return;
    }
    addQuestionToCollection(question, question.collection, token)
      .then(() => {
        questions[questionIndex].isSaved = true;
        if (instance.samples.some((sample) => sample.collectionName === question.collection)) {
          questions.splice(questionIndex, 1);
        }
        setInstance({ ...instance, questions });
        setErrors((prevErrors) => ({ ...prevErrors, submit: '' }));
      })
      .catch((error) => {
        setErrors((prevErrors) => ({ ...prevErrors, submit: error.message }));
      });
  };

  const handleQuestionTypeChange = (questionIndex, e) => {
    const { value } = e.target;
    const questions = [...instance.questions];
    const currentType = questions[questionIndex].type;
    if (currentType === 'matching' || value === 'matching') {
      questions[questionIndex].answers = [];
    } else {
      questions[questionIndex].answers = questions[questionIndex].answers.map((answer) => ({
        ...answer,
        isCorrect: false,
      }));
    }
    questions[questionIndex].type = value;
    questions[questionIndex].collection = '';
    questions[questionIndex].isSaved = false;
    setInstance({ ...instance, questions });
  };

  const handleAddAnswer = (questionIndex) => {
    const questions = [...instance.questions];
    const question = questions[questionIndex];
    const newAnswer =
      question.type === 'matching'
        ? { leftOption: '', rightOption: '' }
        : { content: '', isCorrect: false };
    question.answers.push(newAnswer);
    questions[questionIndex].collection = '';
    questions[questionIndex].isSaved = false;
    setInstance({ ...instance, questions });
  };

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    const questions = [...instance.questions];
    questions[questionIndex].answers.splice(answerIndex, 1);
    questions[questionIndex].collection = '';
    questions[questionIndex].isSaved = false;
    setInstance({ ...instance, questions });
  };

  // const handleImageChange = (questionIndex, e) => {
  //   const file = e.target.files[0];
  //   const questions = [...instance.questions];
  //   questions[questionIndex].image = URL.createObjectURL(file);
  //   questions[questionIndex].collection = '';
  //   questions[questionIndex].isSaved = false;
  //   setInstance({ ...instance, questions });
  // };
  //
  // const handleDeleteImage = (questionIndex) => {
  //   const questions = [...instance.questions];
  //   questions[questionIndex].image = null;
  //   questions[questionIndex].collection = '';
  //   questions[questionIndex].isSaved = false;
  //   setInstance({ ...instance, questions });
  //   fileInputRefs.current[questionIndex].value = '';
  // };

  const validateField = (key, value, index1 = -1, index2 = 0) => {
    let error = '';

    if (key === 'question-content' && !value) {
      error = 'Question content cannot be empty.';
    } else if (key === 'question-points' && (!value || value <= 0)) {
      error = 'Points must be greater than 0.';
    } else if (key === 'question-answer' && value.length < 1) {
      error = 'Answer text must be at least 1 character.';
    } else if (key === 'question-answer-right' && value.length < 1) {
      error = 'Right option text must be at least 1 character.';
    } else if (key === 'question-answer-left' && value.length < 1) {
      error = 'Left option text must be at least 1 character.';
    } else if (key === 'question-collection' && value === '') {
      error = 'Collection must be selected.';
    } else if (key === 'question-saved' && value === true) {
      error = 'Question is already saved.';
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [index1 !== -1 ? key + '-' + index1 + '-' + index2 : key]: error,
    }));
    return error === '';
  };

  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const { name, value } = e.target;
    const questions = [...instance.questions];
    const question = questions[questionIndex];
    if (question.type === 'single_choice' && name === 'isCorrect') {
      question.answers = question.answers.map((answer, index) => ({
        ...answer,
        isCorrect: index === answerIndex,
      }));
    } else {
      question.answers[answerIndex][name] = value;
    }
    question.collection = '';
    question.isSaved = false;
    setInstance({ ...instance, questions });
  };

  return (
    <div className="questions-container">
      {instance.questions.map((question, qIndex) => (
        <div className="question" key={qIndex}>
          <div className={'question-form ' + (question.isSaved ? ' border-saved' : '')}>
            {collections && (
              <div className="question__collection">
                <label>{t('create_page.questionForm.saveToCollection')}:</label>
                <select
                  name="collection"
                  value={question.collection}
                  onChange={(e) => handleQuestionCollectionChange(qIndex, e)}>
                  <option value="">None</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.name}>
                      {collection.name}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => handleAddQuestionToCollection(qIndex)}>
                  {t('create_page.questionForm.buttons.saveToCollection')}
                </button>
                {errors[`question-collection-${qIndex}-0`] && (
                  <div className="error-message">{errors[`question-collection-${qIndex}-0`]}</div>
                )}
                {errors[`question-saved-${qIndex}-0`] && question.isSaved && (
                  <div className="error-message">{errors[`question-saved-${qIndex}-0`]}</div>
                )}
              </div>
            )}
            <div className="answer__controller">
              <div className="answer__controller--text">
                <input
                  type="text"
                  name="content"
                  placeholder={t('create_page.questionForm.textQuestion')}
                  value={question.content}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  onBlur={(e) => validateField('question-content', e.target.value, qIndex)}
                  className={errors[`question-content-${qIndex}`] ? 'error-border' : ''}
                />
                {errors[`question-content-${qIndex}-0`] && (
                  <div className="error-message">{errors[`question-content-${qIndex}-0`]}</div>
                )}
              </div>
              <div className="answer__controller--score">
                <input
                  type="text"
                  name="points"
                  placeholder={t('create_page.questionForm.points')}
                  value={question.points}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  onBlur={(e) => validateField('question-points', e.target.value, qIndex)}
                  className={errors[`question-points-${qIndex}`] ? 'error-border' : ''}
                />
                {errors[`question-points-${qIndex}-0`] && (
                  <div className="error-message">{errors[`question-points-${qIndex}-0`]}</div>
                )}
              </div>
              <div className="answer__controller--type">
                <select
                  name="type"
                  value={question.type}
                  onChange={(e) => handleQuestionTypeChange(qIndex, e)}>
                  <option value="multiple_choices">
                    {t('create_page.questionForm.option.multipleChoices')}
                  </option>
                  <option value="single_choice">
                    {t('create_page.questionForm.option.singleChoice')}
                  </option>
                  <option value="matching">{t('create_page.questionForm.option.matching')}</option>
                  <option value="essay">{t('create_page.questionForm.option.essay')}</option>
                </select>
              </div>
            </div>
            {/*<div className="image-upload">*/}
            {/*  {!question.image && (*/}
            {/*    <label htmlFor={`file-input-${qIndex}`} className="answer-add">*/}
            {/*      {t('create_page.questionForm.buttons.addImage')}*/}
            {/*    </label>*/}
            {/*  )}*/}
            {/*  <input*/}
            {/*    type="file"*/}
            {/*    accept="image/*"*/}
            {/*    id={`file-input-${qIndex}`}*/}
            {/*    ref={(el) => (fileInputRefs.current[qIndex] = el)}*/}
            {/*    onChange={(e) => handleImageChange(qIndex, e)}*/}
            {/*    style={{ display: 'none' }}*/}
            {/*  />*/}
            {/*  {question.image && (*/}
            {/*    <div className="image-preview">*/}
            {/*      <img src={question.image} alt="Question" />*/}
            {/*      <button type="button" onClick={() => handleDeleteImage(qIndex)}>*/}
            {/*        <FaTimes />*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*</div>*/}
            {question.type !== 'essay' && (
              <button className="answer-add" onClick={() => handleAddAnswer(qIndex)}>
                {t('create_page.questionForm.buttons.addAnswer')}
              </button>
            )}
            <div className="answer-wrapper__container">
              {question.type === 'essay' ? (
                <div className="answer__essay">
                  <p>{t('create_page.questionForm.essayNotice')}</p>
                </div>
              ) : (
                question.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="answer-input">
                    {question.type === 'matching' ? (
                      <div className="answer-wrapper">
                        <div>
                          <input
                            type="text"
                            name="leftOption"
                            value={answer.leftOption}
                            placeholder={t('create_page.questionForm.textQuestion')}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                            onBlur={(e) =>
                              validateField('question-answer-left', e.target.value, qIndex, aIndex)
                            }
                            className={
                              errors[`question-answer-left-${qIndex}-${aIndex}`]
                                ? 'error-border'
                                : ''
                            }
                          />
                          {errors[`question-answer-left-${qIndex}-${aIndex}`] && (
                            <div className="error-message">
                              {errors[`question-answer-left-${qIndex}-${aIndex}`]}
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="rightOption"
                            value={answer.rightOption}
                            placeholder={t('create_page.questionForm.textAnswer')}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                            onBlur={(e) =>
                              validateField('question-answer-right', e.target.value, qIndex, aIndex)
                            }
                            className={
                              errors[`question-answer-right-${qIndex}-${aIndex}`]
                                ? 'error-border'
                                : ''
                            }
                          />
                          {errors[`question-answer-right-${qIndex}-${aIndex}`] && (
                            <div className="error-message">
                              {errors[`question-answer-right-${qIndex}-${aIndex}`]}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="answer-delete"
                          onClick={() => handleDeleteAnswer(qIndex, aIndex)}>
                          <img src={Trash} alt="delete" />
                        </button>
                      </div>
                    ) : (
                      <div className="answer-wrapper">
                        <div className="answer-wrapper__choice">
                          <div>
                            {question.type === 'single_choice' ? (
                              <input
                                type="radio"
                                name={`isCorrect-${qIndex}`}
                                checked={answer.isCorrect}
                                onChange={(e) =>
                                  handleAnswerChange(qIndex, aIndex, {
                                    target: {
                                      name: 'isCorrect',
                                      value: e.target.checked,
                                    },
                                  })
                                }
                              />
                            ) : (
                              <input
                                type="checkbox"
                                name="isCorrect"
                                checked={answer.isCorrect}
                                onChange={(e) =>
                                  handleAnswerChange(qIndex, aIndex, {
                                    target: {
                                      name: 'isCorrect',
                                      value: e.target.checked,
                                    },
                                  })
                                }
                              />
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              name="content"
                              placeholder={t('create_page.questionForm.textAnswer')}
                              value={answer.content}
                              onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                              onBlur={(e) =>
                                validateField('question-answer', e.target.value, qIndex, aIndex)
                              }
                              className={
                                errors[`question-answer-${qIndex}-${aIndex}`] ? 'error-border' : ''
                              }
                            />
                            {errors[`question-answer-${qIndex}-${aIndex}`] && (
                              <div className="error-message">
                                {errors[`question-answer-${qIndex}-${aIndex}`]}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="answer-delete"
                          onClick={() => handleDeleteAnswer(qIndex, aIndex)}>
                          <img src={Trash} alt="delete" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <button className="questions-delete" onClick={() => handleDeleteQuestion(qIndex)}>
              <img src={Trash} alt="delete" />
              {t('create_page.questionForm.buttons.remove')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Questions;
