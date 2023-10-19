const chatLog = document.getElementById("chat-log");
const colorThemes = document.querySelectorAll('[name="theme"]');
const markdown = window.markdownit().use(window.markdownItAttrs);
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
var chatRequest = 
    {
        "message": []
    }

let isBotResponding = true; 
var botMessageCount = 0;
var codeFlag = false

markdown.renderer.rules.list_item_open = function (tokens, idx) {
    const classAttribute = 'class="no-list-break"';
    return `<li ${classAttribute}>`;
  };

function addUserMessage(message) {
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = message;
    chatLog.appendChild(userMessage);
    adjustMessageWidth(userMessage); // Menyesuaikan lebar balon pesan
    disableUserInput(); // Nonaktifkan input pengguna setelah mengirim pesan
}

function addBotMessage(){
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
    var userRequest = {
        "role": "user",
        "content": userMessage
    }
    chatRequest.message.push(userRequest)
    // Kirim pesan pengguna ke API
    var raw = JSON.stringify(chatRequest);

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
    fetch("http://127.0.0.1:5000/api/streamdata", requestOptions)
		.then(response => {
			botMessage = addBotMessage()
			const stream = response.body;
			const textDecoder = new TextDecoder('utf-8');
        
			// Process the text stream
			const reader = stream.getReader();
            var text = ""
			function readNextChunk() {
				reader.read().then(({
					done,
					value
				}) => {
                    
					if (done) {
						var y = document.getElementsByClassName('bot-message');
                        y[botMessageCount].innerHTML = y[botMessageCount].innerHTML.trim()
                        var content = y[botMessageCount].innerText
                        var chatResponse = {
                            "role": "assistant",
                            "content": content
                        }
                        chatRequest.message.push(chatResponse)
                        botMessageCount++;
						return;
					}
					const chunkString = textDecoder.decode(value);
                    text += chunkString;
                    botMessage.innerHTML = markdown.render(text)
                    document.querySelectorAll(`code`).forEach((el) => {hljs.highlightElement(el);})
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
// Aktifkan input pengguna pada awalnya
enableUserInput();
