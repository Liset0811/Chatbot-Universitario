document.addEventListener("DOMContentLoaded", function () {
    loadChatHistoryList();
    updateChatTitle("Nueva conversación"); // Título inicial
});


// 📌 Actualizar el título del chat
function updateChatTitle(title) {
    document.getElementById("chatTitle").textContent = title;
}

// 📌 Enviar mensaje
function sendMessage() {
    let userInput = document.getElementById("userInput").value.trim();
    if (userInput === "") return;

    let chatbox = document.getElementById("chatbox");

    // Mostrar mensaje del usuario
    let userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.textContent = "Tú: " + userInput;
    chatbox.appendChild(userMessage);

    // Generar respuesta del bot
    let botResponse = document.createElement("div");
    botResponse.classList.add("bot-response");
    botResponse.textContent = getBotResponse(userInput);
    chatbox.appendChild(botResponse);

    // Guardar mensaje en la conversación actual
    saveCurrentChat(userInput, botResponse.textContent);

    // Limpiar input
    document.getElementById("userInput").value = "";

    // Desplazar chat hacia abajo
    chatbox.scrollTop = chatbox.scrollHeight;
}

// 📌 Respuesta del bot
function getBotResponse(input) {
    let lowerInput = input.toLowerCase();
    if (lowerInput.includes("hola")) return "Bot: ¡Hola! ¿Cómo puedo ayudarte?";
    if (lowerInput.includes("apuntes")) return "Bot: ¿Qué tema necesitas para los apuntes?";
    return "Bot: Lo siento, no entendí eso.";
}

// 📌 Guardar conversación actual
function saveCurrentChat(userMessage, botMessage) {
    let currentChat = JSON.parse(localStorage.getItem("currentChat")) || [];
    currentChat.push("Tú: " + userMessage);
    currentChat.push(botMessage);
    localStorage.setItem("currentChat", JSON.stringify(currentChat));
}

// 📌 Guardar conversación en el historial
function saveConversation() {
    let chat = JSON.parse(localStorage.getItem("currentChat")) || [];
    if (chat.length === 0) return;

    let conversations = JSON.parse(localStorage.getItem("chatHistory")) || [];

    // 📌 El título será el primer mensaje del usuario
    let title = chat.find(msg => msg.startsWith("Tú:"));
    if (title) {
        title = title.replace("Tú: ", ""); // Eliminar "Tú: " del título
    } else {
        title = "Conversación sin título";
    }

    conversations.push({ title: title, messages: chat });
    localStorage.setItem("chatHistory", JSON.stringify(conversations));

    // Limpiar la conversación actual
    localStorage.removeItem("currentChat");
}

// 📌 Cargar lista de conversaciones en la barra lateral
function loadChatHistoryList() {
    let chatHistoryList = document.getElementById("chatHistoryList");
    chatHistoryList.innerHTML = ""; // Limpiar lista antes de cargar

    let conversations = JSON.parse(localStorage.getItem("chatHistory")) || [];
    
    conversations.forEach((conv, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = conv.title;
        listItem.onclick = function () {
            loadChat(index);
        };
        chatHistoryList.appendChild(listItem);
    });

    localStorage.removeItem("currentChat"); // Borrar chat actual al recargar
}

// 📌 Cargar una conversación anterior
function loadChat(index) {
    let chatbox = document.getElementById("chatbox");
    chatbox.innerHTML = ""; // Limpiar chat actual

    let conversations = JSON.parse(localStorage.getItem("chatHistory")) || [];
    let selectedChat = conversations[index];

    updateChatTitle(selectedChat.title); // 📌 Mostrar solo el título de la pregunta

    selectedChat.messages.forEach(msg => {
        let messageElement = document.createElement("div");
        messageElement.textContent = msg;
        if (msg.startsWith("Tú:")) {
            messageElement.classList.add("user-message");
        } else {
            messageElement.classList.add("bot-response");
        }
        chatbox.appendChild(messageElement);
    });

    chatbox.scrollTop = chatbox.scrollHeight;
}

// 📌 Guardar conversación antes de salir
window.addEventListener("beforeunload", saveConversation);
