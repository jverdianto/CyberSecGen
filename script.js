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
    chatLog.appendChild(botMessage);

    // Animasi efek ketikan
    let charIndex = 0;
    const typingInterval = setInterval(() => {
        if (charIndex < message.length) {
            const typingText = document.createElement("span");
            typingText.textContent = message.charAt(charIndex);
            botMessage.appendChild(typingText);
            charIndex++;
        } else {
            clearInterval(typingInterval); // Hentikan animasi ketika semua karakter ditampilkan
            adjustMessageWidth(botMessage);
        }
    }, 50); // Interval waktu antara penambahan karakter
}

function adjustMessageWidth(messageElement) {
    const messageText = messageElement.textContent;
    const messageLength = messageText.length;
    const maxWidth = Math.min(messageLength, 70); // Maksimum 70% lebar, disesuaikan dengan faktor 5

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

// sendButton.addEventListener("click", function() {
//     if (!isBotResponding) {
//         return; // Pengguna tidak dapat mengirim pesan sampai bot merespons
//     }
    
//     const userMessage = userInput.value.trim();
//     if (userMessage) {
//         addUserMessage(userMessage);

//         // Persiapkan header dan body permintaan
//         const apiUrl = "http://192.168.193.109:5000/api"; // Ganti dengan URL API Anda
//         const headers = {
//             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
//             'Accept-Language': 'en-US,en;q=0.5',
//             'Accept-Encoding': 'gzip, deflate',
//             'Connection': 'close',
//             'Upgrade-Insecure-Requests': '1',
//             'Content-Type': 'application/json',
//             'Content-Length': userMessage.length.toString()
//         };
//         const requestOptions = {
//             method: 'POST',
//             headers: headers,
//             body: JSON.stringify({ message: userMessage })
//         };

//         // Kirim permintaan ke API
//         fetch(apiUrl, requestOptions)
//             .then(response => response.json())
//             .then(data => {
//                 // Tanggapan dari API
//                 addBotMessage(data.botResponse); // Menambahkan respons chatbot ke log
//                 isBotResponding = true;
//                 enableUserInput();
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 isBotResponding = true;
//                 enableUserInput();
//             });

//         userInput.value = ""; // Hapus input pengguna
//     }
// });

sendButton.addEventListener("click", function(){
    if (!isBotResponding) {
        return;
    }

    const userMessage = userInput.value.trim();
    if (userMessage) {
        addUserMessage(userMessage);
        
        // Kirim pesan pengguna ke API
        var raw = JSON.stringify({
            "message": "What is cyber security?"
        });

        var requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: raw,
            redirect: 'follow'
        };

        fetch("http://192.168.193.109:5000/api", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

        userInput.value= "";
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
