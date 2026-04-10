const ChatUI = {
    container: document.getElementById('chat-container'),

    renderMessage(msg, isMine) {
        const bubble = document.createElement('div');
        bubble.className = `msg-bubble flex flex-col ${isMine ? 'msg-sent' : 'msg-received'}`;
        
        let contentHtml = '';
        if (msg.tipo === 'text') {
            contentHtml = `<span>${msg.conteudo}</span>`;
        } else if (msg.tipo === 'audio') {
            contentHtml = `<audio controls src="${msg.midia_url}" class="h-8 max-w-[200px]"></audio>`;
        }

        bubble.innerHTML = `
            ${contentHtml}
            <div class="flex items-center justify-end gap-1 mt-1">
                <span class="text-[10px] text-white/50">${this.formatTime(msg.created_at)}</span>
                ${isMine ? this.getChecks(msg.status) : ''}
            </div>
        `;
        
        this.container.appendChild(bubble);
        this.scrollToBottom();
    },

    formatTime(dateString) {
        if(!dateString) return 'agora';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    getChecks(status) {
        // Retorna SVGs de check baseado no status (enviado, entregue, lido)
        return `<span class="text-emerald-400 text-[10px]">✓✓</span>`;
    },

    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight;
    }
};

