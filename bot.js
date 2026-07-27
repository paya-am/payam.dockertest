const botResponses = [
  { keywords: ['recommend', 'suggest', 'favorite'], text: 'Looking for a great read? I recommend the latest fiction bestsellers and classic novels with strong characters.' },
  { keywords: ['book', 'read', 'story'], text: 'We have a wide selection of novels, biographies, self-help, and adventure books. What genre do you like?' },
  { keywords: ['author', 'writer'], text: 'If you like mysteries, try Agatha Christie. If you enjoy fantasy, check out books by Neil Gaiman or J.K. Rowling.' },
  { keywords: ['price', 'cost', 'buy'], text: 'Many of our books are priced affordably, and we often feature special discounts for popular titles.' },
  { keywords: ['contact', 'help', 'support'], text: 'You can contact us via email at hello@payam.com or use the contact form on the Contact page.' },
  { keywords: ['culture', 'history', 'novel'], text: 'We love stories rooted in culture and history. Ask me for historical novels or cultural reads.' }
];

function addMessage(container, text, className) {
  const messageEl = document.createElement('div');
  messageEl.className = `chatbot-message ${className}`;
  messageEl.textContent = text;
  container.appendChild(messageEl);
  container.scrollTop = container.scrollHeight;
}

function getBotResponse(query) {
  const lower = query.toLowerCase();
  for (const response of botResponses) {
    if (response.keywords.some((keyword) => lower.includes(keyword))) {
      return response.text;
    }
  }
  return 'I can help with book recommendations, authors, and store info. Ask me something about books!';
}

function initializeChatbot() {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotPanel = document.getElementById('chatbotPanel');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotForm = document.getElementById('chatbotForm');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotMessages = document.getElementById('chatbotMessages');

  if (!chatbotToggle || !chatbotPanel || !chatbotClose || !chatbotForm || !chatbotInput || !chatbotMessages) {
    return;
  }

  function openChat() {
    chatbotPanel.hidden = false;
    chatbotInput.focus();
  }

  function closeChat() {
    chatbotPanel.hidden = true;
  }

  chatbotToggle.addEventListener('click', () => {
    chatbotPanel.hidden = !chatbotPanel.hidden;
    if (!chatbotPanel.hidden && chatbotMessages.children.length === 0) {
      addMessage(chatbotMessages, 'Hi there! I am your book assistant. Ask me about books or recommendations.', 'bot');
    }
    if (!chatbotPanel.hidden) {
      chatbotInput.focus();
    }
  });

  chatbotClose.addEventListener('click', closeChat);

  chatbotForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) return;

    addMessage(chatbotMessages, text, 'user');
    chatbotInput.value = '';
    const response = getBotResponse(text);

    setTimeout(() => {
      addMessage(chatbotMessages, response, 'bot');
    }, 300);
  });
}

document.addEventListener('DOMContentLoaded', initializeChatbot);
