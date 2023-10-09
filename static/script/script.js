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
    }, 10); // Interval waktu antara penambahan karakter
}

function addStreamMessage(){
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    chatLog.appendChild(botMessage);
    return botMessage
}

function adjustMessageWidth(messageElement) {
    const messageText = messageElement.textContent;
    const messageLength = messageText.length;
    const width = Math.min((messageLength + 2.5) * 9, 700) + "px";

    messageElement.style.width = width;
}

function disableUserInput() {
    userInput.disabled = true;
    sendButton.disabled = true;
}

function enableUserInput() {
    userInput.disabled = false;
    sendButton.disabled = false;
}

function sendUserMessage(userMessage) {
    // Kirim pesan pengguna ke API
    var raw = JSON.stringify({
        "message": userMessage
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
    streamData(requestOptions)
}

function loading() {
    const loading = document.createElement("div");
    loading.className = "loader";
    chatLog.appendChild(loading);
}

sendButton.addEventListener("click", function(){
    if (!isBotResponding) {
        return;
    } else {
        const userMessage = userInput.value.trim();
        if (userMessage) { 
            addUserMessage(userMessage);
            sendUserMessage(userMessage);
            userInput.value = "";
            loading();
        }  
    }  
});

// Dapat juga menangani input dari keyboard
userInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        if (!event.shiftKey) {
            sendButton.click();
        }
    }
});

function streamData (requestOptions){
    fetch("http://localhost:5000/api/streamdata", requestOptions)
		.then(response => {
			botMessage = addStreamMessage()
			const stream = response.body;
			const textDecoder = new TextDecoder('utf-8');
            
			let flag = 0
			// Process the text stream
			const reader = stream.getReader();

			function readNextChunk() {
				reader.read().then(({
					done,
					value
				}) => {

					if (done) {
						// The stream has ended
						console.log('Stream ended');
						return;
					}
					const chunkString = textDecoder.decode(value);
                    console.log(chunkString)
					botMessage.append(chunkString)
					// Memeriksa jika ada karakter baris baru (\n) dalam result.message
					if (chunkString.includes('\n')) {
						message = chunkString.split('\n')
						if (message[1] != '') {
							botMessage.textContent = botMessage.textContent.replace(message[1], '')
							botMessage = addStreamMessage()
							botMessage.append(message[1])
						} else {
							botMessage = addStreamMessage()
						}; // Menambahkan setiap baris sebagai pesan baru
					}
					// Continue reading the next chunk
					readNextChunk();
				});
			}

			// Start reading the stream
			readNextChunk();
			isBotResponding = true;
            const loadingElements = chatLog.getElementsByClassName("loader");
            while (loadingElements.length > 0) {
            chatLog.removeChild(loadingElements[0]);
            }
			enableUserInput();
		})
		.catch(error => {
			console.log('error', error);
		});
}

function notStreamData(requestOptions){
    fetch("http://localhost:5000/api/data", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        console.log(result.keyword);
        // Memeriksa jika ada karakter baris baru (\n) dalam result.message
        if (result.message.includes('\n\n')) {
            const messageLines = result.message.split('\n\n');
            messageLines.forEach(line => {
                addBotMessage(line); // Menambahkan setiap baris sebagai pesan baru
            });
        } else {
            addBotMessage(result.message); // Jika tidak ada karakter baris baru
        }
        isBotResponding = true;
        // Hapus elemen "loading" setelah data bot dimuat
        const loadingElements = chatLog.getElementsByClassName("loader");
        while (loadingElements.length > 0) {
            chatLog.removeChild(loadingElements[0]);
        }
        enableUserInput();
    })
    .catch(error => {
        console.log('error', error);
    });
}
// Aktifkan input pengguna pada awalnya
enableUserInput();
