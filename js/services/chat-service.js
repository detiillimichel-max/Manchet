const ChatService = {
    async sendMessage(senderId, text, type = 'text', mediaUrl = null) {
        const { data, error } = await supabase
            .from('mensagens')
            .insert([{
                remetente_id: senderId,
                conteudo: text,
                tipo: type,
                midia_url: mediaUrl,
                status: 'enviada'
            }]);
        return { data, error };
    },

    // Lógica para gravação de áudio (Web Audio API)
    startRecording() {
        return new Promise(async (resolve, reject) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                const audioChunks = [];

                mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    resolve(audioBlob);
                };

                mediaRecorder.start();
                resolve(mediaRecorder);
            } catch (err) {
                reject(err);
            }
        });
    }
};

