import React from 'react';
import styled from 'styled-components';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';

const ProductPageLayout = ({ title, children, loading, error, type = "books", onRetry }) => {
  if (loading) {
    return (
      <Bg>
        <Wrapper>
          <Header>
            <h1>{title}</h1>
          </Header>
          <LoadingSpinner 
            message={`Cargando ${title.toLowerCase()}...`} 
            type={type}
          />
        </Wrapper>
      </Bg>
    );
  }

  if (error) {
    return (
      <Bg>
        <Wrapper>
          <Header>
            <h1>{title}</h1>
          </Header>
          <ErrorDisplay 
            message={`Error al cargar ${title.toLowerCase()}: ${error}`}
            type={type}
            onRetry={onRetry}
          />
        </Wrapper>
      </Bg>
    );
  }

  return (
    <Bg>
      <Wrapper>
        <Header>
          <h1>{title}</h1>
        </Header>
        {children}
      </Wrapper>
    </Bg>
  );
};

// Styled Components
const Bg = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 2rem 0;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  
  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #ffffff 0%, #00ff00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
    position: relative;
    z-index: 1;
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2.2rem;
    }
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: 1.8rem;
    }
  }
`;

export default ProductPageLayout;