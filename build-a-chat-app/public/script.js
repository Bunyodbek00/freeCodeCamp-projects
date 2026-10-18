const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const connectBtn = document.getElementById('connect-btn');
const sendBtn = document.getElementById('send-btn');
const sidebar = document.getElementById('sidebar');
const usersList = document.getElementById('users-list');
const typingIndicator = document.getElementById('typing-indicator');

let socket = null;
let typingTimeout = null;

function appendMessage({ type, username, text, time }) {
  const el = document.createElement('div');
  el.classList.add('msg', type);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('msg-content');

  if (type === 'chat') {
    contentDiv.innerHTML = `<span class="username">${escapeHtml(username)}:</span>${escapeHtml(text)}`;
  } else {
    contentDiv.textContent = text;
  }
  el.appendChild(contentDiv);

  // Feature 1: Append timestamp
  if (time) {
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('timestamp');
    timeSpan.textContent = time;
    el.appendChild(timeSpan);
  }

  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setConnected(connected) {
  statusDot.className = connected ? 'connected' : 'disconnected';
  statusText.textContent = connected ? 'Connected' : 'Disconnected';
  messageInput.disabled = !connected;
  sendBtn.disabled = !connected;
  connectBtn.textContent = connected ? 'Disconnect' : 'Connect';
  usernameInput.disabled = connected;
  sidebar.style.display = connected ? 'flex' : 'none';
  if (!connected) {
    usersList.innerHTML = '';
    typingIndicator.textContent = '';
  }
}

connectBtn.addEventListener('click', () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    return;
  }
  const username = usernameInput.value.trim() || 'Anonymous';
  socket = new WebSocket(`ws://localhost:3001?username=${encodeURIComponent(username)}`);

  socket.onopen = () => setConnected(true);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // Feature 4: Handle loading message history
      if (data.type === 'history') {
        data.history.forEach(msg => appendMessage(msg));
        return;
      }

      // Feature 2: Handle updating the online user list
      if (data.type === 'users') {
        usersList.innerHTML = '';
        data.users.forEach(user => {
          const li = document.createElement('li');
          li.textContent = user;
          usersList.appendChild(li);
        });
        return;
      }

      // Feature 3: Handle typing indicator broadcast
      if (data.type === 'typing') {
        if (data.isTyping) {
          typingIndicator.textContent = `${data.username} is typing...`;
        } else {
          typingIndicator.textContent = '';
        }
        return;
      }

      appendMessage(data);
    } catch {
      // ignore malformed messages
    }
  };

  socket.onclose = () => {
    setConnected(false);
    socket = null;
  };

  socket.onerror = () => {
    setConnected(false);
  };
});

// Feature 3: Send typing status to server on input change
messageInput.addEventListener('input', () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({ type: 'typing', isTyping: true }));

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'typing', isTyping: false }));
    }
  }, 1000);
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !socket || socket.readyState !== WebSocket.OPEN) return;
  
  // Clear typing state immediately on send
  socket.send(JSON.stringify({ type: 'typing', isTyping: false }));
  
  socket.send(JSON.stringify({ text }));
  messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});