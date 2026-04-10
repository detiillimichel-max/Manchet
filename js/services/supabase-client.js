/**
 * OIO ONE - WhatsApp Lite PWA Luxury
 * Serviço de Conexão Oficial Supabase
 */

const SUPABASE_URL = 'https://uqdwtzlkqaosnweyoyit.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uafBQD1aJ3w8_eq4meOsNQ_wzk8TwhA';

// Inicializa o cliente Supabase globalmente
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const SupabaseService = {
    /**
     * Login por Identidade e Código
     * Busca na tabela 'usuarios' o registro que coincide com os campos
     */
    async login(nome, senha) {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('identidade', nome)
                .eq('codigo', senha)
                .single();
                
            if (error || !data) {
                throw new Error('Identidade ou Código não encontrados.');
            }
            
            return data;
        } catch (err) {
            console.error("Erro na autenticação:", err.message);
            throw err;
        }
    },

    /**
     * Gerenciamento de Presença (Online/Offline)
     */
    async updatePresence(userId, status) {
        const { error } = await supabase
            .from('usuarios')
            .update({ status_online: status, ultima_vez: new Date() })
            .eq('id', userId);
        if (error) console.error("Erro ao atualizar presença:", error);
    },

    /**
     * Escuta a tabela 'mensagens' em Tempo Real
     */
    subscribeToMessages(callback) {
        return supabase
            .channel('public:mensagens')
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'mensagens' 
                }, 
                payload => {
                    callback(payload.new);
                }
            )
            .subscribe();
    },

    /**
     * Envio de Mensagem (Texto, Imagem ou Áudio)
     */
    async sendMessage(msgData) {
        const { data, error } = await supabase
            .from('mensagens')
            .insert([{
                remetente_id: msgData.remetente_id,
                conteudo: msgData.conteudo,
                tipo: msgData.tipo || 'text',
                midia_url: msgData.midia_url || null,
                status: 'enviada',
                created_at: new Date()
            }]);
            
        if (error) throw error;
        return data;
    },

    /**
     * Upload de Arquivos (Fotos e Áudios) para o Storage
     * Pasta padrão: 'uploads'
     */
    async uploadMedia(file, folder = 'chat-media') {
        const fileExt = file.name ? file.name.split('.').pop() : 'webm';
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('bucket_vibe') // Certifique-se de que o bucket existe com este nome
            .upload(filePath, file);

        if (error) throw error;

        // Gera a URL pública do arquivo
        const { data: publicUrlData } = supabase.storage
            .from('bucket_vibe')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    }
};
