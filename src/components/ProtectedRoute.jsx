import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import stiker from '../assets/sticker.webp';

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  if (!token) {
    return (
      <div className="container__center">
        <div style={{ textAlign: 'center' }}>
          <img src={stiker} alt="Sad smile" style={{ width: '170px', height: '170px' }} />
          <h1>403 - Ой, щось пішло не так!</h1>
          <p>Ви не маєте доступу до цієї сторінки.</p>
          <p>
            Будь ласка,{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/')}>
              увійдіть
            </span>
            , щоб продовжити.
          </p>
        </div>
      </div>
    );
  }
  return element;
};

export default ProtectedRoute;
