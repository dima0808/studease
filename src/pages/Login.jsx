import React, { useEffect, useRef } from 'react';
import { login } from '../utils/http';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import human from '../assets/icons/human.svg';
import password from '../assets/icons/password.svg';
import {CLIENT_PATH} from "../utils/constraints";

function Login() {
  const navigate = useNavigate();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/tests');
    }
  }, [navigate]);

  console.log(CLIENT_PATH);

  return (
    <div className="container__center">
      <div className="login">
        <div className="login__title">
          <h1>KPI FICTING</h1>
        </div>
        <div className="login__fields">
          <div className="login__field">
            <div className="login__img">
              <img src={human} alt="human" />
            </div>
            <input
              ref={usernameRef}
              type="text"
              placeholder="Username"
              className="login__input"
            />
          </div>
          <div className="login__field">
            <div className="login__img">
              <img src={password} alt="password" />
            </div>
            <input
              ref={passwordRef}
              type="password"
              placeholder="Password"
              className="login__input"
            />
          </div>
        </div>
        <button
          onClick={() => {
            login({
              username: usernameRef.current?.value,
              password: passwordRef.current?.value,
            })
              .then((response) => {
                Cookies.set('token', response.token);
                navigate('/tests');
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          }}
          className="login__button">
          Login
        </button>
        {errorMessage && <div className="login__error">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default Login;
