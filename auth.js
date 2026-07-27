const authForm = document.getElementById('authForm');
const message = document.getElementById('message');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const usersKey = 'payam-users';
const pendingKey = 'payam-acceptance-pending';
const pendingUserKey = 'payam-pending-user';

function getUsers() {
  const saved = localStorage.getItem(usersKey);
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function initAuth() {
  if (!authForm || !message || !usernameInput || !passwordInput) {
    return;
  }

  authForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      message.textContent = 'Please enter username and password.';
      return;
    }

    const users = getUsers();
    const matchedUser = users.find((user) => user.username === username && user.password === password);

    if (matchedUser) {
      localStorage.setItem(pendingKey, 'true');
      localStorage.setItem(pendingUserKey, username);
      message.textContent = 'Username recognized. Complete the captcha step to continue.';
      setTimeout(() => {
        window.location.href = 'accept.html';
      }, 800);
    } else {
      message.textContent = 'Invalid username or password.';
    }
  });
}

document.addEventListener('DOMContentLoaded', initAuth);
