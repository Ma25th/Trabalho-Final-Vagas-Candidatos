

const API_BASE_URL = 'http://localhost:4000';

class VagaService {
    
    async obterTodas() {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas`);
            if (!response.ok) {
                throw new Error('Erro ao buscar vagas');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro em obterTodas:', error);
            return [];
        }
    }

    
    async filtrarPorCargo(cargo) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas?search=${encodeURIComponent(cargo)}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar vagas por cargo');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro em filtrarPorCargo:', error);
            return [];
        }
    }

    
    async criarVaga(vagaData) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vagaData),
            });
            if (!response.ok) {
                throw new Error('Erro ao criar vaga');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro em criarVaga:', error);
            throw error;
        }
    }

    
    async atualizarVaga(codigo, vagaData) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas/${codigo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vagaData),
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar vaga');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro em atualizarVaga:', error);
            throw error;
        }
    }

    
    async deletarVaga(codigo) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas/${codigo}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erro ao deletar vaga');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro em deletarVaga:', error);
            throw error;
        }
    }

    
    async decrementVagaQuantidade(codigo) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas/${codigo}/decrement`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                throw new Error('Erro ao decrementar quantidade de vagas');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro em decrementVagaQuantidade:', error);
            throw error;
        }
    }

    
    async incrementVagaQuantidade(codigo) {
        try {
            const response = await fetch(`${API_BASE_URL}/vagas/${codigo}/increment`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                throw new Error('Erro ao incrementar quantidade de vagas');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro em incrementVagaQuantidade:', error);
            throw error;
        }
    }
}

const vagaService = new VagaService();
export default vagaService;
