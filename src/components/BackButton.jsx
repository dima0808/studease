import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function BackButton() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button className="back-button" onClick={handleGoBack}>
      <FaArrowLeft size={24} />
    </button>
  );
}

export default BackButton;
