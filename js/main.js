
(function () {
  
  var nameInput = document.getElementById('nameInput');
  var phoneInput = document.getElementById('phoneInput');
  var emailInput = document.getElementById('emailInput');
  var addressInput = document.getElementById('addressInput');
  var groupSelect = document.getElementById('groupSelect');
  var notesInput = document.getElementById('notesInput');
  var favoriteCheck = document.getElementById('favoriteCheck');
  var emergencyCheck = document.getElementById('emergencyCheck');
  var photoInput = document.getElementById('photoInput');
  var searchBox = document.getElementById('searchBox');

  
  var contactsListEl = document.getElementById('contactsList');
  var favoritesListEl = document.getElementById('favoritesList');
  var emergencyListEl = document.getElementById('emergencyList');
  var totalCountEl = document.getElementById('totalCount');
  var favCountEl = document.getElementById('favCount');
  var emergencyCountEl = document.getElementById('emergencyCount');
  var contactsSubtitleEl = document.getElementById('contactsSubtitle');


  var STORAGE_KEY = 'contacts';
  var DEFAULT_IMAGE = './images/avatar-3.jpg';

  //Regex
  var nameRegex = /^[A-Za-z\u0600-\u06FF ]{2,50}$/;
  var egyptPhoneRegex = /^(01)[0-2,5]{1}[0-9]{8}$/;
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var contacts = [];
  var editingId = null;
  var modal = null;

  
  function loadContacts() {
    var raw = localStorage.getItem(STORAGE_KEY);
    contacts = raw ? JSON.parse(raw) : [];
  }

  function saveContacts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }

  function createAvatar(name) {
    name = name || '';
    return name.trim().substring(0, 2).toUpperCase() || 'NA';
  }

  function getGroupColor(group) {
    var colors = {
      'Family': 'primary',
      'Friends': 'success',
      'Work': 'purple',
      'School': 'info',
      'Other': 'secondary'
    };
    return colors[group] || 'secondary';
  }

  function clearForm() {
    var controls = document.querySelectorAll('.form-control');
    for (var i = 0; i < controls.length; i++) {
      controls[i].value = '';
      controls[i].classList.remove('is-invalid');
    }

    var invalids = document.querySelectorAll('.invalid-feedback');
    for (i = 0; i < invalids.length; i++) {
      invalids[i].textContent = '';
    }

    if (favoriteCheck) favoriteCheck.checked = false;
    if (emergencyCheck) emergencyCheck.checked = false;
    if (photoInput) photoInput.value = null;
  }

  function setInvalid(inputEl, errorId, message) {
    if (!inputEl) return;
    inputEl.classList.add('is-invalid');
    var err = document.getElementById(errorId);
    if (err) err.textContent = message;
  }

  function clearInvalid(inputEl, errorId) {
    if (!inputEl) return;
    inputEl.classList.remove('is-invalid');
    var err = document.getElementById(errorId);
    if (err) err.textContent = '';
  }

  
  function liveValidationAttach() {
    if (nameInput) {
      nameInput.addEventListener('input', function () {
        var v = nameInput.value.trim();
        if (!nameRegex.test(v)) {
          setInvalid(nameInput, 'nameError', 'Name should contain only letters and spaces (2-50 characters)');
        } else {
          clearInvalid(nameInput, 'nameError');
        }
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        var v = phoneInput.value.trim();
        if (!egyptPhoneRegex.test(v)) {
          setInvalid(phoneInput, 'phoneError', 'Please enter a valid Egyptian phone number');
        } else {
          clearInvalid(phoneInput, 'phoneError');
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        var v = emailInput.value.trim();
        if (v && !emailRegex.test(v)) {
          setInvalid(emailInput, 'emailError', 'Please enter a valid email address');
        } else {
          clearInvalid(emailInput, 'emailError');
        }
      });
    }
  }

  function validateForm() {
    var valid = true;

    var controls2 = document.querySelectorAll('.form-control');
    for (var i = 0; i < controls2.length; i++) {
      controls2[i].classList.remove('is-invalid');
    }
    var invalids2 = document.querySelectorAll('.invalid-feedback');
    for (i = 0; i < invalids2.length; i++) {
      invalids2[i].textContent = '';
    }

 
    if (!nameRegex.test((nameInput && nameInput.value || '').trim())) {
      setInvalid(nameInput, 'nameError', 'Name should contain only letters and spaces (2-50 characters)');
      valid = false;
    }

    
    if (!egyptPhoneRegex.test((phoneInput && phoneInput.value || '').trim())) {
      setInvalid(phoneInput, 'phoneError', 'Please enter a valid Egyptian phone number');
      valid = false;
    }

    
    var emailVal = (emailInput && emailInput.value || '').trim();
    if (emailVal && !emailRegex.test(emailVal)) {
      setInvalid(emailInput, 'emailError', 'Please enter a valid email address');
      valid = false;
    }

    return valid;
  }

  
  window.openModal = function () {
    editingId = null;
    var titleEl = document.querySelector('.modal-title');
    if (titleEl) titleEl.textContent = 'Add New Contact';
    var saveBtn = document.querySelector('.btn-save');
    if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-check"></i> Save Contact';
    clearForm();
    if (modal) modal.show();
  };

  window.closeModal = function () {
    if (modal) modal.hide();
    clearForm();
  };

  
  window.editContact = function (id) {
    var c = null;
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) {
        c = contacts[i];
        break;
      }
    }
    if (!c) return;
    editingId = id;
    var titleEl = document.querySelector('.modal-title');
    if (titleEl) titleEl.textContent = 'Edit Contact';
    var saveBtn = document.querySelector('.btn-save');
    if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-check"></i> Update Contact';

    if (nameInput) nameInput.value = c.name;
    if (phoneInput) phoneInput.value = c.phone;
    if (emailInput) emailInput.value = c.email || '';
    if (addressInput) addressInput.value = c.address || '';
    if (groupSelect) groupSelect.value = c.group || '';
    if (notesInput) notesInput.value = c.notes || '';
    if (favoriteCheck) favoriteCheck.checked = !!c.isFavorite;
    if (emergencyCheck) emergencyCheck.checked = !!c.isEmergency;
    if (photoInput) photoInput.value = null;

    if (modal) modal.show();
  };

  /* ========== Save (add/update) ========== */
  window.saveContact = function () {
    if (!validateForm()) return;

    var baseData = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      address: addressInput.value.trim(),
      group: groupSelect.value,
      notes: notesInput.value.trim(),
      isFavorite: favoriteCheck.checked,
      isEmergency: emergencyCheck.checked,
      avatar: createAvatar(nameInput.value)
    };

    function finalize(imageData) {
      if (editingId) {
        var idx = -1;
        for (var j = 0; j < contacts.length; j++) {
          if (contacts[j].id === editingId) { idx = j; break; }
        }
        if (idx !== -1) {
          contacts[idx] = extendObject(contacts[idx], baseData);
          contacts[idx].image = imageData || contacts[idx].image || DEFAULT_IMAGE;
          saveContacts();
          renderAll();
          if (modal) modal.hide();
          Swal.fire({ icon: 'success', title: 'Updated', text: 'Contact updated.' });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Contact not found.' });
        }
      } else {
        var newContact = { id: Date.now() };
        newContact = extendObject(newContact, baseData);
        newContact.image = imageData || DEFAULT_IMAGE;
        contacts.push(newContact);
        saveContacts();
        renderAll();
        if (modal) modal.hide();
        Swal.fire({ icon: 'success', title: 'Added', text: 'Contact added.' });
      }
      clearForm();
    }

    
    if (photoInput && photoInput.files && photoInput.files[0]) {
      var file = photoInput.files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        finalize(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      if (editingId) {
        var existing = null;
        for (var k = 0; k < contacts.length; k++) {
          if (contacts[k].id === editingId) { existing = contacts[k]; break; }
        }
        finalize(existing ? existing.image : DEFAULT_IMAGE);
      } else {
        finalize(DEFAULT_IMAGE);
      }
    }
  };

  function extendObject(target, source) {
    for (var p in source) {
      if (source.hasOwnProperty(p)) {
        target[p] = source[p];
      }
    }
    return target;
  }

  /* ========== Delete ========== */
  window.deleteContact = function (id) {
    var contact = null;
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) { contact = contacts[i]; break; }
    }
    if (!contact) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete ' + contact.name + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(function (result) {
      if (result.isConfirmed) {
        var newArr = [];
        for (var j = 0; j < contacts.length; j++) {
          if (contacts[j].id !== id) newArr.push(contacts[j]);
        }
        contacts = newArr;
        saveContacts();
        renderAll();
        Swal.fire('Deleted!', 'Contact removed.', 'success');
      }
    });
  };

  /* ==========  favorite  ========== */
  window.toggleFavorite = function (id) {
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) {
        contacts[i].isFavorite = !contacts[i].isFavorite;
        break;
      }
    }
    saveContacts();
    renderAll();
  };
/* ==========  emergency  ========== */
  window.toggleEmergency = function (id) {
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) {
        contacts[i].isEmergency = !contacts[i].isEmergency;
        break;
      }
    }
    saveContacts();
    renderAll();
  };


  function renderAll() {
    var term = '';
    if (searchBox && searchBox.value) term = searchBox.value.toLowerCase().trim();

    var filtered = [];
    for (var i = 0; i < contacts.length; i++) {
      var c = contacts[i];
      var nameLower = (c.name || '').toLowerCase();
      var phoneStr = (c.phone || '');
      var emailLower = (c.email || '').toLowerCase();
      if (nameLower.indexOf(term) !== -1 || phoneStr.indexOf(term) !== -1 || emailLower.indexOf(term) !== -1) {
        filtered.push(c);
      }
    }

    if (totalCountEl) totalCountEl.textContent = contacts.length;
    if (favCountEl) favCountEl.textContent = countWhere('isFavorite');
    if (emergencyCountEl) emergencyCountEl.textContent = countWhere('isEmergency');
    if (contactsSubtitleEl) contactsSubtitleEl.textContent = 'Manage and organize your ' + contacts.length + ' contacts';

    if (!contactsListEl) return;

    if (filtered.length === 0) {
      contactsListEl.innerHTML = ''
        + '<div class="stat-card">'
        + '  <div class="empty-state">'
        + '    <div class="empty-icon"><i class="fas fa-user"></i></div>'
        + '    <div class="empty-title">No contacts found</div>'
        + '    <div class="empty-subtitle">Click "Add Contact" to get started</div>'
        + '  </div>'
        + '</div>';
    } else {
      var html = '';
      for (i = 0; i < filtered.length; i++) {
        var contact = filtered[i];
        var avatarImg = '<img src="' + (contact.image || DEFAULT_IMAGE) + '" alt="' + (contact.name || '') + '" style="width:48px;height:48px;border-radius:8px;object-fit:cover;display:block;margin-bottom:6px;">';
        var favBadge = contact.isFavorite ? '<div class="contact-badge badge-favorite">⭐</div>' : '';
        var emBadge = contact.isEmergency ? '<div class="contact-badge badge-emergency">❤️</div>' : '';

        
        var phoneHref = 'tel:' + (contact.phone ? ('' + contact.phone).replace(/\s+/g, '') : '');
        var emailHref = 'mailto:' + (contact.email ? ('' + contact.email).trim() : '');

        html += ''
          + '<div class="contact-card">'
          + '  <div class="d-flex gap-3" style="flex-direction: column;">'
          + '    <div class="contact-avatar">' + avatarImg + favBadge + emBadge + '</div>'
          + '    <div class="flex-grow-1">'
          + '      <div class="contact-name">' + escapeHtml(contact.name) + '</div>'
          + '      <div class="contact-info"><i class="fas fa-phone"></i> ' + escapeHtml(contact.phone) + '</div>'
          + '      <div class="contact-info"><i class="fas fa-envelope"></i> ' + escapeHtml(contact.email || '') + '</div>'
          + '      <div class="contact-info"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(contact.address || '') + '</div>'
          + '      <div>' + (contact.group ? '<span class="contact-tag tag-' + getGroupColor(contact.group) + '">' + escapeHtml(contact.group) + '</span>' : '') + (contact.isEmergency ? '<span class="contact-tag tag-danger"><i class="fas fa-heart-pulse"></i> Emergency</span>' : '') + '</div>'
          + '    </div>'
          + '    <div class="d-flex gap-2 justify-content-between">'
          + '      <div class="d-flex gap-2">'
          + '        <a href="' + phoneHref + '" class="action-btn" style="background: #dbeafe; color: #2563eb;"><i class="fas fa-phone"></i></a>'
          + '        <a href="' + emailHref + '" class="action-btn" style="background: #dbeafe; color: #2563eb;"><i class="fas fa-envelope"></i></a>'
          + '      </div>'
          + '      <div class="d-flex gap-2">'
          + '        <button class="action-btn ' + (contact.isFavorite ? 'active' : '') + '" onclick="toggleFavorite(' + contact.id + ')"><i class="' + (contact.isFavorite ? 'fas' : 'far') + ' fa-star"></i></button>'
          + '        <button class="action-btn ' + (contact.isEmergency ? 'danger' : '') + '" onclick="toggleEmergency(' + contact.id + ')"><i class="fas fa-heart-pulse"></i></button>'
          + '        <button class="action-btn" style="background: #e0e7ff; color: #6366f1;" onclick="editContact(' + contact.id + ')"><i class="fas fa-pen"></i></button>'
          + '        <button class="action-btn" style="background: #fee2e2; color: #ef4444;" onclick="deleteContact(' + contact.id + ')"><i class="fas fa-trash"></i></button>'
          + '      </div>'
          + '    </div>'
          + '  </div>'
          + '</div>';
      }
      contactsListEl.innerHTML = html;
    }

    // favorites sidebar
    if (favoritesListEl) {
      var favs = [];
      for (i = 0; i < contacts.length; i++) if (contacts[i].isFavorite) favs.push(contacts[i]);

      if (favs.length === 0) {
        favoritesListEl.innerHTML = '<div class="sidebar-empty"><i class="fas fa-star"></i>No favorites yet</div>';
      } else {
        var favHtml = '';
        for (i = 0; i < favs.length; i++) {
          var c = favs[i];
          var cPhoneHref = 'tel:' + (c.phone ? ('' + c.phone).replace(/\s+/g, '') : '');
          favHtml += ''
            + '<div class="sidebar-contact">'
            + '  <div class="sidebar-avatar"><img src="' + (c.image || DEFAULT_IMAGE) + '" alt="' + (c.name || '') + '" style="width:36px;height:36px;border-radius:6px;object-fit:cover;"></div>'
            + '  <div class="flex-grow-1"><div class="sidebar-contact-name">' + escapeHtml(c.name) + '</div><div class="sidebar-contact-phone">' + escapeHtml(c.phone) + '</div></div>'
            + '  <a href="' + cPhoneHref + '" class="call-btn green"><i class="fas fa-phone"></i></a>'
            + '</div>';
        }
        favoritesListEl.innerHTML = favHtml;
      }
    }

    // emergency sidebar
    if (emergencyListEl) {
      var ems = [];
      for (i = 0; i < contacts.length; i++) if (contacts[i].isEmergency) ems.push(contacts[i]);

      if (ems.length === 0) {
        emergencyListEl.innerHTML = '<div class="sidebar-empty"><i class="fas fa-heart-pulse"></i>No emergency contacts</div>';
      } else {
        var emHtml = '';
        for (i = 0; i < ems.length; i++) {
          var e = ems[i];
          var ePhoneHref = 'tel:' + (e.phone ? ('' + e.phone).replace(/\s+/g, '') : '');
          emHtml += ''
            + '<div class="sidebar-contact">'
            + '  <div class="sidebar-avatar"><img src="' + (e.image || DEFAULT_IMAGE) + '" alt="' + (e.name || '') + '" style="width:36px;height:36px;border-radius:6px;object-fit:cover;"></div>'
            + '  <div class="flex-grow-1"><div class="sidebar-contact-name">' + escapeHtml(e.name) + '</div><div class="sidebar-contact-phone">' + escapeHtml(e.phone) + '</div></div>'
            + '  <a href="' + ePhoneHref + '" class="call-btn red"><i class="fas fa-phone"></i></a>'
            + '</div>';
        }
        emergencyListEl.innerHTML = emHtml;
      }
    }
  }

  function countWhere(field) {
    var count = 0;
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i][field]) count++;
    }
    return count;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // connect search input
  if (searchBox) {
    searchBox.addEventListener('input', function () {
      renderAll();
    });
  }

  
  document.addEventListener('DOMContentLoaded', function () {
    var modalEl = document.getElementById('contactModal');
    if (modalEl) modal = new bootstrap.Modal(modalEl);

    loadContacts();
    renderAll();

    var saveBtn = document.querySelector('.btn-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        saveBtn.disabled = true;
        setTimeout(function () { saveBtn.disabled = false; }, 600);
      });
    }

    liveValidationAttach();
  });
})();
