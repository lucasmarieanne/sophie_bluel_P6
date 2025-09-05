// api.js

// L’URL de l’API qui renvoie les "works" (les œuvres / projets à afficher)
const API_URL = 'http://localhost:5678/api/works';

// Tableau où on stockera toutes les œuvres récupérées depuis l’API
let allWorks = [];   

// Filtre courant, par défaut "Tous"
let currentFilter = 'Tous';

// Quand le DOM est chargé, on lance deux fonctions :
// - fetchGallery() : récupère et affiche les œuvres
// - fetchAndRenderCategories() : récupère et affiche les catégories dans un <select>
document.addEventListener('DOMContentLoaded', () => {
  fetchGallery();
  fetchAndRenderCategories();
});


// ----- Récupération et affichage de la galerie -----
async function fetchGallery() {
  try {
    // Requête GET vers l’API
    const resp = await fetch(API_URL);

    // Si la réponse n’est pas "ok", on lève une erreur
    if (!resp.ok) throw new Error(`Statut ${resp.status}`);

    // On convertit la réponse JSON en objet JS
    allWorks = await resp.json();

    // On génère les filtres, la galerie principale et la galerie modale
    renderFilters(allWorks);
    renderGallery(allWorks);
    renderModalGallery(allWorks);

  } catch (err) {
    // En cas d’erreur API ou réseau
    console.error('Erreur API :', err);

    // On affiche un message d’erreur à la place de la galerie
    document.querySelector('.gallery').innerHTML =
      '<p>Impossible de charger la galerie.</p>';
  }
}


// ----- Génération des filtres -----
function renderFilters(works) {
  const filtersContainer = document.getElementById('filters');
  filtersContainer.innerHTML = '';  // On vide avant de recréer

  // 1) Construire la liste des catégories uniques
  // On extrait "category.name" de chaque œuvre et on utilise "Set" pour avoir des valeurs uniques
  const cats = ['Tous', 
    ...new Set(works.map(w => w.category.name))
  ];

  // 2) Pour chaque nom de catégorie, créer un bouton
  cats.forEach(catName => {
    const btn = document.createElement('button');
    btn.textContent = catName;
    btn.classList.add('filter-btn');

    // On marque comme actif le filtre courant
    if (catName === currentFilter) btn.classList.add('active');

    // Quand on clique sur un bouton de filtre :
    btn.addEventListener('click', () => {
      currentFilter = catName;

      // On met à jour l’état "active" des boutons
      document.querySelectorAll('.filter-btn')
        .forEach(b => b.classList.toggle('active', b.textContent === catName));

      // On filtre la galerie : soit "Tous", soit par catégorie
      const filtered = catName === 'Tous'
        ? allWorks
        : allWorks.filter(w => w.category.name === catName);

      // On affiche la galerie filtrée
      renderGallery(filtered);
    });

    // On ajoute le bouton dans le conteneur
    filtersContainer.appendChild(btn);
  });
}


// ----- Affichage de la galerie -----
function renderGallery(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';  // On vide avant de remplir

  works.forEach(work => {
    const figure = document.createElement('figure');
    const img    = document.createElement('img');
    const cap    = document.createElement('figcaption');

    // Image et légende depuis l’API
    img.src         = work.imageUrl;  // attention : dépend du nom dans ton API
    img.alt         = work.title;
    cap.textContent = work.title;

    // On assemble l’élément <figure>
    figure.append(img, cap);

    // On l’ajoute dans la galerie
    gallery.append(figure);
  });
}


// ----- Récupération et affichage des catégories dans le <select> -----
async function fetchAndRenderCategories() {
  try {
    // Appel API pour les catégories
    const resp = await fetch('http://localhost:5678/api/categories');
    if (!resp.ok) throw new Error(`Erreur: ${resp.status}`);
    const categories = await resp.json();

    // On cible le <select> et on met une option par défaut
    const select = document.getElementById('category-select');
    select.innerHTML = '<option value="">-- Sélectionner une catégorie --</option>';

    // On crée une <option> pour chaque catégorie
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;         // valeur envoyée si formulaire soumis
      option.textContent = cat.name; // texte visible dans le menu
      select.appendChild(option);
    });

  } catch (err) {
    // En cas d’échec de l’appel API
    console.error('Erreur chargement des catégories :', err);
  }
}
