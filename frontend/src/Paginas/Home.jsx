import React from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUserCheck, FaChartLine } from 'react-icons/fa'; 
import './Home.css'; 

function Home() {
  return (
    <>
      
      <div className="hero-section">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 text-white">Bem-vindo ao TemosVagas</h1>
              <p className="lead text-white">
                Gerencie suas vagas e candidaturas de forma simples e eficiente.
              </p>
              <Button variant="primary" size="lg" as={Link} to="/vagas">
                Veja as Vagas
              </Button>{' '}
              <Button variant="outline-light" size="lg" as={Link} to="/candidatos">
                Cadastre-se
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      
      <Carousel className="mt-3"> 
        <Carousel.Item>
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px', backgroundColor: '#f8f9fa' }}>
            <FaBriefcase size={100} className="mb-4 text-primary" />
            <h3>Gerencie Vagas com Facilidade</h3>
            <p>Crie, edite e monitore suas vagas em poucos cliques.</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px', backgroundColor: '#e9ecef' }}>
            <FaUserCheck size={100} className="mb-4 text-success" />
            <h3>Acompanhe Candidaturas em Tempo Real</h3>
            <p>Veja o status das candidaturas à medida que chegam.</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px', backgroundColor: '#f8f9fa' }}>
            <FaChartLine size={100} className="mb-4 text-warning" />
            <h3>Obtenha Insights Valiosos</h3>
            <p>Analise dados para melhorar suas estratégias de recrutamento.</p>
          </div>
        </Carousel.Item>
      </Carousel>

      
      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Nossos Recursos</h2>
            <p className="text-center">
              Descubra como o TemosVagas pode ajudar você a gerenciar suas oportunidades de emprego.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <FaBriefcase size={40} className="mb-3 text-primary" />
                <Card.Title className="mt-3">Gerenciar Vagas</Card.Title>
                <Card.Text>
                  Crie, edite e exclua vagas com facilidade, mantendo todas as informações organizadas.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <FaUserCheck size={40} className="mb-3 text-success" />
                <Card.Title className="mt-3">Acompanhar Candidaturas</Card.Title>
                <Card.Text>
                  Monitore as candidaturas recebidas.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <FaChartLine size={40} className="mb-3 text-warning" />
                <Card.Title className="mt-3">Análises</Card.Title>
                <Card.Text>
                  Obtenha insights valiosos sobre suas vagas e candidatos, auxiliando na tomada de decisões estratégicas.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      
      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">O Que Nossos Usuários Dizem</h2>
            <p className="text-center">
              Veja como o TemosVagas está ajudando empresas a encontrar os melhores talentos.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <Card.Text>
                  "O TemosVagas simplificou completamente nosso processo de recrutamento. Encontramos excelentes candidatos rapidamente!"
                </Card.Text>
                <Card.Footer>
                  <small className="text-muted">-Itaú</small>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <Card.Text>
                  "A interface amigável e as análises detalhadas nos ajudaram a tomar decisões mais informadas."
                </Card.Text>
                <Card.Footer>
                  <small className="text-muted">-Coca-Cola</small>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <Card.Text>
                  "Excelente ferramenta para gerenciar nossas vagas e candidaturas. Recomendo para qualquer empresa que busca eficiência."
                </Card.Text>
                <Card.Footer>
                  <small className="text-muted">-Microsoft</small>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
