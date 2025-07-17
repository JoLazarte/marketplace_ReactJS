import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Cart from '../Cart/Cart';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import SearchBar from '../../assets/SearchBar';
import ShoppCartIcon from '../../assets/ShoppCartIcon';
import { FaUser, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { isAuthenticated, user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  const handleProductsMenu = () => {
    setShowProductsMenu((prev) => !prev);
  };

  const handleProductsNavigate = (route) => {
    setShowProductsMenu(false);
    setIsMobileMenuOpen(false);
    navigate(route);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    setShowProductsMenu(false);
    setShowUserMenu(false);
  };

  return (
    <HeaderContainer>
      <Logo>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div id='logo'>
            <img src="/Dumbo.png" alt="Logo" width="45" height="45" className="me-2"/>
            <span className="logo-text">Dumbo Librerías</span>
          </div>
        </Link>
      </Logo>

      <SearchBarContainer>
        <SearchBar />
      </SearchBarContainer>

      {/* Menu hamburguesa para mobile */}
      <MobileMenuButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>

      {/* Navegación desktop */}
      <Nav $isMobileMenuOpen={isMobileMenuOpen}>
        
        <NavItem>
          <Link to="/contact" onClick={handleMobileMenuClose}>Contacto</Link>
        </NavItem>
        
        {isAuthenticated ? (
          <UserSection>
            <UserButton onClick={toggleUserMenu}>
              <FaUser />
              <span>{user?.firstName}</span>
            </UserButton>
            {showUserMenu && (
              <UserMenu>
                <UserInfo>
                  <strong>{user?.firstName} {user?.lastName}</strong>
                  <small>{user?.email}</small>
                </UserInfo>
                <MenuDivider />
                <MenuItem onClick={handleProfileClick}>
                  Mi Perfil
                </MenuItem>
                <MenuDivider />
                <MenuItem as="button" onClick={handleLogoutClick}>
                  Cerrar Sesión
                </MenuItem>
              </UserMenu>
            )}
          </UserSection>
        ) : (
          <>
            <NavItem>
              <Link to="/login">Iniciar Sesión</Link>
            </NavItem>
            <NavItem>
              <Link to="/register">Registrarse</Link>
            </NavItem>
          </>
        )}
        
        {/* El carrito solo lo ven los que NO son admin */}
        {user?.role !== 'ADMIN' && (
          <CartContainer onClick={toggleCart}>
            <ShoppCartIcon />
            <CartCount>({getItemCount()})</CartCount>
          </CartContainer>
        )}
      </Nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%);
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  
  /* Overlay oscuro que cubre toda la altura */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;

  a {
    color: #ffffff;
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #00ff00;
      text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: scale(1.05);
    }
  }

  .logo-text {
    background: linear-gradient(135deg, #ffffff 0%, #00ff00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    margin-left: 0.5rem;
  }

  img {
    border-radius: 50%;
    border: 2px solid rgba(0, 255, 0, 0.3);
    transition: all 0.3s ease;
  }

  &:hover img {
    border-color: #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }
`;

const SearchBarContainer = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    right: 0;
    width: 100%;
    background: rgba(20, 20, 20, 0.98);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 255, 0, 0.2);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    transform: translateX(${props => props.$isMobileMenuOpen ? '0' : '100%'});
    transition: transform 0.3s ease;
    z-index: 999;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #00ff00;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavItem = styled.div`
  position: relative;
  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #00ff00;
    }
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  padding: 0;
  &:hover {
    color: #00ff00;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 120%;
  left: 0;
  background: #242424;
  border: 1px solid #404040;
  border-radius: 8px;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 2000;
  padding: 0.5rem 0;
`;

const DropdownMenuItem = styled.div`
  color: #fff;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  background: none;
  &:hover {
    background: rgba(0,255,0,0.08);
    color: #00ff00;
  }
`;

const UserSection = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: #00ff00;
    background: rgba(0, 255, 0, 0.1);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #242424;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 8px 0;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 8px;
  z-index: 1000;
`;

const UserInfo = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #ffffff;
  }

  small {
    color: #808080;
  }
`;

const MenuDivider = styled.hr`
  border: none;
  border-top: 1px solid #404040;
  margin: 8px 0;
`;

const MenuItem = styled.a`
  display: block;
  padding: 8px 16px;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1rem;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    color: #00ff00;
  }
`;

const CartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  color: #ffffff;

  &:hover {
    color: #00ff00;
  }
`;

const CartCount = styled.span`
  color: #ffffff;
  font-size: 0.9rem;
`;

export default Header;