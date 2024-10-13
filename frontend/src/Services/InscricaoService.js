const API_BASE_URL = 'http://localhost:4000';

class InscricaoService {
    async criarInscricao(inscricao) {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inscricao),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar inscrição');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async verificarInscricao(cpf, codigo) {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes/${cpf}/${codigo}`);
            if (response.status === 404) {
                return false;
            }
            if (!response.ok) {
                throw new Error('Erro ao verificar inscrição');
            }
            const data = await response.json();
            return !!data;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    
    async getInscricoesByVaga(codigoVaga) {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes/vaga/${codigoVaga}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar inscrições da vaga');
            }
            return await response.json();
        } catch (error) {
            console.error('Error in getInscricoesByVaga:', error);
            throw error;
        }
    }

    
    async removerInscricao(cpf, codigoVaga) {
        try {
            const response = await fetch(`${API_BASE_URL}/inscricoes/${cpf}/${codigoVaga}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover inscrição');
            }
            return await response.json();
        } catch (error) {
            console.error('Error in removerInscricao:', error);
            throw error;
        }
    }
}

const inscricaoService = new InscricaoService();
export default inscricaoService;
