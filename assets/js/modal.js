// modal.js

document.addEventListener('DOMContentLoaded', () => {
  // Sélecteurs pour la modale et ses éléments
  const modal = document.getElementById('modal');
  const openBtn = document.getElementById('open-modal');
  const closeBtn = document.querySelector('.close-modal');
  const overlay = document.querySelector('.modal-overlay');

  // Deux vues : galerie et ajout
  const galleryView = document.getElementById('gallery-view');
  const addView = document.getElementById('add-view');
  const switchToAddBtn = document.getElementById('switch-to-add');
  const backToGalleryBtn = document.getElementById('back-to-gallery');

  // Gestion input fichier customisé
  const customFileTrigger = document.getElementById('custom-file-trigger');
  const realFileInput = document.getElementById('real-file-input');

  // Clique sur le bouton "choisir un fichier" custom → déclenche le vrai input
  customFileTrigger.addEventListener('click', () => {
    realFileInput.click();
  });

  // Ouvrir la modale → on montre la galerie et on cache la vue "ajout"
  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    galleryView.classList.remove('hidden');
    addView.classList.add('hidden');
  });

  // Fonction de fermeture
  const closeModal = () => {
    modal.classList.add('hidden');
  };

  // Fermeture par bouton X ou par clic sur overlay
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Navigation : passer de galerie → ajout
  switchToAddBtn.addEventListener('click', () => {
    galleryView.classList.add('hidden');
    addView.classList.remove('hidden');
  });

  // Navigation : retour ajout → galerie
  backToGalleryBtn.addEventListener('click', () => {
    addView.classList.add('hidden');
    galleryView.classList.remove('hidden');
  });

  // Active la prévisualisation d’image quand on choisit un fichier
  previewImg();

  // ----- Gestion du formulaire d’ajout -----
  const addPhotoForm = document.getElementById('add-photo-form');

  addPhotoForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // empêche rechargement page

    const fileInput = document.getElementById('real-file-input');
    const titleInput = addPhotoForm.elements['title'];
    const categorySelect = addPhotoForm.elements['category'];

    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const categoryId = categorySelect.value;

    // Vérification basique des champs
    if (!file || !title || !categoryId) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    // Construction du FormData pour envoi multipart
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId);

    try {
      console.log("Token utilisé :", localStorage.getItem('authToken'));

      // Requête POST pour ajouter un "work"
      const resp = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (!resp.ok) throw new Error(`Erreur upload: ${resp.status}`);

      const newWork = await resp.json();

      // Ajout dans notre tableau local
      allWorks.push(newWork);

      // Mise à jour affichages (galerie principale + modale)
      renderGallery(allWorks);
      renderModalGallery(allWorks);

      // Retour automatique à la vue galerie
      addView.classList.add('hidden');
      galleryView.classList.remove('hidden');

      // Réinitialiser formulaire et preview
      addPhotoForm.reset();
      const previewImgElement = document.getElementById('preview-img');
      previewImgElement.src = '';
      previewImgElement.classList.add('hidden');
      document.querySelectorAll('.item-to-hidden').forEach(el => el.classList.remove('hidden'));
      
    } catch (err) {
      console.error('Erreur ajout :', err);
      alert('Erreur lors de l’ajout de l’image.');
    }
  });

  // ----- Activation du bouton "submit" uniquement si formulaire complet -----
  const titleInput = addPhotoForm.elements['title'];
  const categorySelect = addPhotoForm.elements['category'];
  const submitBtn = addPhotoForm.querySelector('button[type="submit"]');

  function updateSubmitButton() {
    const hasTitle = titleInput.value.trim() !== '';
    const hasCategory = categorySelect.value.trim() !== '';
    const hasFile = realFileInput.files.length > 0;

    if (hasTitle && hasCategory && hasFile) {
      submitBtn.classList.add('is-enabled');
      submitBtn.disabled = false;
    } else {
      submitBtn.classList.remove('is-enabled');
      submitBtn.disabled = true;
    }
  }

  // Mise à jour en fonction des champs remplis
  titleInput.addEventListener('input', updateSubmitButton);
  categorySelect.addEventListener('change', updateSubmitButton);
  realFileInput.addEventListener('change', updateSubmitButton);

  updateSubmitButton(); // vérifie à l’ouverture
});


// ----- Prévisualisation de l’image (corrigée) -----
function previewImg() {
  const realFileInput = document.getElementById('real-file-input');
  const previewImgElement = document.getElementById('preview-img');
  const customFileTrigger = document.getElementById('custom-file-trigger');

  realFileInput.addEventListener('change', () => {
    const file = realFileInput.files;

    if (file.length > 0) {
      const saveFile = file[0];

      // Génère une URL temporaire pour afficher l’image
      const fileUrl = URL.createObjectURL(saveFile);
      previewImgElement.src = fileUrl;

      // Affiche la preview
      previewImgElement.classList.remove('hidden');

      // Masquer les textes/icônes d’upload
      document.querySelectorAll('.item-to-hidden').forEach(el => {
        el.classList.add('hidden');
      });

      // Ajuster le style du bouton custom si besoin
      customFileTrigger.style.padding = "0px 150px";
    }
  });
}


// ----- Masquer/afficher certains éléments quand une image est choisie -----
function hiddenModalItem () {
  const itemToHidden = document.querySelectorAll('.item-to-hidden');
  const previewImg = document.getElementById('preview-img');

  // On toggle la visibilité des éléments
  itemToHidden.forEach((item) => {
    item.classList.toggle('hidden');
  });

  previewImg.classList.toggle('hidden');
}


// ----- Affichage de la galerie dans la modale -----
function renderModalGallery(works) {
  const modalGallery = document.querySelector('.modal-gallery');
  modalGallery.innerHTML = ''; // vide d'abord

  works.forEach(work => {
    const figure = document.createElement('figure');
    figure.classList.add('modal-figure');

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement('figcaption');
    // caption.textContent = work.title; (facultatif)

    // Bouton supprimer
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn', "fa", "fa-trash-can");

    // Quand on clique sur "supprimer"
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const idToDelete = work.id;

      try {
        const resp = await fetch(`http://localhost:5678/api/works/${idToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!resp.ok) throw new Error(`Erreur suppression: ${resp.status}`);

        // Mise à jour locale → on enlève l’élément supprimé
        allWorks = allWorks.filter(w => w.id != idToDelete);

        // Rafraîchir affichages
        renderModalGallery(allWorks);
        renderGallery(allWorks);
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la suppression.');
      }
    });

    figure.append(img, caption, deleteBtn);
    modalGallery.appendChild(figure);
  });
}
