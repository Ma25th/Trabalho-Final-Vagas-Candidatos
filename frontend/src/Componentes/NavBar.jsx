import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">TemosVagas</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Alternar navegação"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/candidatos">Candidatos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/vagas">Vagas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/inscricoes">Inscrições</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="mt-5 pt-4">
        <Outlet />
      </div>
    </>
  );
}

export default NavBar;
