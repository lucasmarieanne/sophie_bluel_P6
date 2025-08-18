// api.js

const API_URL = 'http://localhost:5678/api/works';

let allWorks = [];   // on stocke toutes les œuvres pour réutiliser
let currentFilter = 'Tous';

document.addEventListener('DOMContentLoaded', () => {
  fetchGallery();
  fetchAndRenderCategories();  // <- ajoute cette ligne
});
async function fetchGallery() {
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`Statut ${resp.status}`);
    allWorks = await resp.json();
    renderFilters(allWorks);
    renderGallery(allWorks);
    renderModalGallery(allWorks);
  } catch (err) {
    console.error('Erreur API :', err);
    document.querySelector('.gallery').innerHTML =
      '<p>Impossible de charger la galerie.</p>';
  }
}

function renderFilters(works) {
  const filtersContainer = document.getElementById('filters');
  filtersContainer.innerHTML = '';

  // 1) Construire la liste des catégories uniques
  const cats = ['Tous', 
    ...new Set(works.map(w => w.category.name))
  ];

  // 2) Pour chaque nom de catégorie, créer un bouton
  cats.forEach(catName => {
    const btn = document.createElement('button');
    btn.textContent = catName;
    btn.classList.add('filter-btn');
    if (catName === currentFilter) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentFilter = catName;
      // on met à jour l'affichage des boutons
      document.querySelectorAll('.filter-btn')
        .forEach(b => b.classList.toggle('active', b.textContent === catName));
      // on réaffiche la galerie filtrée
      const filtered = catName === 'Tous'
        ? allWorks
        : allWorks.filter(w => w.category.name === catName);
      renderGallery(filtered);
    });
    filtersContainer.appendChild(btn);
  });
}

function renderGallery(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';  // on vide
  works.forEach(work => {
    const figure = document.createElement('figure');
    const img    = document.createElement('img');
    const cap    = document.createElement('figcaption');

    img.src         = work.imageUrl;  // ou work.url selon ton API
    img.alt         = work.title;
    cap.textContent = work.title;

    figure.append(img, cap);
    gallery.append(figure);
  });
}

async function fetchAndRenderCategories() {
  try {
    const resp = await fetch('http://localhost:5678/api/categories');
    if (!resp.ok) throw new Error(`Erreur: ${resp.status}`);
    const categories = await resp.json();

    const select = document.getElementById('category-select');
    select.innerHTML = '<option value="">-- Sélectionner une catégorie --</option>';

    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;         // valeur envoyée dans le formulaire
      option.textContent = cat.name; // affichage dans le select
      select.appendChild(option);
    });

  } catch (err) {
    console.error('Erreur chargement des catégories :', err);
  }
}