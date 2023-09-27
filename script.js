const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
let isBotResponding = true; 

function addUserMessage(message) {
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = message;
    chatLog.appendChild(userMessage);
    adjustMessageWidth(userMessage); // Menyesuaikan lebar balon pesan
    disableUserInput(); // Nonaktifkan input pengguna setelah mengirim pesan
    // Lakukan pengolahan pesan chatbot di sini dan tambahkan respons chatbot
    // Contoh sederhana:
    setTimeout(function() {
        const botResponse = "Ini respons dari chatbot.";
        addBotMessage(botResponse);
        isBotResponding = true; // Setelah bot merespons, pengguna dapat mengirim pesan lagi
        enableUserInput(); // Aktifkan kembali input pengguna setelah bot merespons
    }, 1000); // Contoh respons setelah 1 detik
}

function addBotMessage(message) {
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.textContent = message;
    chatLog.appendChild(botMessage);
    adjustMessageWidth(botMessage); // Menyesuaikan lebar balon pesan
}

function adjustMessageWidth(messageElement) {
    const messageText = messageElement.textContent;
    const messageLength = messageText.length;
    const maxWidth = Math.min(messageLength * 2, 70); // Maksimum 70% lebar, disesuaikan dengan faktor 5

    messageElement.style.maxWidth = maxWidth + "%";
}

function disableUserInput() {
    userInput.disabled = true;
    sendButton.disabled = true;
}

function enableUserInput() {
    userInput.disabled = false;
    sendButton.disabled = false;
}

sendButton.addEventListener("click", function() {
    if (!isBotResponding) {
        return; // Pengguna tidak dapat mengirim pesan sampai bot merespons
    }
    
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addUserMessage(userMessage);
        userInput.value = ""; // Hapus input pengguna
    }
});

// Dapat juga menangani input dari keyboard
userInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendButton.click();
    }
});

// Aktifkan input pengguna pada awalnya
enableUserInput();
