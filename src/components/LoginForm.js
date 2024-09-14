import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Forms.css'; // Réutilisation du fichier CSS pour le style

const LoginForm = () => {
  // Utilisation de useState pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    pass_phrase: '', // Stocke le mot de passe
    photo: null, // Stocke la photo capturée
  });

  // Gestion des états pour les messages, le popup, et l'état de chargement
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showTakePhoto, setShowTakePhoto] = useState(false); // État pour afficher le bouton "Prendre une photo"
  
  // Utilisation de useNavigate pour rediriger après une connexion réussie
  const navigate = useNavigate();

  // Références DOM pour accéder aux éléments vidéo et canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Gestion des changements de champ du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Mise à jour dynamique des champs
    });
  };

  // Fonction pour capturer le flux vidéo de la caméra
  const handleCapture = () => {
    const constraints = {
      video: true, // Demander l'accès à la caméra pour capturer de la vidéo
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // Attacher le flux vidéo à l'élément vidéo et le démarrer
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Lancer le flux vidéo
        setShowTakePhoto(true); // Afficher le bouton "Prendre une photo"
      })
      .catch((error) => {
        console.error('Error accessing camera: ', error); // Gérer les erreurs d'accès à la caméra
      });
  };

  // Fonction pour capturer une image de la vidéo et la stocker dans formData
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    // Ajuster la taille du canvas à celle de la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image actuelle de la vidéo sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir le contenu du canvas en blob (format PNG) et le stocker dans formData
    canvas.toBlob((blob) => {
      setFormData({
        ...formData,
        photo: blob, // Stocker la photo dans formData
      });
    }, 'image/png');
  };

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
    setShowLoading(true); // Afficher l'état de chargement

    // Créer un objet FormData pour envoyer les données du formulaire
    const form = new FormData();
    form.append('pass_phrase', formData.pass_phrase); // Ajouter le mot de passe
    if (formData.photo) {
      form.append('photo', formData.photo); // Ajouter la photo si disponible
    }

    try {
      // Envoyer les données au serveur pour authentification
      const response = await fetch('http://127.0.0.1:8000/authenticate', {
        method: 'POST',
        body: form, // Envoyer le FormData
      });

      const result = await response.text(); // Lire la réponse du serveur
      setMessage(result); // Mettre à jour le message à afficher

      if (response.status === 200) {
        if (result !== "Wrong passphrase") {
          // Si le mot de passe est correct, stocker le nom d'utilisateur et rediriger
          localStorage.setItem('username', result);
          setShowPopup(true); // Afficher un popup de succès
          setTimeout(() => {
            navigate(`/welcome/${result}`); // Rediriger vers la page d'accueil après 2 secondes
          }, 2000);
        } else {
          setShowPopup(true); // Afficher le popup en cas de mauvais mot de passe
        }
      } else {
        setShowPopup(true); // Afficher le popup en cas d'échec de la requête
      }
    } catch (error) {
      console.error('Error:', error); // Gérer les erreurs réseau ou serveur
      setMessage('An error occurred'); // Afficher un message d'erreur
    } finally {
      setShowLoading(false); // Masquer le chargement une fois terminé
    }
  };

  return (
    <div className="main-container">
      <div className="left-side">
        {/* Logo et description de la structure */}
        <img src="/images/3dsm.png" alt="3D SMART FACTORY" className="logo" />
        <p className="mantra">Une structure mixte qui va de la recherche à la création des activités socio-économiques en créant des Startups de différents domaines</p>
      </div>
      <div className="right-side">
        {/* Carte du formulaire de connexion */}
        <div className="form-card">
          <h2>Connexion</h2>
          <form onSubmit={handleSubmit}>
            {/* Champ pour le mot de passe */}
            <input
              type="password"
              name="pass_phrase"
              placeholder="Mot de passe"
              value={formData.pass_phrase}
              onChange={handleChange}
              required
            />
            {/* Bouton pour ouvrir la caméra */}
            <button type="button" onClick={handleCapture}>Ouvrir la caméra</button>
            {/* Afficher le bouton "Prendre une photo" lorsque la caméra est activée */}
            {showTakePhoto && (
              <button type="button" onClick={takePhoto}>Prendre une photo</button>
            )}
            {/* Bouton pour soumettre le formulaire */}
            <button type="submit">Connexion</button>
          </form>

          {/* Popup de chargement */}
          {showLoading && (
            <div className="loading-popup">
              <p>Traitement en cours, veuillez patienter...</p>
            </div>
          )}

          {/* Popup d'information (succès ou erreur) */}
          {showPopup && (
            <div className="message-popup">
              <p>{message}</p>
              <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
            </div>
          )}

          {/* Élément vidéo et canvas pour capturer une photo */}
          <video ref={videoRef} style={{ width: '100%', height: 'auto', marginTop: '20px' }}></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          <p>
            Vous n'avez pas de compte ? <Link to="/register">S'inscrire ici</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
