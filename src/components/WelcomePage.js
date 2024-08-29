import React from 'react';
import './WelcomePage.css';

const WelcomePage = ({ username }) => {
  return (
    <div className="welcome-container">
      <h1>Welcome, {username}!</h1>
    </div>
  );
};

export default WelcomePage;
