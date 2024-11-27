import React, { useState, useEffect, useRef } from 'react';

// Функція для перемішування масиву (алгоритм Фішера-Йейтса)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // міняємо місцями елементи
  }
  return newArray;
};

function MatchPairs({ answers, setSelectedAnswers }) {
  const leftOptions = [...new Set(answers.map((answer) => answer.leftOption))];
  const rightOptions = shuffleArray([...new Set(answers.map((answer) => answer.rightOption))]); // Перемішуємо праві варіанти

  const [matchedAnswers, setMatchedAnswers] = useState(Array(leftOptions.length).fill(''));
  const [availableAnswers, setAvailableAnswers] = useState(rightOptions); // Масив доступних відповідей
  const chosenRightOptionsRef = useRef([]);
  const rightOptionsRef = useRef([]);
  const leftOptionsRef = useRef([]);

  const handleDragStart = (event, text) => {
    event.dataTransfer.setData('text/plain', text);
  };

  const handleDrop = (event, index) => {
    const text = event.dataTransfer.getData('text/plain');

    setMatchedAnswers((prev) => {
      const newAnswers = [...prev];

      // Якщо в полі вже є відповідь, повертаємо її назад в список доступних
      if (newAnswers[index] !== '') {
        setAvailableAnswers((prevAnswers) => [...prevAnswers, newAnswers[index]]);
      }

      // Вставляємо нову відповідь у поле
      newAnswers[index] = text;
      return newAnswers;
    });

    // Видаляємо відповідь з доступних
    setAvailableAnswers((prev) => prev.filter((answer) => answer !== text));

    event.preventDefault();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleAnswerClick = (index) => {
    const answer = matchedAnswers[index];
    if (answer) {
      // Повертаємо відповідь назад в список доступних
      setMatchedAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[index] = ''; // Очищаємо поле
        return newAnswers;
      });
      setAvailableAnswers((prev) => [...prev, answer]); // Додаємо відповідь назад до доступних
    }
  };

  useEffect(() => {
    setMatchedAnswers(Array(leftOptions.length).fill('')); // Очищаємо всі поля
    setAvailableAnswers(rightOptions); // Перемішуємо варіанти
  }, [answers]);

  useEffect(() => {
    chosenRightOptionsRef.current.forEach((ref) => resizeText(ref));
    leftOptionsRef.current.forEach((ref) => resizeText(ref));
    rightOptionsRef.current.forEach((ref) => resizeText(ref));

    setSelectedAnswers(() => {
      const newSelectedAnswers = [];
      matchedAnswers.forEach((selectedRightOption, index) => {
        if (selectedRightOption !== '') {
          const answer = answers.find(
            (answer) =>
              answer.leftOption === leftOptions[index] &&
              answer.rightOption === selectedRightOption,
          );

          if (answer) {
            newSelectedAnswers.push(answer.id);
          }
        }
      });
      return newSelectedAnswers;
    });
  }, [answers, matchedAnswers, setSelectedAnswers]);

  const resizeText = (element) => {
    if (!element) return;

    let fontSize = 20;
    element.style.fontSize = `${fontSize}px`;

    while (
      (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) &&
      fontSize > 10
    ) {
      fontSize -= 1;
      element.style.fontSize = `${fontSize}px`;
    }
  };

  return (
    <div className="match-pairs">
      <div className="match__container">
        {leftOptions.map((left, index) => (
          <div className="match__question" key={index}>
            <div className="match__name" ref={(el) => (leftOptionsRef.current[index] = el)}>
              {left}
            </div>
            <div className="match__between"></div>
            <div
              className={`match__field ${matchedAnswers[index] ? 'filled' : ''}`}
              ref={(el) => (chosenRightOptionsRef.current[index] = el)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              onClick={() => handleAnswerClick(index)}
              title={matchedAnswers[index] ? 'Нажміть, аби прибрати відповідь' : ''}
              style={{ cursor: 'pointer' }}>
              {matchedAnswers[index]}
            </div>
          </div>
        ))}
      </div>
      <div className="match__list--answer">
        {availableAnswers.map((right, index) => (
          <div
            className="match__answer"
            draggable
            key={index}
            onDragStart={(e) => handleDragStart(e, right)}
            ref={(el) => (rightOptionsRef.current[index] = el)}
            title="Зажміть та перетяніть у поле для відповіді">
            {right}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchPairs;
