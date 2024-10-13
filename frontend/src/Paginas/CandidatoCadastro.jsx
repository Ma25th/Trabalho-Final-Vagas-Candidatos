import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Container, Alert, ListGroup, InputGroup, FormControl, Modal } from 'react-bootstrap';
import candidatoService from '../Services/CandidatoService'; 
import debounce from 'lodash.debounce';
import InputMask from 'react-input-mask';

function CandidatoCadastro() {
  const [validado, setValidado] = useState(false);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");
  const [listaCandidatos, setListaCandidatos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [cpfOriginal, setCpfOriginal] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cpfParaExcluir, setCpfParaExcluir] = useState(null);

  
  const listarCandidatos = useCallback(async () => {
    try {
      const dados = termoBusca ? await candidatoService.filtrarPorNome(termoBusca) : await candidatoService.obterTodos();
      dados.sort((a, b) => a.cand_nome.localeCompare(b.cand_nome));
      console.log('Lista de Candidatos após buscar:', dados); 
      setListaCandidatos(dados);
    } catch (error) {
      console.error('Erro em listarCandidatos:', error);
      setErroCadastro('Erro ao listar candidatos.');
    }
  }, [termoBusca]);

  
  const debouncedListarCandidatos = useCallback(
    debounce(() => {
      listarCandidatos();
    }, 300), 
    [listarCandidatos]
  );

  
  useEffect(() => {
    listarCandidatos();
    
    return () => {
      debouncedListarCandidatos.cancel();
    };
  }, [listarCandidatos, debouncedListarCandidatos]);


  useEffect(() => {
    if (termoBusca) {
      debouncedListarCandidatos();
    } else {
      listarCandidatos();
    }
  }, [termoBusca, debouncedListarCandidatos, listarCandidatos]);

  
  const validarNome = (value) => {
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    return regex.test(value);
  };

  
  const handleNomeChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    setNome(filteredValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false || !validarNome(nome)) {
      event.stopPropagation();
      setValidado(true);
      if (!validarNome(nome)) {
        setErroCadastro('O nome do candidato deve conter apenas letras.');
      }
      return;
    }
    try {
      if (editando) {
        await fetch(`http://localhost:4000/candidatos/${cpfOriginal}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cand_nome: nome, cand_endereco: endereco, cand_telefone: telefone }),
        });
        setEditando(false);
        setCpfOriginal(null);
        setMensagemAlerta('Candidato editado com sucesso!');
      } else {
        await fetch('http://localhost:4000/candidatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pk_cand_cpf: cpf, cand_nome: nome, cand_endereco: endereco, cand_telefone: telefone }),
        });
        setMensagemAlerta('Candidato cadastrado com sucesso!');
      }
      await listarCandidatos();
      setMostrarAlerta(true);
      setCpf("");
      setNome("");
      setEndereco("");
      setTelefone("");
      setValidado(false);
      setErroCadastro("");
    } catch (error) {
      console.error('Erro em handleSubmit:', error);
      setErroCadastro(error.message || 'Erro ao cadastrar ou editar candidato.');
    }
  };

  const handleEditar = (candidato) => {
    setEditando(true);
    setCpfOriginal(candidato.pk_cand_cpf);
    setCpf(candidato.pk_cand_cpf);
    setNome(candidato.cand_nome);
    setEndereco(candidato.cand_endereco);
    setTelefone(candidato.cand_telefone);
  };

  const handleConfirmarExcluir = (cpf) => {
    setCpfParaExcluir(cpf);
    setShowModal(true);
  };

  const handleExcluir = async () => {
    try {
      await fetch(`http://localhost:4000/candidatos/${cpfParaExcluir}`, {
        method: 'DELETE',
      });
      await listarCandidatos();
      setMensagemAlerta('Candidato excluído com sucesso!');
      setMostrarAlerta(true);
    } catch (error) {
      console.error('Erro em handleExcluir:', error);
      setErroCadastro(error.message || 'Erro ao excluir candidato.');
    }
    setShowModal(false);
  };

  const handleBusca = (event) => {
    const termo = event.target.value;
    setTermoBusca(termo);
    
  };

  return (
    <Container>
      <h1 className="mb-4">Cadastro de Candidatos</h1>
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
        
        <Form.Group controlId="formCpf" className="mb-3">
          <Form.Label>CPF</Form.Label>
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            disabled={editando}
          >
            {(inputProps) => (
              <Form.Control
                {...inputProps}
                required
                type="text"
                placeholder="Digite o CPF"
              />
            )}
          </InputMask>
          <Form.Control.Feedback type="invalid">
            Por favor, insira um CPF válido.
          </Form.Control.Feedback>
        </Form.Group>

        
        <Form.Group controlId="formNome" className="mb-3">
          <Form.Label>Nome do Candidato</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={handleNomeChange} 
            isInvalid={validado && !validarNome(nome)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira o nome do candidato. Apenas letras são permitidas.
          </Form.Control.Feedback>
        </Form.Group>

       
        <Form.Group controlId="formEndereco" className="mb-3">
          <Form.Label>Endereço</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Por favor, insira o endereço.
          </Form.Control.Feedback>
        </Form.Group>

       
        <Form.Group controlId="formTelefone" className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <InputMask
            mask="(99) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          >
            {(inputProps) => (
              <Form.Control
                {...inputProps}
                required
                type="text"
                placeholder="Telefone"
              />
            )}
          </InputMask>
          <Form.Control.Feedback type="invalid">
            Por favor, insira um telefone válido.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          {editando ? 'Salvar Alterações' : 'Cadastrar'}
        </Button>
      </Form>

      <h2 className="mt-5">Lista de Candidatos</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar candidatos"
          value={termoBusca}
          onChange={handleBusca}
        />
      </InputGroup>
      <ListGroup>
        {listaCandidatos.length > 0 ? (
          listaCandidatos.map((candidato) => (
            <ListGroup.Item key={candidato.pk_cand_cpf} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{candidato.cand_nome}</strong> -  {candidato.pk_cand_cpf} - {candidato.cand_telefone} ({candidato.cand_endereco})
              </div>
              <div>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditar(candidato)}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleConfirmarExcluir(candidato.pk_cand_cpf)}>
                  Excluir
                </Button>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Nenhum candidato encontrado.</ListGroup.Item>
        )}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza de que deseja excluir este candidato?</Modal.Body>
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

export default CandidatoCadastro;
