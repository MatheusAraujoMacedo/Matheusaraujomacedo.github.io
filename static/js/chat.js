const chatToggle = document.getElementById('chatbot-toggle');
const chatContainer = document.getElementById('chatbot-container');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chatbot-messages');
const chatToggleWrapper = document.querySelector('.chatbot-toggle-wrapper');
const chatTooltip = document.getElementById('chatbot-tooltip');
const closeTooltipBtn = document.getElementById('close-tooltip');

if (chatToggle && chatContainer) {
    // Tooltip animation logic
    if (chatTooltip) {
        setTimeout(() => {
            if (!chatContainer.classList.contains('active')) {
                chatTooltip.classList.add('show');
                setTimeout(() => chatTooltip.classList.add('bounce'), 600);
            }
        }, 5000);

        if (closeTooltipBtn) {
            closeTooltipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                chatTooltip.classList.remove('show', 'bounce');
            });
        }
    }

    chatToggle.addEventListener('click', () => {
        chatContainer.classList.add('active');
        if (chatToggleWrapper) chatToggleWrapper.classList.add('hidden');
        if (chatTooltip) chatTooltip.classList.remove('show', 'bounce');
    });

    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        if (chatToggleWrapper) chatToggleWrapper.classList.remove('hidden');
    });

    const handleSend = async () => {
        const text = chatInput.value.trim();
        if (!text) return;
        
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        const userContent = document.createElement('div');
        userContent.className = 'message-content';
        const userParagraph = document.createElement('p');
        userParagraph.textContent = text;
        userContent.appendChild(userParagraph);
        userMsg.appendChild(userContent);
        chatMessages.appendChild(userMsg);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai-message typing';
        aiMsg.innerHTML = `<div class="message-content"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(CHAT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) {
                throw new Error("Erro na solicitação");
            }

            const data = await response.json();
            
            aiMsg.classList.remove('typing');
            
            aiMsg.innerHTML = `<div class="message-content"><p>${formatAiMessage(data.response)}</p></div>`;

        } catch {
            aiMsg.classList.remove('typing');
            const isEng = currentLang === 'en';
            aiMsg.innerHTML = `<div class="message-content"><p>${
                isEng 
                ? "Sorry, I couldn't connect to the AI API. Please verify the Cloudflare setup." 
                : "Desculpe, não consegui me conectar à API da IA. Verifique as configurações do Cloudflare."
            }</p></div>`;
        }
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendChat.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}