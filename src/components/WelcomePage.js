import React from 'react';
import '../styles/WelcomePage.css';

const WelcomePage = () => {

  let username = localStorage.getItem("username")
  return (
    <div className="welcome-container">
      <h1>Welcome, {username}!</h1>
    </div>
  );
};

export default WelcomePage;
