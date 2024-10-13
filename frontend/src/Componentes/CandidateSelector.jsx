import React, { useState, useEffect } from 'react';
import { Form, FormControl, ListGroup, Button, Spinner, Alert, Card } from 'react-bootstrap';
import candidatoService from '../Services/CandidatoService';

function CandidateSelector({ onSelect }) {
  const [candidatos, setCandidatos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null); 

  useEffect(() => {
    const fetchCandidatos = async () => {
      setLoading(true);
      setErro(null);
      try {
        let resultados;
        if (termoBusca.trim() !== '') {
          console.log('Buscando candidatos com o termo:', termoBusca);  
          resultados = await candidatoService.filtrarPorNome(termoBusca);
        } else {
          console.log('Buscando todos os candidatos'); 
          resultados = await candidatoService.obterTodos();
        }

        console.log('Candidatos obtidos:', resultados); 

        
        if (!Array.isArray(resultados)) {
          throw new Error('Formato de dados inválido recebido da API.');
        }

        
        const sortedCandidates = resultados.sort((a, b) => a.cand_nome.localeCompare(b.cand_nome));

        console.log('Candidatos ordenados:', sortedCandidates); 

        setCandidatos(sortedCandidates);
      } catch (error) {
        console.error('Erro ao buscar candidatos:', error);
        setErro('Falha ao buscar candidatos. Por favor, tente novamente mais tarde.');
      }
      setLoading(false);
    };


    const debounceFetch = setTimeout(() => {
      fetchCandidatos();
    }, 300); 

    return () => clearTimeout(debounceFetch); 
  }, [termoBusca]);

  const handleSelect = (candidato) => {
    setCandidatoSelecionado(candidato);
    onSelect(candidato);
    console.log('Candidato selecionado:', candidato); 
  };

  const handleDeselecionar = () => {
    setCandidatoSelecionado(null);
    onSelect(null);
    console.log('Candidato deselecionado'); 
  };

  return (
    <div>
      <Form.Group controlId="buscarCandidato">
        <Form.Label>Buscar Candidato por Nome</Form.Label>
        <FormControl
          type="text"
          placeholder="Digite o nome do candidato"
          value={termoBusca}
          onChange={(e) => {
            console.log('Termo de Busca Atualizado:', e.target.value);
            setTermoBusca(e.target.value);
          }}
        />
      </Form.Group>

      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {erro && (
            <Alert variant="danger" onClose={() => setErro(null)} dismissible>
              {erro}
            </Alert>
          )}
          <ListGroup className="mt-2">
            {candidatos.length > 0 ? (
              candidatos.map((candidato) => (
                <ListGroup.Item
                  key={candidato.pk_cand_cpf}
                  active={candidatoSelecionado?.pk_cand_cpf === candidato.pk_cand_cpf}
                  onClick={() => handleSelect(candidato)}
                  style={{ cursor: 'pointer' }}
                >
                  {candidato.cand_nome} - {candidato.pk_cand_cpf}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>Nenhum candidato encontrado.</ListGroup.Item>
            )}
          </ListGroup>
        </>
      )}

      {candidatoSelecionado && (
        <Card className="mt-4">
          <Card.Header>
            <strong>Detalhes do Candidato</strong>
          </Card.Header>
          <Card.Body>
            <p>
              <strong>Nome:</strong> {candidatoSelecionado.cand_nome}
            </p>
            <p>
              <strong>CPF:</strong> {candidatoSelecionado.pk_cand_cpf}
            </p>
            <p>
              <strong>Telefone:</strong> {candidatoSelecionado.cand_telefone}
            </p>
            <p>
              <strong>Endereço:</strong> {candidatoSelecionado.cand_endereco}
            </p>
            
            <Button variant="secondary" onClick={handleDeselecionar}>
              Deselecionar Candidato
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default CandidateSelector;
