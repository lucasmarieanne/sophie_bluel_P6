// login.js

const API_LOGIN = 'http://localhost:5678/api/users/login';

const loginform = document.getElementById('contact-form');

loginform.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = "sophie.bluel@test.tld";
  const password = "S0phie";
  const errMsgEl = document.getElementById('error-message');

  // Reset
  errMsgEl.style.display = 'none';
  errMsgEl.textContent   = '';

  try {
    const resp = await fetch(API_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!resp.ok) {
      throw new Error('401');
    }

    const data = await resp.json();
    const { token } = data;

    // On stocke le token ET le rôle
    localStorage.setItem('authToken', token);

    window.location.href = 'index.html';

  } catch (err) {
    errMsgEl.textContent = 'Erreur dans l’identifiant ou le mot de passe';
    errMsgEl.style.display = 'block';
  }
});