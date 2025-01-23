import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../utils/http';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import human from '../assets/icons/human.svg';
import emailIcon from '../assets/icons/email.svg';
import passwordIcon from '../assets/icons/password.svg';
import { CLIENT_PATH } from '../utils/constraints';

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/tests');
    }
  }, [navigate]);

  console.log(CLIENT_PATH);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setErrorMessage('Passwords do not match');
      return;
    }
    register({
      email,
      firstName,
      lastName,
      password,
    });
  };

  return (
    <form onSubmit={onSubmit} className="container__center">
      <div className="login">
        <div className="login__title">
          <h1>KPI FICTING</h1>
        </div>
        <div className="login__fields">
          <div className="login__field">
            <div className="login__img">
              <img src={emailIcon} alt="Email" />
            </div>
            <input
              value={email}
              type="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
              placeholder="Email"
              className="login__input"
            />
          </div>
          <div className="login__field">
            <div className="login__img">
              <img src={human} alt="human" />
            </div>
            <input
              value={firstName}
              type="text"
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
              required
              placeholder="First name"
              className="login__input"
            />
          </div>
          <div className="login__field">
            <div className="login__img">
              <img src={human} alt="human" />
            </div>
            <input
              value={lastName}
              type="text"
              onChange={(event) => {
                setLastName(event.target.value);
              }}
              required
              placeholder="Last name"
              className="login__input"
            />
          </div>
          <div className="login__field">
            <div className="login__img">
              <img src={passwordIcon} alt="password" />
            </div>
            <input
              value={password}
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Password"
              className="login__input"
            />
          </div>
          <div className="login__field">
            <div className="login__img">
              <img src={passwordIcon} alt="password" />
            </div>
            <input
              value={passwordConfirmation}
              type="password"
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              required
              placeholder="Repeat password"
              className="login__input"
            />
          </div>
        </div>
        <button type="submit" className="login__button">
          Register
        </button>
        <Link title="Login" to="/" className="login__link">
          Do you already have an account?
        </Link>
        {errorMessage && <div className="login__error">{errorMessage}</div>}
      </div>
    </form>
  );
}

export default Register;
