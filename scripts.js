// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userData = {
      userid: Date.now(),
      email: document.getElementById('email').value,
      mobile: document.getElementById('mobile').value,
      pincode: document.getElementById('pincode').value,
      password: document.getElementById('password').value
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    alert('Registration successful!');
    window.location.href = 'login.html';
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.email === email && storedData.password === password) {
      localStorage.setItem('loginSuccess', 'true');
      alert('Login successful!');
      window.location.href = 'owner_home.html';
    } else {
      alert('Invalid credentials!');
    }
  });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loginSuccess');
    window.location.href = 'login.html';
  });
}

// File Upload
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const key = Math.random().toString(36).substring(2, 10);
    if (file) {
      const files = JSON.parse(localStorage.getItem('files') || '[]');
      files.push({ name: file.name, key });
      localStorage.setItem('files', JSON.stringify(files));
      document.querySelector('.master-key-section').style.display = 'block';
      document.getElementById('masterKey').textContent = key;
      fileInput.value = '';
    }
  });

  const copyBtn = document.getElementById('copyKeyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const key = document.getElementById('masterKey').textContent;
      navigator.clipboard.writeText(key).then(() => alert('Key copied to clipboard!'));
    });
  }
}

// View Files
const viewBtn = document.getElementById('viewFileBtn');
if (viewBtn) {
  viewBtn.addEventListener('click', () => {
    const fileList = document.getElementById('fileList');
    if (fileList) {
      fileList.innerHTML = '';
      const files = JSON.parse(localStorage.getItem('files') || '[]');
      files.forEach((file, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${file.name}`;
        fileList.appendChild(li);
      });
    }
  });
}

// Delete Files
const deleteBtn = document.getElementById('deleteFileBtn');
if (deleteBtn) {
  deleteBtn.addEventListener('click', () => {
    if (confirm('Delete all files?')) {
      localStorage.removeItem('files');
      const fileList = document.getElementById('fileList');
      if (fileList) fileList.innerHTML = '';
    }
  });
}

// Download
const downloadForm = document.getElementById('downloadForm');
if (downloadForm) {
  const fileSelect = document.getElementById('fileSelect');
  const statusBox = document.getElementById('downloadStatus');
  const statusMsg = document.querySelector('.status-message');

  const files = JSON.parse(localStorage.getItem('files') || '[]');
  files.forEach(file => {
    const option = document.createElement('option');
    option.value = file.name;
    option.textContent = file.name;
    fileSelect.appendChild(option);
  });

  downloadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selected = fileSelect.value;
    const inputKey = document.getElementById('masterKeyInput').value.trim();
    const file = files.find(f => f.name === selected);
    if (file && file.key === inputKey) {
      statusBox.style.display = 'block';
      statusMsg.textContent = `Download started for ${selected}`;
      statusMsg.style.color = 'green';
    } else {
      statusBox.style.display = 'block';
      statusMsg.textContent = 'Incorrect secret key!';
      statusMsg.style.color = 'red';
    }
  });
}
