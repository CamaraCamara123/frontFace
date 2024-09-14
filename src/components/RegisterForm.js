import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Forms.css'; // Import the CSS file for styling

const RegisterForm = () => {
  // Utilisation de useState pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    pass_phrase: '',
    photo: null, // Stocker la photo capturée
  });

  // State pour gérer les messages d'information, le popup, et l'état de chargement
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showTakePhoto, setShowTakePhoto] = useState(false); // État pour afficher le bouton "Prendre une photo"
  
  // Utilisation de useNavigate pour la redirection après l'inscription
  const navigate = useNavigate();

  // Utilisation de useRef pour accéder au DOM de la vidéo, du canvas et du flux vidéo
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // Stocker le flux de la caméra pour le stopper plus tard

  // Gestion des changements de formulaire pour mettre à jour les données utilisateur
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Mise à jour des champs dynamiquement
    });
  };

  // Fonction pour capturer le flux vidéo de la caméra
  const handleCapture = () => {
    const constraints = {
      video: true, // Demande un flux vidéo de l'utilisateur
    };

    // Demande l'accès à la caméra de l'utilisateur
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        streamRef.current = stream; // Stocker le flux pour l'arrêter plus tard
        videoRef.current.srcObject = stream; // Attacher le flux vidéo à l'élément vidéo
        videoRef.current.play(); // Jouer le flux vidéo
        setShowTakePhoto(true); // Afficher le bouton "Prendre une photo"
      })
      .catch((error) => {
        console.error('Error accessing camera: ', error);
      });
  };

  // Fonction pour prendre une photo et la stocker sous forme de blob
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    // Définir la taille du canvas pour correspondre à celle de la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image actuelle de la vidéo sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir l'image du canvas en un blob (format PNG)
    canvas.toBlob((blob) => {
      setFormData({
        ...formData,
        photo: blob, // Mettre à jour les données du formulaire avec la photo capturée
      });
    }, 'image/png');

    // Stopper la caméra une fois la photo prise
    streamRef.current.getTracks().forEach(track => track.stop());
  };

  // Fonction pour soumettre le formulaire d'inscription
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page lors de la soumission
    setShowLoading(true); // Afficher le message de chargement

    // Créer un objet FormData pour envoyer les données du formulaire en multipart/form-data
    const form = new FormData();
    form.append('first_name', formData.first_name);
    form.append('last_name', formData.last_name);
    form.append('username', formData.username);
    form.append('pass_phrase', formData.pass_phrase);
    if (formData.photo) {
      form.append('photo', formData.photo); // Ajouter la photo si elle est disponible
    }

    try {
      // Envoyer les données au serveur via une requête POST
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        body: form, // Envoyer le FormData
      });

      const text = await response.text(); // Lire la réponse du serveur sous forme de texte
      setMessage(text); // Mettre à jour le message à afficher

      if (response.ok) {
        setShowPopup(true); // Afficher un popup en cas de succès
        setTimeout(() => {
          navigate('/login'); // Rediriger vers la page de connexion après 2 secondes
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred'); // Message d'erreur en cas de problème
    } finally {
      setShowLoading(false); // Masquer le message de chargement une fois terminé
    }
  };

  return (
    <div className="main-container">
      <div className="left-side">
        {/* Section gauche avec le logo et la description */}
        <img src="/images/3dsm.png" alt="3D SMART FACTORY" className="logo" />
        <p className="mantra">Une structure mixte qui va de la recherche à la création des activités socio-économiques en créant des Startups de différents domaines</p>
      </div>
      <div className="right-side">
        {/* Section droite avec le formulaire d'inscription */}
        <div className="form-card">
          <h2>S'inscrire</h2>
          <form onSubmit={handleSubmit}>
            {/* Champs du formulaire pour les informations utilisateur */}
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
            {/* Bouton pour ouvrir la caméra */}
            <button type="button" onClick={handleCapture}>Ouvrir la caméra</button>
            {/* Afficher le bouton "Prendre une photo" lorsque la caméra est active */}
            {showTakePhoto && (
              <button type="button" onClick={takePhoto}>Prendre une photo</button>
            )}
            {/* Bouton pour soumettre le formulaire */}
            <button type="submit">S'inscrire</button>
          </form>

          {/* Popup de chargement */}
          {showLoading && (
            <div className="loading-popup">
              <p>Traitement en cours, veuillez patienter...</p>
            </div>
          )}

          {/* Popup de succès */}
          {showPopup && (
            <div className="message-popup">
              <p>{message}</p>
              <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
            </div>
          )}

          {/* Élément vidéo et canvas pour capturer la photo */}
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
