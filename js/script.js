// window.alert('hi')
const chatInput = document.querySelector(".chat-input textarea");
const sendBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY  = "AIzaSyCQ0wPdlumxtasWHO8PWVkUhvev9vNQCgg";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  // create a chat li element with passes message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span id="material-symbols-outlined" class='bx bx-bot'></span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message
  return chatLi;
};

const generateResponse = (inComingChatLI) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`
    const messageElement = inComingChatLI.querySelector("p")
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents:[{
                role: "user",
                parts:[{text: userMessage}]
            }]
        })
    }
    // send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        // update message text with response
        messageElement.textContent = data.candidates[0].content.parts[0].text;
    }).catch((error) => {
        messageElement.classList.add("error")
        messageElement.textContent = "Oops! an error occured. Please try again";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))
}

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  //Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  //Display Thinking...  messgae while waiting for the response
  setTimeout(() => {
    const inComingChatLI = createChatLi("Thinking...", "incoming")
    chatbox.appendChild(inComingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(inComingChatLI);
  }, 600);
};

chatInput.addEventListener("input", () => {
    // to adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})


chatInput.addEventListener("keydown", (e) => {
    // if enter key is pressed without shiftkey and the window width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleChat()
    }
})

sendBtn.addEventListener("click", handleChat);
