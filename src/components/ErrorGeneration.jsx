import React from 'react';
import stiker from '../assets/sticker.webp';

function ErrorGeneration() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center' }}>
        <img src={stiker} alt="Sad smile" style={{ width: '170px', height: '170px' }} />
        <h2>Ой, чомусь сталася помилка!</h2>
        <p>Спробуйте перезавантажити сторінку та перевірити інтернет з'єднання.</p>
      </div>
    </div>
  );
}

export default ErrorGeneration;
