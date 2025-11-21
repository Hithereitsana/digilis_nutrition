// Gestion du formulaire d'inscription
document.addEventListener('DOMContentLoaded', function() {
  // Écouter les demandes de données depuis admin.html via BroadcastChannel
  try {
    const channel = new BroadcastChannel('inscriptions_channel');
    channel.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'request') {
        const stored = localStorage.getItem('inscriptions');
        if (stored) {
          try {
            const inscriptions = JSON.parse(stored);
            channel.postMessage({
              type: 'response',
              data: inscriptions
            });
            console.log('📤 Données envoyées en réponse à admin.html:', inscriptions.length, 'inscriptions');
          } catch(e) {
            console.error('Erreur lors de l\'envoi des données:', e);
          }
        }
      }
    });
  } catch(err) {
    console.log('BroadcastChannel non disponible');
  }
  
  const form = document.getElementById('inscriptionForm');
  const estEtudiantCheckbox = document.getElementById('estEtudiant');
  const etudesField = document.getElementById('etudesField');
  const niveauEtudesSelect = document.getElementById('niveauEtudes');
  const niveauEtudesAutre = document.getElementById('niveauEtudesAutre');
  const messageDiv = document.getElementById('message');

  // Afficher/masquer le champ niveau d'études selon le statut étudiant
  estEtudiantCheckbox.addEventListener('change', function() {
    if (this.checked) {
      etudesField.style.display = 'block';
      niveauEtudesSelect.setAttribute('required', 'required');
    } else {
      etudesField.style.display = 'none';
      niveauEtudesSelect.removeAttribute('required');
      niveauEtudesSelect.value = '';
      niveauEtudesAutre.style.display = 'none';
      niveauEtudesAutre.value = '';
    }
  });

  // Afficher le champ "Autre" si l'option "Autre" est sélectionnée
  niveauEtudesSelect.addEventListener('change', function() {
    if (this.value === 'Autre') {
      niveauEtudesAutre.style.display = 'block';
      niveauEtudesAutre.setAttribute('required', 'required');
    } else {
      niveauEtudesAutre.style.display = 'none';
      niveauEtudesAutre.removeAttribute('required');
      niveauEtudesAutre.value = '';
    }
  });

  // Gestion de la soumission du formulaire
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const estEtudiant = estEtudiantCheckbox.checked;
    
    let niveauEtudes = null;
    if (estEtudiant) {
      const niveau = niveauEtudesSelect.value;
      if (niveau === 'Autre') {
        niveauEtudes = niveauEtudesAutre.value.trim();
      } else {
        niveauEtudes = niveau;
      }
      
      if (!niveauEtudes) {
        showMessage('Veuillez renseigner votre niveau d\'études.', 'error');
        return;
      }
    }

    // Préparer les données
    const inscription = {
      nom: nom,
      prenom: prenom,
      email: email,
      telephone: telephone,
      estEtudiant: estEtudiant,
      niveauEtudes: niveauEtudes,
      dateInscription: new Date().toISOString()
    };

    try {
      // Sauvegarder l'inscription
      await sauvegarderInscription(inscription);
      
      // Afficher le message de succès
      showMessage('Inscription réussie ! Merci de votre participation.', 'success');
      
      // Sauvegarder aussi dans le fichier inscriptions.json si possible (via File System Access API ou téléchargement)
      try {
        const json = JSON.stringify(inscriptions, null, 2);
        // Télécharger le fichier pour que l'utilisateur puisse le mettre dans le dossier du projet
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inscriptions.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('📥 Fichier JSON téléchargé. Placez-le dans le dossier du projet pour que admin.html le charge automatiquement.');
      } catch(err) {
        console.log('Impossible de télécharger le JSON automatiquement');
      }
      
      // Réinitialiser le formulaire
      form.reset();
      etudesField.style.display = 'none';
      niveauEtudesSelect.removeAttribute('required');
      niveauEtudesAutre.style.display = 'none';
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      showMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.', 'error');
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    messageDiv.style.background = type === 'success' ? '#d1fae5' : '#fee2e2';
    messageDiv.style.color = type === 'success' ? '#065f46' : '#991b1b';
    messageDiv.style.border = `1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'}`;
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }

  async function sauvegarderInscription(inscription) {
    console.log('💾 Début de la sauvegarde...');
    console.log('📍 Protocole:', window.location.protocol);
    console.log('📍 URL:', window.location.href);
    
    // Charger les inscriptions existantes depuis localStorage
    let inscriptions = [];
    const stored = localStorage.getItem('inscriptions');
    console.log('📥 Données existantes dans localStorage:', stored ? 'OUI' : 'NON');
    
    if (stored) {
      try {
        inscriptions = JSON.parse(stored);
        console.log('✅ Données parsées. Nombre actuel:', inscriptions.length);
      } catch (e) {
        console.error('❌ Erreur lors du chargement des inscriptions:', e);
        // Si les données sont corrompues, on repart de zéro
        inscriptions = [];
      }
    }

    // Vérifier si l'email n'est pas déjà inscrit
    const emailExistant = inscriptions.find(i => i.email === inscription.email);
    if (emailExistant) {
      console.log('⚠️ Email déjà inscrit:', inscription.email);
      throw new Error('Cet email est déjà inscrit.');
    }

    // Ajouter la nouvelle inscription
    inscriptions.push(inscription);
    console.log('➕ Nouvelle inscription ajoutée. Total:', inscriptions.length);

    // Sauvegarder dans localStorage
    try {
      const jsonData = JSON.stringify(inscriptions);
      localStorage.setItem('inscriptions', jsonData);
      console.log('✅ localStorage.setItem() appelé');
      
      // Utiliser BroadcastChannel pour partager avec admin.html
      try {
        const channel = new BroadcastChannel('inscriptions_channel');
        channel.postMessage({
          type: 'update',
          data: inscriptions
        });
        console.log('📡 Données envoyées via BroadcastChannel');
        channel.close();
      } catch(err) {
        console.log('BroadcastChannel non disponible, on continue');
      }
      
      // Aussi sauvegarder dans sessionStorage pour partage entre onglets
      try {
        sessionStorage.setItem('inscriptions_sync', jsonData);
      } catch(err) {
        // SessionStorage peut ne pas être disponible, on continue
      }
      
      // Vérifier immédiatement que les données sont bien sauvegardées
      const verif = localStorage.getItem('inscriptions');
      if (verif) {
        const verifParsed = JSON.parse(verif);
        console.log('✅ Vérification OK -', verifParsed.length, 'inscription(s) dans localStorage');
      } else {
        console.error('❌ ERREUR CRITIQUE: Les données n\'ont pas été sauvegardées !');
        throw new Error('Impossible de sauvegarder les données. Vérifiez que le localStorage est activé.');
      }
    } catch (e) {
      console.error('❌ Erreur lors de la sauvegarde:', e);
      if (e.name === 'QuotaExceededError') {
        throw new Error('L\'espace de stockage est plein. Veuillez contacter l\'administrateur.');
      } else if (e.name === 'SecurityError') {
        throw new Error('Erreur de sécurité. Assurez-vous d\'utiliser le même protocole (file:// ou http://) pour toutes les pages.');
      } else {
        throw new Error('Erreur lors de la sauvegarde: ' + e.message);
      }
    }
  }
});

