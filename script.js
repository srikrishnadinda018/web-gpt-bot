const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");
const search = document.querySelector("#search-btn");
const translation = document.querySelector("#translation-btn");

let userText = null;

async function getWikipediaData(query) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&titles=${encodeURIComponent(query)}&origin=*`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const pageId = Object.keys(data.query.pages)[0];

    if (pageId === '-1') {
      throw new Error('No information found for the given query.');
    }

    return data.query.pages[pageId].extract;
  } catch (error) {
    throw new Error('Failed to fetch Wikipedia data.');
  }
}

const createChatElement = (content, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = content;
  return chatDiv;
};

const sendMessage = async (incomingChatDiv) => {
  const pElement = document.createElement("p");

  try {
    const response = await getWikipediaData(userText);
    pElement.innerHTML = `<div>Wikipedia: ${response}</div>`;
  } catch (error) {
    pElement.classList.add("error");
    pElement.innerHTML = "<div>Oops! Something went wrong while retrieving the response. Please try again.</div>";
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

  const utterance = new SpeechSynthesisUtterance(pElement.textContent);
  speechSynthesis.speak(utterance);

  translation.addEventListener("click", () => {
    const googleTranslateUrl = `https://translate.google.com/?sl=en&tl=bn&text=${encodeURIComponent(pElement.textContent)}`;
    window.open(googleTranslateUrl, '_blank');
  });

  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
                  <div class="chat-details">
                      <img src="static folder/bot.png" alt="chatbot-img">
                      <div class="typing-animation">
                          <div class="typing-dot" style="--delay: 0.2s"></div>
                          <div class="typing-dot" style="--delay: 0.3s"></div>
                          <div class="typing-dot" style="--delay: 0.4s"></div>
                      </div>
                  </div>
              </div>`;

  const incomingChatDiv = createChatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  sendMessage(incomingChatDiv);
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();

  if (!userText) return;

  chatInput.value = "";
  chatInput.style.height = `${initialInputHeight}px`;

  const html = `<div class="chat-content">
                  <div class="chat-details">
                      <img src="static folder/user.jpg" alt="user-img">
                      <p>${userText}</p>
                  </div>
              </div>`;

  const outgoingChatDiv = createChatElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
};

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    window.location.reload();
  }
});

search.addEventListener("click", () => {
  const googleURL = `https://www.google.com/search?q=${userText}`;
  window.open(googleURL, '_blank');
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${initialInputHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

sendButton.addEventListener("click", handleOutgoingChat);
