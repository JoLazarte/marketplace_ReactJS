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
  padding: 6rem 1rem 1rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  
  position: relative;


  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(0, 255, 187, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 68, 68, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Wrapper = styled.div`
  width: 65%;
 
  padding: 2rem;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  
  
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #ffffff 0%, #00ffd5ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(0, 251, 255, 0.3);
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
    background: linear-gradient(135deg, #00ffddff 0%, #00ccc9ff 100%);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 255, 183, 0.5);
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