// modal.js

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const openBtn = document.getElementById('open-modal');
  const closeBtn = document.querySelector('.close-modal');
  const overlay = document.querySelector('.modal-overlay');

  const galleryView = document.getElementById('gallery-view');
  const addView = document.getElementById('add-view');
  const switchToAddBtn = document.getElementById('switch-to-add');
  const backToGalleryBtn = document.getElementById('back-to-gallery');

  const customFileTrigger = document.getElementById('custom-file-trigger');
  const realFileInput = document.getElementById('real-file-input');

  customFileTrigger.addEventListener('click', () => {
    realFileInput.click();
  });

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    galleryView.classList.remove('hidden');
    addView.classList.add('hidden');
  });

  const closeModal = () => {
    modal.classList.add('hidden');
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  switchToAddBtn.addEventListener('click', () => {
    galleryView.classList.add('hidden');
    addView.classList.remove('hidden');
  });

  backToGalleryBtn.addEventListener('click', () => {
    addView.classList.add('hidden');
    galleryView.classList.remove('hidden');
  });

  previewImg();

  const addPhotoForm = document.getElementById('add-photo-form');

addPhotoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const addView = document.getElementById('add-view');
  const galleryView = document.getElementById('gallery-view');

  const fileInput = document.getElementById('real-file-input');
  const titleInput = addPhotoForm.elements['title'];
  const categorySelect = addPhotoForm.elements['category'];

  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  const categoryId = categorySelect.value;

  if (!file || !title || !categoryId) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('category', categoryId);

  try {
    console.log("Token utilisé :", localStorage.getItem('authToken'));

    const resp = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    });

    if (!resp.ok) throw new Error(`Erreur upload: ${resp.status}`);

    const newWork = await resp.json();

    // Ajout à la liste locale
    allWorks.push(newWork);

    // Mise à jour de la galerie principale et de la modale
    renderGallery(allWorks);
    renderModalGallery(allWorks);

    // Retour à la vue galerie
    addView.classList.add('hidden');
    galleryView.classList.remove('hidden');

    // Réinitialisation du formulaire
    addPhotoForm.reset();
    const previewImg = document.getElementById('preview-img');
    previewImg.src = '';
    previewImg.classList.add('hidden');
    document.querySelectorAll('.item-to-hidden').forEach(el => el.classList.remove('hidden'));
    
  } catch (err) {
    console.error('Erreur ajout :', err);
    alert('Erreur lors de l’ajout de l’image.');
  }
});

});

function previewImg() {
  const realFileInput = document.getElementById('real-file-input');

  realFileInput.addEventListener('change', () =>  {
    const file = realFileInput.files;
    console.log(file);
    
    if (file.length > 0 ) {
      const saveFile = file[0];
      const fileUrl = URL.createObjectURL (saveFile);

      const previewImgElement = document.getElementById('preview-img');

      previewImgElement.src = fileUrl;
      hiddenModalItem();
    }
  })
}

function hiddenModalItem () {
  console.log('test');
  
  const itemToHidden = document.querySelectorAll('.item-to-hidden');
  const previewImg = document.getElementById('preview-img');
  itemToHidden.forEach((item) => {
    item.classList.toggle('hidden');
  })

  previewImg.classList.toggle('hidden');
}

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
    // caption.textContent = work.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn', "fa", "fa-trash-can");
    // deleteBtn.dataset.workId = work.id;

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

        // Mise à jour locale
        allWorks = allWorks.filter(w => w.id != idToDelete);

        // Rafraîchir affichage
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

document.addEventListener('DOMContentLoaded', () => {
  const addPhotoForm = document.getElementById('add-photo-form');
  const titleInput = addPhotoForm.elements['title'];
  const categorySelect = addPhotoForm.elements['category'];
  const fileInput = document.getElementById('real-file-input');
  const submitBtn = addPhotoForm.querySelector('button[type="submit"]');

  function updateSubmitButton() {
    const hasTitle = titleInput.value.trim() !== '';
    const hasCategory = categorySelect.value.trim() !== '';
    const hasFile = fileInput.files.length > 0;

    if (hasTitle && hasCategory && hasFile) {
      submitBtn.classList.add('is-enabled');
      submitBtn.disabled = false;
    } else {
      submitBtn.classList.remove('is-enabled');
      submitBtn.disabled = true;
    }
  }

  titleInput.addEventListener('input', updateSubmitButton);
  categorySelect.addEventListener('change', updateSubmitButton);
  fileInput.addEventListener('change', updateSubmitButton);

  updateSubmitButton();
});

function previewImg() {
  const realFileInput = document.getElementById('real-file-input');

  realFileInput.addEventListener('change', () => {
    const file = realFileInput.files;
    
    if (file.length > 0) {
      const saveFile = file[0];
      const fileUrl = URL.createObjectURL(saveFile);

      const previewImgElement = document.getElementById('preview-img');
      previewImgElement.src = fileUrl;

      // Ajoute le padding quand une image est sélectionnée
      const customFileTrigger = document.getElementById('custom-file-trigger');
      customFileTrigger.style.padding = "0px 150px";

      hiddenModalItem();
    }
  });
}
