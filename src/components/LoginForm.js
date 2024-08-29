import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    pass_phrase: '',
    photo: null,
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('pass_phrase', formData.pass_phrase);
    if (formData.photo) {
      form.append('photo', formData.photo);
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/authenticate', {
          method: 'POST',
          body: form,
        });

        console.log("Response status:", response.status);

        if (response.status === 200) {
            const username = await response.text(); // Directly use the response as the username
            navigate(`/welcome/${username}`);
          } else {
            setMessage("Login failed");
          }
      } catch (error) {
        setMessage("An error occurred");
      }   
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="pass_phrase"
          placeholder="Pass Phrase"
          value={formData.pass_phrase}
          onChange={handleChange}
          required
        />
        <input type="file" name="photo" onChange={handleFileChange} required />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginForm;
