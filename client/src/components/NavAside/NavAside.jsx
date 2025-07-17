import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavAside.css'
const NavAside = () => {

  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProductsNavigate = (route) => {
    setShowProductsMenu(false);
    setIsMobileMenuOpen(false);
    navigate(route);
  };

  return (

    <div id='navAside'>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className=' menuAside ' id="navbarNavDropdown">
            <p className='icono-menu' onClick={() => handleProductsNavigate('/books')}>LIBROS</p>
            <p className='icono-menu' onClick={() => handleProductsNavigate('/albums')}>MÚSICA</p>
            <p className='icono-menu' >PREVENTAS ONLINE</p>
            <p className='icono-menu' >LIBROS FIRMADOS</p>
            <p className='icono-menu' >PROMOCIONES</p>
            <p className='icono-menu' >ENVIOS A TODO EL PAÍS</p>
            <p className='icono-menu' >DONÁ UN LIBRO HOY</p>
        </div>
    </div>
  )
}
export default NavAside