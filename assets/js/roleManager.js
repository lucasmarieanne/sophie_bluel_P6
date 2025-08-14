document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const filters = document.getElementById('filters');

  if (token) {
    // Affiche toutes les sections réservées à l'admin
    document.querySelectorAll('.admin-section').forEach(el => {
      el.style.display = 'block';
    });

    // Cache le lien login
    if (loginLink) loginLink.style.display = 'none';

    // Affiche le lien logout
    if (logoutLink) logoutLink.style.display = 'list-item';

    // Cache le bloc des filtres
    if (filters) filters.style.display = 'none';

  } else {
    // Si on n’est pas admin : on montre les filtres
    if (filters) filters.style.display = 'flex';
  }

  // Gérer le clic sur "logout"
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('authToken');
      window.location.href = 'index.html'; // ou 'login.html'
    });
  }
});
