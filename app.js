let currentUser = null;
let activeMediaRecorder = null;

document.addEventListener('DOMContentLoaded', () => {
    // Registro do Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(() => {
            console.log('Service Worker registrado com sucesso no GitHub Pages.');
        });
    }

    // Elementos da UI
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    const btnLogin = document.getElementById('btn-login');
    const inputMsg = document.getElementById('msg-input');
    const btnSend = document.getElementById('btn-send');
    const btnMic = document.getElementById('btn-mic');

    // Lógica de Login
    btnLogin.addEventListener('click', async () => {
        const nome = document.getElementById('login-nome').value;
        const senha = document.getElementById('login-senha').value;
        
        if(nome && senha) {
            // Em produção, isso chama o SupabaseService.login
            currentUser = { id: 1, nome: nome }; 
            loginScreen.classList.add('hidden');
            appScreen.classList.remove('hidden');
            appScreen.classList.add('flex');
            
            // Inicia a escuta de mensagens em tempo real
            SupabaseService.subscribeToMessages(newMsg => {
                const isMine = newMsg.remetente_id === currentUser.id;
                ChatUI.renderMessage(newMsg, isMine);
            });
        }
    });

    // Alternar entre botão de Enviar Texto e Microfone
    inputMsg.addEventListener('input', (e) => {
        if(e.target.value.trim().length > 0) {
            btnSend.classList.remove('hidden');
            btnMic.classList.add('hidden');
        } else {
            btnSend.classList.add('hidden');
            btnMic.classList.remove('hidden');
        }
    });

    // Enviar mensagem de texto
    btnSend.addEventListener('click', () => {
        const text = inputMsg.value.trim();
        if(text) {
            // Simulação local para teste de UI imediato
            ChatUI.renderMessage({ conteudo: text, tipo: 'text', status: 'enviada' }, true);
            // Em produção: ChatService.sendMessage(currentUser.id, text);
            inputMsg.value = '';
            btnSend.classList.add('hidden');
            btnMic.classList.remove('hidden');
        }
    });
});
