import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Badge } from 'react-bootstrap';
import vagaService from '../Services/VagaService';

function JobList({ onAddJob, selectedJobs }) {
  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const todasVagas = await vagaService.obterTodas();
        

        const sortedVagas = [...todasVagas].sort((a, b) => 
          a.vaga_cargo.localeCompare(b.vaga_cargo)
        );

        setVagas(sortedVagas);
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        
      }
    };

    fetchVagas();
  }, []);

  const handleAddJob = (vaga) => {
    onAddJob(vaga);
  };

  return (
    <div>
      <h5>Vagas Disponíveis</h5>
      <ListGroup>
        {vagas.map((vaga) => (
          <ListGroup.Item 
            key={vaga.pk_vaga_codigo} 
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{vaga.vaga_cargo}</strong> - {vaga.vaga_cidade} - R${vaga.vaga_salario}
              <Badge bg="info" className="ms-2">
                {vaga.vaga_quantidade} disponível(s)
              </Badge>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAddJob(vaga)}
              disabled={
                vaga.vaga_quantidade <= 0 || 
                selectedJobs.some((j) => j.pk_vaga_codigo === vaga.pk_vaga_codigo)
              }
            >
              {selectedJobs.some((j) => j.pk_vaga_codigo === vaga.pk_vaga_codigo) 
                ? 'Selecionado' 
                : 'Selecionar'}
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default JobList;
