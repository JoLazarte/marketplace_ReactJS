import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MainPage = () => {
  const { user, isAdmin, isBuyer } = useAuth();

  return (
    <PageContainer>
      {/* Sección de Bienvenida/Login - visible solo para no registrados */}
      {!user && (
        <WelcomeSection>
          <h1>¡Bienvenido a nuestra tienda!</h1>
          <p>Para acceder a todas las funcionalidades, te invitamos a registrarte</p>
          <ButtonGroup>
            <ActionButton as={Link} to="/register">Registrarse</ActionButton>
            <ActionButton as={Link} to="/login">Iniciar Sesión</ActionButton>
          </ButtonGroup>
        </WelcomeSection>
      )}

      {/* Panel de Administración - visible solo para admins */}
      {isAdmin && isAdmin() && (
        <AdminSection>
          <h2>Panel de Administración</h2>
          <ButtonGroup>
            <ActionButton as={Link} to="/book-form">Agregar Libro</ActionButton>
            <ActionButton as={Link} to="/album-form">Agregar Disco</ActionButton>
          </ButtonGroup>
        </AdminSection>
      )}

      {/* Sección de Usuario - visible para usuarios registrados */}
      {isBuyer && isBuyer() && (
        <UserSection>
          <h2>Mi Cuenta</h2>
          <ButtonGroup>
            <ActionButton as={Link} to="/profile">Mi Perfil</ActionButton>
            <ActionButton as={Link} to="/cart">Mi Carrito</ActionButton>
          </ButtonGroup>
        </UserSection>
      )}

      {/* Catálogo - visible para todos */}
      <Section>
        <h2>Libros Destacados</h2>
        {/* Aquí va el componente de catálogo de libros */}
      </Section>

      <Section>
        <h2>Discos Destacados</h2>
        {/* Aquí va el componente de catálogo de discos */}
      </Section>

      {/* Ofertas - visible para todos */}
      <Section>
        <h2>Ofertas Especiales</h2>
        {/* Aquí van las ofertas */}
      </Section>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  background: #242424;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WelcomeSection = styled(Section)`
  background: linear-gradient(135deg, #242424 0%, #1a1a1a 100%);
  text-align: center;
`;

const AdminSection = styled(Section)`
  background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
`;

const UserSection = styled(Section)`
  background: linear-gradient(135deg, #242424 0%, #1a1a1a 100%);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: #00ff00;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: #00cc00;
  }
`;

export default MainPage; 