import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import { getTestById } from '../utils/http';
import { SERVER_IP, SERVER_PORT, WS_PROTOCOL } from '../utils/constraints';
import { Client } from '@stomp/stompjs';
import TestPreview from '../components/TestPreview';
import Question from '../components/Question';
import Cookies from 'js-cookie';
import TestReview from '../components/TestReview';

function Test() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [testSession, setTestSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const [message, setMessage] = useState(null);
  const [isAlive, setIsAlive] = useState(true);
  const isAliveRef = useRef(true);

  const onTestSessionMessageReceived = (message) => {
    const { type, content, question, testSession } = JSON.parse(message.body);
    console.log(content);
    switch (type) {
      case 'START':
        setIsStarted(true);
        setTestSession(testSession);
        enterFullscreen();
        handleNextQuestion();
        break;
      case 'SAVE_ANSWER':
        setTestSession(testSession);
        if (testSession.currentQuestionIndex <= test.questionsCount - 1) {
          handleNextQuestion();
        } else {
          handleFinishTest();
        }
        break;
      case 'NEXT_QUESTION':
        setQuestion(question);
        setTestSession(testSession);
        break;
      case 'FINISH':
        setIsStarted(false);
        setIsFinished(true);
        setTestSession(testSession);
        break;
      case 'HEALTHCHECK':
        setIsAlive(true);
        break;
      default:
        break;
    }
  };

  const onErrorMessageReceived = (message) => {
    const data = JSON.parse(message.body);
    console.log(data.message);
    setMessage(data.message);
  };

  useEffect(() => {
    getTestById(id)
    .then((data) => {
      setTest(data);
      const client = new Client({
        brokerURL: WS_PROTOCOL + SERVER_IP + SERVER_PORT + '/ws',
        onConnect: () => {
          console.log('WebSocket client connected');
          setIsConnected(true);
        },
        onStompError: () => {
          console.log('Failed to connect WebSocket client');
          setIsConnected(false);
        },
      });
      client.activate();
      setClient(client);
      return () => {
        client.deactivate().then(() => console.log('WebSocket client disconnected'));
        setClient(null);
        setIsConnected(false);
      };
    })
    .catch((error) => setError({ message: error.message || 'An error occurred' }));
    setMessage(null);
  }, [id]);

  useEffect(() => {
    if (client && isConnected && credentials) {
      const errorSubscription = client.subscribe(
          `/user/${credentials}/queue/errors`,
          onErrorMessageReceived,
      );
      const testSessionSubscription = client.subscribe(
          `/user/${credentials}/queue/testSession`,
          onTestSessionMessageReceived,
      );
      const studentGroup = credentials.split(':')[0];
      const studentName = credentials.split(':')[1];
      try {
        client.publish({
          destination: `/api/v1/tests/${id}/start`,
          headers: {
            credentials: credentials,
          },
          body: JSON.stringify({
            studentGroup: studentGroup,
            studentName: studentName,
          }),
        });
      } catch (error) {
        console.log('Error starting test (no connection)');
      }
      return () => {
        errorSubscription.unsubscribe();
        testSessionSubscription.unsubscribe();
      };
    }
  }, [client, isConnected, credentials, id]);

  useEffect(() => {
    isAliveRef.current = isAlive;
  }, [isAlive]);

  useEffect(() => {
    if (client && isConnected) {
      const interval = setInterval(() => {
        console.log('Ping. Checking connection...');
        if (!isAliveRef.current) {
          client.deactivate().then(() => console.log('WebSocket client disconnected'));
          setClient(null);
          setIsConnected(false);
        } else {
          setIsAlive(false);
          handleHealthcheck();
        }
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [client, isConnected, credentials, id]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE/Edge
      elem.msRequestFullscreen();
    }
  };

  useEffect(() => {
    if (test) {
      document.title = test.name;
    }
  }, [test]);

  window.onbeforeunload = function (e) {
    e = e || window.event;
    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = 'Are you sure you want to leave? Your test will be finished.';
    }
    // For Safari
    return 'Are you sure you want to leave? Your test will be finished.';
  };

  const handleStartTest = (studentGroup, studentName) => {
    if (!client || !isConnected) {
      return; // handle error in a better way
    }
    if (!studentGroup || !studentName) {
      return; // handle error in a better way
    }
    setCredentials(`${studentGroup}:${studentName}`);
    Cookies.set('group', studentGroup);
    Cookies.set('name', studentName);
  };

  const handleHealthcheck = () => {
    if (!client || !isConnected) {
      return; // handle error in a better way
    }
    try {
      client.publish({
        destination: `/api/v1/tests/${id}/healthcheck`,
        headers: {
          credentials: credentials,
        },
      });
    } catch (error) {
      console.log('Error health check (no connection)');
    }
  }

  const handleNextQuestion = () => {
    if (!client || !isConnected) {
      return; // handle error in a better way
    }
    try {
      client.publish({
        destination: `/api/v1/tests/${id}/nextQuestion`,
        headers: {
          credentials: credentials,
        },
      });
    } catch (error) {
      console.log('Error getting next question (no connection)');
    }
  };

  const handleSaveAnswer = (answers) => {
    if (!client || !isConnected) {
      return; // handle error in a better way
    }
    try {
      client.publish({
        destination: `/api/v1/tests/${id}/saveAnswer`,
        headers: {
          credentials: credentials,
        },
        body: JSON.stringify({
          answerIds: answers,
        }),
      });
    } catch (error) {
      console.log('Error saving answer (no connection)');
    }
  };

  const handleFinishTest = () => {
    if (!client || !isConnected) {
      return; // handle error in a better way
    }
    try {
      client.publish({
        destination: `/api/v1/tests/${id}/finish`,
        headers: {
          credentials: credentials,
        },
      });
    } catch (error) {
      console.log('Error finishing test (no connection)');
    }
  };

  if (error) {
    return <div>{error.message}</div>; // handle error in a better way
  } else if (!test) {
    return <div>Loading...</div>;
  }

  if (!isStarted && !isFinished) {
    return <TestPreview message={message} test={test} handleStartTest={handleStartTest} />;
  }

  if (isStarted && !isFinished) {
    return (
        <Question
            test={test}
            handleSaveAnswer={handleSaveAnswer}
            handleFinishTest={handleFinishTest}
            testSession={testSession}
            question={question}
            error={message}
            clearError={() => setMessage(null)}
        />
    );
  }

  if (!isStarted && isFinished) {
    return <TestReview testSession={testSession} />;
  }
}

export default Test;
