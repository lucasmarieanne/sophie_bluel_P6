document.getElementById('contact-form')
	.addEventListener('submit', function(e) {
	// Empêche le rechargement de la page
	e.preventDefault();

	// Si le formulaire est invalide, on laisse le navigateur afficher les messages HTML5
	if (!this.checkValidity()) {
	  return;
	}

	// Ici tu peux envoyer via Fetch vers ton back, ou simplement afficher un message
	alert('Merci pour votre message ! Nous revenons vers vous très vite.');
	
	// Réinitialise le formulaire
	this.reset();
	});