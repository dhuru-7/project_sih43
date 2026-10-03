import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/not-found.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Oops! Page Not Found · Setu';
  }, []);

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleReturnHome();
    }
  };

  return (
    <div className="not-found-wrapper">
      <div className="not-found-content">
        <div className="face-stage">
          <div className="face">
            <div className="band">
              <div className="red"></div>
              <div className="white"></div>
              <div className="blue"></div>
            </div>
            <div className="eyes"></div>
            <div className="dimples"></div>
            <div className="mouth"></div>
          </div>
        </div>

        <h1>Oops! Something went wrong!</h1>

        <div
          className="btn"
          role="button"
          tabIndex={0}
          onClick={handleReturnHome}
          onKeyDown={handleKeyDown}
        >
          Return to Home
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
