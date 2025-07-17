import React from 'react'
import './SubPortada.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const SubPortada = () => {
  const { user } = useAuth();

  return (
    <div className="cta-glass">
      <h2 className="mb-4">
        <span>Como un elefante, recuerda los mejores momentos:</span>
        <br/>
        <span>lee y escucha con nosotros.</span>
      </h2>
      <p className="mb-3">¡Regístrate hoy mismo para explorar los mejores libros y álbumes al mejor precio!</p>
      <p className="mb-4">Aprovechá nuestras ofertas especiales y descuentos exclusivos en productos seleccionados</p>
      {!user && (
        <Link to="/register" className="btn btn-lg btn-light px-5 py-2 fw-bold shadow btnReg">¡Registrate!</Link>
      )}
    </div>
  )
}

export default SubPortada