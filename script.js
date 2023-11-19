const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");
const search = document.querySelector("#search-btn");
const translation = document.querySelector("#translation-btn");


let userText = null;




const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

const searchWikipedia = async (incomingChatDiv) => {
    const pElement = document.createElement("p");

    try {
        const response = await fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${userText}");
        const data = await response.json();

        if (data.query && data.query.search) {
            data.query.search.forEach(result => {
                // Creating a new paragraph for each result
                const resultParagraph = document.createElement("p");
                resultParagraph.textContent = result.snippet;
                pElement.appendChild(resultParagraph);
            });
        } else {
            pElement.textContent = "No results found.";
        }
    } catch (error) {
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    // Append the pElement to the specified incomingChatDiv
  //  incomingChatDiv.appendChild(pElement);
//};

   // incomingChatDiv.appendChild(pElement);
//};

// Example usage:
// Replace 'yourSearchInput' with the actual input and 'yourContainerDiv' with the actual container div
//searchWikipedia(('yourContainerDiv'), 'yourSearchInput');


     
    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    
    const utterance = new SpeechSynthesisUtterance(pElement.textContent);
    speechSynthesis.speak(utterance);

    translation.addEventListener("click", () => {
    const googleTranslateUrl = `https://translate.google.com/?sl=en&tl=bn&text=${encodeURIComponent(pElement.textContent)}`;
    window.open(googleTranslateUrl, '_blank');
});

    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}



const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
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
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    searchWikipedia(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if(!userText) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="static folder/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                    
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
   
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    
    if(confirm("Are you sure you want to delete all the chats?")) {
        window.location.reload();
    }
});

search.addEventListener("click", () => {

    const googleURL = `https://www.google.com/search?q=${userText}`;
      window.open(googleURL, '_blank');
});



const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {   
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});




sendButton.addEventListener("click", handleOutgoingChat);

