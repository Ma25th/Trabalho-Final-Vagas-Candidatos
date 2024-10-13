import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Container, Alert, ListGroup, InputGroup, FormControl, Modal, Spinner } from 'react-bootstrap';
import vagaService from '../Services/VagaService'; 
import debounce from 'lodash.debounce';

function VagaCadastro() {
    const [validado, setValidado] = useState(false);
    const [cargo, setCargo] = useState("");
    const [salario, setSalario] = useState("");
    const [cidade, setCidade] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mensagemAlerta, setMensagemAlerta] = useState("");
    const [erroCadastro, setErroCadastro] = useState("");
    const [listaVagas, setListaVagas] = useState([]);
    const [editando, setEditando] = useState(false);
    const [codigoOriginal, setCodigoOriginal] = useState(null);
    const [termoBusca, setTermoBusca] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [codigoParaExcluir, setCodigoParaExcluir] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erroCidade, setErroCidade] = useState("");

    
    const formatarSalario = (salario) => {
        const numero = typeof salario === 'number' ? salario : parseFloat(salario);
        return isNaN(numero) ? '0.00' : numero.toFixed(2);
    };

    
    const validarCidade = (valor) => {
        const regex = /^[A-Za-zÀ-ÿ\s]+$/; 
        if (!regex.test(valor)) {
            setErroCidade("O nome da cidade não pode conter números.");
            return false;
        } else {
            setErroCidade("");
            return true;
        }
    };

    
    const listarVagas = useCallback(async () => {
        setLoading(true);
        try {
            const dados = termoBusca ? await vagaService.filtrarPorCargo(termoBusca) : await vagaService.obterTodas();
            dados.sort((a, b) => a.vaga_cargo.localeCompare(b.vaga_cargo));
            setListaVagas(dados);
        } catch (error) {
            console.error('Erro em listarVagas:', error);
            setErroCadastro('Erro ao listar vagas.');
        } finally {
            setLoading(false);
        }
    }, [termoBusca]);

   
    const debouncedListarVagas = useCallback(
        debounce(() => {
            listarVagas();
        }, 300), 
        [listarVagas]
    );

    
    useEffect(() => {
        listarVagas();
        return () => {
            debouncedListarVagas.cancel();
        };
    }, [listarVagas, debouncedListarVagas]);

    
    useEffect(() => {
        if (termoBusca) {
            debouncedListarVagas();
        } else {
            listarVagas();
        }
    }, [termoBusca, debouncedListarVagas, listarVagas]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        
        const cidadeValida = validarCidade(cidade);
        if (!cidadeValida) {
            setValidado(true);
            return;
        }

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidado(true);
            return;
        }
        try {
            if (editando) {
                await vagaService.atualizarVaga(codigoOriginal, {
                    vaga_cargo: cargo,
                    vaga_salario: parseFloat(salario),
                    vaga_cidade: cidade,
                    vaga_quantidade: parseInt(quantidade, 10)
                });
                setEditando(false);
                setCodigoOriginal(null);
                setMensagemAlerta('Vaga editada com sucesso!');
            } else {
                await vagaService.criarVaga({
                    vaga_cargo: cargo,
                    vaga_salario: parseFloat(salario),
                    vaga_cidade: cidade,
                    vaga_quantidade: parseInt(quantidade, 10)
                });
                setMensagemAlerta('Vaga cadastrada com sucesso!');
            }
            await listarVagas();
            setMostrarAlerta(true);
            setCargo("");
            setSalario("");
            setCidade("");
            setQuantidade("");
            setValidado(false);
            setErroCadastro("");
        } catch (error) {
            console.error('Erro em handleSubmit:', error);
            setErroCadastro(error.message || 'Erro ao cadastrar ou editar vaga.');
        }
    };

    const handleEditar = (vaga) => {
        setEditando(true);
        setCodigoOriginal(vaga.pk_vaga_codigo);
        setCargo(vaga.vaga_cargo);
        setSalario(vaga.vaga_salario);
        setCidade(vaga.vaga_cidade);
        setQuantidade(vaga.vaga_quantidade);
    };

    const handleConfirmarExcluir = (codigo) => {
        setCodigoParaExcluir(codigo);
        setShowModal(true);
    };

    const handleExcluir = async () => {
        try {
            await vagaService.deletarVaga(codigoParaExcluir);
            await listarVagas();
            setMensagemAlerta('Vaga excluída com sucesso!');
            setMostrarAlerta(true);
        } catch (error) {
            console.error('Erro em handleExcluir:', error);
            setErroCadastro(error.message || 'Erro ao excluir vaga.');
        }
        setShowModal(false);
    };

    const handleBusca = (event) => {
        const termo = event.target.value;
        setTermoBusca(termo);
        
    };

    return (
        <Container>
            <h1 className="mb-4">Cadastro de Vagas</h1>
            {mostrarAlerta && (
                <Alert variant="success" onClose={() => setMostrarAlerta(false)} dismissible>
                    {mensagemAlerta}
                </Alert>
            )}
            {erroCadastro && (
                <Alert variant="danger" onClose={() => setErroCadastro("")} dismissible>
                    {erroCadastro}
                </Alert>
            )}
            <Form noValidate validated={validado} onSubmit={handleSubmit}>
                <Form.Group controlId="formCargo" className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Digite o cargo da vaga"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira o cargo.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formSalario" className="mb-3">
                    <Form.Label>Salário</Form.Label>
                    <Form.Control
                        required
                        type="number"
                        placeholder="Digite o salário"
                        value={salario}
                        onChange={(e) => setSalario(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira o salário.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formCidade" className="mb-3">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Digite a cidade da vaga"
                        value={cidade}
                        onChange={(e) => {
                            const valor = e.target.value;
                            
                            const valorSemNumeros = valor.replace(/\d/g, '');
                            setCidade(valorSemNumeros);
                            validarCidade(valorSemNumeros);
                        }}
                        isInvalid={!!erroCidade}
                        onKeyDown={(e) => {
                            
                            if (/\d/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {erroCidade || "Por favor, insira a cidade."}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formQuantidade" className="mb-3">
                    <Form.Label>Quantidade de Vagas</Form.Label>
                    <Form.Control
                        required
                        type="number"
                        placeholder="Digite a quantidade de vagas disponíveis"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        min="1"
                        step="1"
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, insira a quantidade de vagas disponíveis.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                    {editando ? 'Salvar Alterações' : 'Cadastrar Vaga'}
                </Button>
            </Form>

            <h2 className="mt-5">Lista de Vagas</h2>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Buscar vagas por cargo"
                    value={termoBusca}
                    onChange={handleBusca}
                />
            </InputGroup>
            {loading ? (
                <div className="text-center my-3">
                    <Spinner animation="border" />
                </div>
            ) : (
                <ListGroup>
                    {listaVagas.length > 0 ? (
                        listaVagas.map((vaga) => (
                            <ListGroup.Item key={vaga.pk_vaga_codigo} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{vaga.vaga_cargo}</strong> - {vaga.vaga_cidade} - R${formatarSalario(vaga.vaga_salario)}
                                    <span className="badge bg-info ms-2">{vaga.vaga_quantidade} disponível(s)</span>
                                </div>
                                <div>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditar(vaga)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleConfirmarExcluir(vaga.pk_vaga_codigo)}>
                                        Excluir
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item>Nenhuma vaga disponível no momento.</ListGroup.Item>
                    )}
                </ListGroup>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza de que deseja excluir esta vaga?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleExcluir}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );

}

export default VagaCadastro;
