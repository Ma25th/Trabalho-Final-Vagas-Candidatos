import React, { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import CandidateSelector from '../Componentes/CandidateSelector';
import JobList from '../Componentes/JobList';
import SelectedJobs from '../Componentes/SelectedJobs';
import inscricaoService from '../Services/InscricaoService';
import JobRegistrations from '../Componentes/JobRegistrations'; 

function InscricaoPage() {
    const [candidato, setCandidato] = useState(null);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [alerta, setAlerta] = useState({ show: false, variant: '', message: '' });

    const handleAddJob = (vaga) => {
        if (!selectedJobs.find((job) => job.pk_vaga_codigo === vaga.pk_vaga_codigo)) {
            setSelectedJobs([...selectedJobs, vaga]);
        }
    };

    const handleRemoveJob = (codigo) => {
        setSelectedJobs(selectedJobs.filter((job) => job.pk_vaga_codigo !== codigo));
    };

    const handleSubmit = async () => {
        if (!candidato) {
            setAlerta({ show: true, variant: 'danger', message: 'Por favor, selecione um candidato.' });
            return;
        }

        if (selectedJobs.length === 0) {
            setAlerta({ show: true, variant: 'danger', message: 'Por favor, selecione pelo menos uma vaga.' });
            return;
        }

        try {
            for (let vaga of selectedJobs) {
                const jaInscrito = await inscricaoService.verificarInscricao(candidato.pk_cand_cpf, vaga.pk_vaga_codigo);
                if (jaInscrito) {
                    setAlerta({
                        show: true,
                        variant: 'warning',
                        message: `O candidato já está inscrito para a vaga "${vaga.vaga_cargo}".`,
                    });
                    continue;
                }

                await inscricaoService.criarInscricao({
                    pk_cand_cpf: candidato.pk_cand_cpf,
                    pk_vaga_codigo: vaga.pk_vaga_codigo,
                    data_inscricao: new Date().toISOString().split('T')[0], 
                    horario_inscricao: new Date().toTimeString().split(' ')[0],
                });

                setAlerta({
                    show: true,
                    variant: 'success',
                    message: `Inscrição para a vaga "${vaga.vaga_cargo}" realizada com sucesso.`,
                });

                setSelectedJobs(selectedJobs.filter((j) => j.pk_vaga_codigo !== vaga.pk_vaga_codigo));
            }
        } catch (error) {
            setAlerta({ show: true, variant: 'danger', message: `Erro: ${error.message}` });
        }
    };

    return (
        <Container>
            <h1 className="my-4">Inscrição em Vagas</h1>

            {alerta.show && (
                <Alert variant={alerta.variant} onClose={() => setAlerta({ ...alerta, show: false })} dismissible>
                    {alerta.message}
                </Alert>
            )}

            <CandidateSelector onSelect={setCandidato} />

            {candidato && (
                <div className="mt-4">
                    <h4>Candidato Selecionado:</h4>
                    <p>
                        <strong>Nome:</strong> {candidato.cand_nome} <br />
                        <strong>CPF:</strong> {candidato.pk_cand_cpf}
                        
                    </p>
                </div>
            )}

            <JobList onAddJob={handleAddJob} selectedJobs={selectedJobs} />

            <SelectedJobs selectedJobs={selectedJobs} onRemoveJob={handleRemoveJob} />

            <Button className="mt-3" onClick={handleSubmit} disabled={!candidato || selectedJobs.length === 0}>
                Candidatar-se às Vagas Selecionadas
            </Button>

            
            <JobRegistrations />
        </Container>
    );
}

export default InscricaoPage;
