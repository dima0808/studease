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
import { useTranslation } from 'react-i18next';

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

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
      setErrorMessage(t('register_page.errorMessage'));
      return;
    }
    register({
      email,
      firstName,
      lastName,
      password,
    })
      .then((response) => {
        Cookies.set('token', response.token);
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setPasswordConfirmation('');
        navigate('/tests');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <form onSubmit={onSubmit} className="container__center">
      <div className="login">
        <div className="login__title">
          <h1>StudEase</h1>
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
              placeholder={t('register_page.email')}
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
              placeholder={t('register_page.firstName')}
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
              placeholder={t('register_page.lastName')}
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
              placeholder={t('register_page.password')}
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
              placeholder={t('register_page.passwordConfirmation')}
              className="login__input"
            />
          </div>
        </div>
        <button type="submit" className="login__button">
          {t('register_page.btnSubmit')}
        </button>
        <Link title="Login" to="/" className="login__link">
          {t('register_page.loginLink')}
        </Link>
        {errorMessage && <div className="login__error">{errorMessage}</div>}
      </div>
    </form>
  );
}

export default Register;
