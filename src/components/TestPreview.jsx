import React, { useEffect, useRef, useState } from 'react';
import question from '../assets/icons/question.svg';
import score from '../assets/icons/score.svg';
import group from '../assets/icons/group.svg';
import human from '../assets/icons/human.svg';
import duration from '../assets/icons/duration.svg';
import Cookies from 'js-cookie';

function TestPreview({ test, handleStartTest, message }) {
  const studentGroupRef = useRef(null);
  const studentNameRef = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const group = Cookies.get('group');
    const name = Cookies.get('name');
    if (group && studentGroupRef.current) {
      studentGroupRef.current.value = group;
    }
    if (name && studentNameRef.current) {
      studentNameRef.current.value = name;
    }
  }, [test]);

  const validateForm = () => {
    const group = studentGroupRef.current?.value;
    const name = studentNameRef.current?.value;
    const newErrors = {};

    if (!group) {
      newErrors.group = 'Group is required.';
    }
    if (!name) {
      newErrors.name = 'Full name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const group = studentGroupRef.current?.value;
      const name = studentNameRef.current?.value;
      handleStartTest(group, name);
    }
  };

  const handleInputChange = (field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const formatDuration = (minutes) => {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;
    return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };

  return (
    <div className="container__center">
      <div className="test">
        <div className="test__info">
          <ul className="info__list">
            <li className="info__duration">
              <img src={duration} alt="duration" />
              <span>{formatDuration(test.minutesToComplete)}</span>
            </li>
            <li className="info__question">
              <img src={question} alt="question" />
              <span>{test.questionsCount} Questions</span>
            </li>
            <li className="info__score">
              <img src={score} alt="score" />
              <span>{test.maxScore} points</span>
            </li>
          </ul>
        </div>
        <h1 className="test__name">{test.name}</h1>
        <form className="test__form" onSubmit={handleSubmit}>
          <div className="test__fields">
            <div className="test__field">
              <img src={group} alt="group" />
              <input
                ref={studentGroupRef}
                type="text"
                placeholder="Група: IO-25"
                className={errors.group ? 'error-border' : ''}
                onChange={() => handleInputChange('group')}
              />
            </div>
            <div className="test__field">
              <img src={human} alt="human" className="test__numan" />
              <input
                ref={studentNameRef}
                type="text"
                placeholder="ПІБ: Іванов Іван Іванович"
                className={errors.name ? 'error-border' : ''}
                onChange={() => handleInputChange('name')}
              />
            </div>
          </div>
          <button type="submit" className="test__button">
            Take a test
          </button>
        </form>
        <div className="test__message">{message}</div>
      </div>
    </div>
  );
}

export default TestPreview;
