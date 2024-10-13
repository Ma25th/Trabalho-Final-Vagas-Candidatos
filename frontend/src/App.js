import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Componentes/NavBar';
import CandidatoCadastro from './Paginas/CandidatoCadastro';
import VagaCadastro from './Paginas/VagaCadastro';
import InscricaoPage from './Paginas/InscricaoPage';
import Home from './Paginas/Home'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/candidatos" element={<CandidatoCadastro />} />
        <Route path="/vagas" element={<VagaCadastro />} />
        <Route path="/inscricoes" element={<InscricaoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
