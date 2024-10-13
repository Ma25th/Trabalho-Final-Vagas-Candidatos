const API_BASE_URL = 'http://localhost:4000';

class CandidatoService {
  async obterTodos() {
    try {
      const url = `${API_BASE_URL}/candidatos`;
      console.log(`Fetching candidatos from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar candidatos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in obterTodos:', error);
      return [];
    }
  }

  async filtrarPorNome(nome) {
    try {
      const url = `${API_BASE_URL}/candidatos/search?search=${encodeURIComponent(nome)}`;
      console.log(`Fetching candidatos with search term: ${nome} from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar candidatos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in filtrarPorNome:', error);
      return [];
    }
  }

  async criarCandidato(candidato) {
    try {
      const url = `${API_BASE_URL}/candidatos`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidato)
      });
      if (!response.ok) {
        throw new Error('Erro ao criar candidato');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in criarCandidato:', error);
      return null;
    }
  }

  async atualizarCandidato(cpf, candidato) {
    try {
      const url = `${API_BASE_URL}/candidatos/${encodeURIComponent(cpf)}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidato)
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar candidato');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in atualizarCandidato:', error);
      return null;
    }
  }

  async excluirCandidato(cpf) {
    try {
      const url = `${API_BASE_URL}/candidatos/${encodeURIComponent(cpf)}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir candidato');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in excluirCandidato:', error);
      return null;
    }
  }
}

const candidatoService = new CandidatoService();
export default candidatoService;
