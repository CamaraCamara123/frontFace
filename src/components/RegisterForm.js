import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Forms.css'; // Import the CSS file

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    pass_phrase: '',
    photo: null,
  });

  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showTakePhoto, setShowTakePhoto] = useState(false);
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // Store the camera stream to stop it later

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCapture = () => {
    const constraints = {
      video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // Attach the video stream to the video element and autoplay.
        streamRef.current = stream; // Store the stream for later stopping
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setShowTakePhoto(true); // Show the "Take Photo" button
      })
      .catch((error) => {
        console.error('Error accessing camera: ', error);
      });
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    // Set the canvas size to match the video size.
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video onto the canvas.
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a blob and store it in the formData.
    canvas.toBlob((blob) => {
      setFormData({
        ...formData,
        photo: blob,
      });
    }, 'image/png');

    // Stop the camera after taking the photo
    streamRef.current.getTracks().forEach(track => track.stop());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);

    const form = new FormData();
    form.append('first_name', formData.first_name);
    form.append('last_name', formData.last_name);
    form.append('username', formData.username);
    form.append('pass_phrase', formData.pass_phrase);
    if (formData.photo) {
      form.append('photo', formData.photo);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        body: form,
      });

      const text = await response.text();
      setMessage(text);

      if (response.ok) {
        setShowPopup(true); // Show success popup
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after 2 seconds
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="left-side">
        <img src="/images/3dsm.png" alt="3D SMART FACTORY" className="logo" />
        <p className="mantra">Une structure mixte qui va de la recherche à la création des activités socio-économiques en créant des Startups de différents domaines</p>
      </div>
      <div className="right-side">
        <div className="form-card">
          <h2>S'inscrire</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="first_name"
              placeholder="Prénom"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Nom"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="pass_phrase"
              placeholder="Mot de Passe"
              value={formData.pass_phrase}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleCapture}>Ouvrir la caméra</button>
            {showTakePhoto && (
              <button type="button" onClick={takePhoto}>Prendre une photo</button>
            )}
            <button type="submit">S'inscrire</button>
          </form>

          {/* Loading Popup */}
          {showLoading && (
            <div className="loading-popup">
              <p>Traitement en cours, veuillez patienter...</p>
            </div>
          )}

          {/* Success Popup */}
          {showPopup && (
            <div className="message-popup">
              <p>{message}</p>
              <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
            </div>
          )}

          {/* Video and Canvas for capturing photo */}
          <video ref={videoRef} style={{ width: '100%', marginTop: '20px' }}></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          <p>
          Vous avez déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
