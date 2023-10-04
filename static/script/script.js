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

function addBotMessage() {
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

	fetch("http://localhost:5000/api/streamdata", requestOptions)
		.then(response => {
			botMessage = addBotMessage()
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
					botMessage.append(chunkString)
					// Memeriksa jika ada karakter baris baru (\n) dalam result.message
					if (chunkString.includes('\n')) {
						message = chunkString.split('\n')
						if (message[1] != '') {
							botMessage.textContent = botMessage.textContent.replace(message[1], '')
							botMessage = addBotMessage()
							botMessage.append(message[1])
						} else {
							botMessage = addBotMessage()
						}; // Menambahkan setiap baris sebagai pesan baru
					}
					// Continue reading the next chunk
					readNextChunk();
				});
			}

			// Start reading the stream
			readNextChunk();
			isBotResponding = true;
			enableUserInput();
		})
		.catch(error => {
			console.log('error', error);
		});
}

sendButton.addEventListener("click", function(){
    if (!isBotResponding) {
        return;
    }

    const userMessage = userInput.value.trim();
    if (userMessage) {
        addUserMessage(userMessage);
        sendUserMessage(userMessage);
        userInput.value = "";
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

// Aktifkan input pengguna pada awalnya
enableUserInput();
