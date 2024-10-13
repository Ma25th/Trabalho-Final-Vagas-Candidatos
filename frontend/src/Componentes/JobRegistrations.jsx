import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import vagaService from '../Services/VagaService';
import inscricaoService from '../Services/InscricaoService';

function JobRegistrations() {
    const [vagas, setVagas] = useState([]);
    const [inscricoes, setInscricoes] = useState({});
    const [loadingVagas, setLoadingVagas] = useState(false);
    const [loadingInscricoes, setLoadingInscricoes] = useState({});
    const [erroVagas, setErroVagas] = useState(null);
    const [erroInscricoes, setErroInscricoes] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [inscricaoParaRemover, setInscricaoParaRemover] = useState(null);
    const [alerta, setAlerta] = useState({ show: false, variant: '', message: '' });

    useEffect(() => {
        const fetchVagas = async () => {
            setLoadingVagas(true);
            setErroVagas(null);
            try {
                const todasVagas = await vagaService.obterTodas();
                
                
                const sortedVagas = [...todasVagas].sort((a, b) => 
                    a.vaga_cargo.localeCompare(b.vaga_cargo)
                );

                setVagas(sortedVagas);
                console.log('Vagas obtidas e ordenadas:', sortedVagas); 
            } catch (error) {
                console.error('Erro ao buscar vagas:', error);
                setErroVagas('Falha ao buscar vagas. Por favor, tente novamente mais tarde.');
            }
            setLoadingVagas(false);
        };

        fetchVagas();
    }, []);

    const handleShowInscricoes = async (codigoVaga) => {
        console.log('Código da Vaga solicitado:', codigoVaga); 

        
        if (inscricoes[codigoVaga]) {
            
            setInscricoes((prev) => {
                const newInscricoes = { ...prev };
                delete newInscricoes[codigoVaga];
                return newInscricoes;
            });
            return;
        }

        setLoadingInscricoes((prev) => ({ ...prev, [codigoVaga]: true }));
        setErroInscricoes((prev) => ({ ...prev, [codigoVaga]: null }));

        try {
            const inscricoesVaga = await inscricaoService.getInscricoesByVaga(codigoVaga);
            setInscricoes((prev) => ({ ...prev, [codigoVaga]: inscricoesVaga }));
            console.log(`Inscrições para vaga ${codigoVaga}:`, inscricoesVaga); 
        } catch (error) {
            console.error(`Erro ao buscar inscrições para vaga ${codigoVaga}:`, error);
            setErroInscricoes((prev) => ({
                ...prev,
                [codigoVaga]: 'Falha ao buscar inscrições desta vaga.',
            }));
        }

        setLoadingInscricoes((prev) => ({ ...prev, [codigoVaga]: false }));
    };

    const handleRemoverInscricao = (cpf, codigoVaga) => {
        console.log(`Remover inscrição: CPF=${cpf}, CódigoVaga=${codigoVaga}`); 
        setInscricaoParaRemover({ cpf, codigoVaga });
        setShowModal(true);
    };

    const confirmRemoverInscricao = async () => {
        const { cpf, codigoVaga } = inscricaoParaRemover;
        setAlerta({ show: false, variant: '', message: '' });
        try {
            await inscricaoService.removerInscricao(cpf, codigoVaga);
            setAlerta({ show: true, variant: 'success', message: 'Inscrição removida com sucesso.' });
            
            setInscricoes((prev) => ({
                ...prev,
                [codigoVaga]: prev[codigoVaga].filter((insc) => insc.pk_cand_cpf !== cpf),
            }));
            console.log(`Inscrição removida: CPF=${cpf}, CódigoVaga=${codigoVaga}`); 
        } catch (error) {
            console.error('Erro ao remover inscrição:', error);
            setAlerta({ show: true, variant: 'danger', message: `Erro: ${error.message}` });
        }
        setShowModal(false);
        setInscricaoParaRemover(null);
    };

    return (
        <div className="mt-5">
            <h2>Vagas e Inscrições</h2>

            {alerta.show && (
                <Alert
                    variant={alerta.variant}
                    onClose={() => setAlerta({ ...alerta, show: false })}
                    dismissible
                >
                    {alerta.message}
                </Alert>
            )}

            {loadingVagas ? (
                <div className="text-center my-3">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Carregando vagas...</span>
                    </Spinner>
                </div>
            ) : erroVagas ? (
                <Alert variant="danger">{erroVagas}</Alert>
            ) : (
                <ListGroup>
                    {vagas.map((vaga) => (
                        <ListGroup.Item key={vaga.pk_vaga_codigo}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{vaga.vaga_cargo}</strong> - {vaga.vaga_cidade} - R${vaga.vaga_salario} -{' '}
                                    {vaga.vaga_quantidade} disponível(s)
                                </div>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => handleShowInscricoes(vaga.pk_vaga_codigo)}
                                >
                                    {inscricoes[vaga.pk_vaga_codigo] ? 'Ocultar Inscrições' : 'Mostrar Inscrições'}
                                </Button>
                            </div>
                            
                            {inscricoes[vaga.pk_vaga_codigo] && (
                                <div className="mt-3">
                                    {loadingInscricoes[vaga.pk_vaga_codigo] ? (
                                        <Spinner animation="border" role="status" size="sm">
                                            <span className="visually-hidden">Carregando inscrições...</span>
                                        </Spinner>
                                    ) : erroInscricoes[vaga.pk_vaga_codigo] ? (
                                        <Alert variant="danger">{erroInscricoes[vaga.pk_vaga_codigo]}</Alert>
                                    ) : inscricoes[vaga.pk_vaga_codigo].length > 0 ? (
                                        <ListGroup>
                                            {inscricoes[vaga.pk_vaga_codigo].map((insc) => (
                                                <ListGroup.Item 
                                                    key={`${insc.pk_cand_cpf}-${vaga.pk_vaga_codigo}`} 
                                                    className="d-flex justify-content-between align-items-center"
                                                >
                                                    <div>
                                                        {insc.cand_nome} - {insc.pk_cand_cpf}
                                                    </div>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRemoverInscricao(insc.pk_cand_cpf, vaga.pk_vaga_codigo)}
                                                    >
                                                        Remover Inscrição
                                                    </Button>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    ) : (
                                        <p>Nenhum candidato inscrito para esta vaga.</p>
                                    )}
                                </div>
                            )}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Remoção</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza de que deseja remover esta inscrição?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmRemoverInscricao}>
                        Remover
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default JobRegistrations;
