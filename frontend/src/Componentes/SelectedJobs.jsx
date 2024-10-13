import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function SelectedJobs({ selectedJobs, onRemoveJob }) {
  return (
    <div>
      <h5>Vagas Selecionadas</h5>
      {selectedJobs.length === 0 ? (
        <p>Nenhuma vaga selecionada.</p>
      ) : (
        <ListGroup>
          {selectedJobs.map((vaga) => (
            <ListGroup.Item key={vaga.pk_vaga_codigo} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{vaga.vaga_cargo}</strong> - {vaga.vaga_cidade} - R${vaga.vaga_salario}
              </div>
              <Button variant="danger" size="sm" onClick={() => onRemoveJob(vaga.pk_vaga_codigo)}>
                Remover
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default SelectedJobs;
