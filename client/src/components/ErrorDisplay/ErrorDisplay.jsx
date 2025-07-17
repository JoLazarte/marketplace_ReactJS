import React from 'react';
import styled, { keyframes } from 'styled-components';

const ErrorDisplay = ({ message = "¡Oops! Algo salió mal", type = "books", onRetry }) => {
  const isBooks = type === "books";
  
  return (
    <ErrorContainer>
      <ErrorIcon>
        {isBooks ? "📚💥" : "🎵💥"}
      </ErrorIcon>
      <ErrorTitle>¡Houston, tenemos un problema!</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          🔄 Intentar de nuevo
        </RetryButton>
      )}
      <ErrorEmoji>
        {isBooks ? "😅📖" : "😅🎧"}
      </ErrorEmoji>
    </ErrorContainer>
  );
};

// Animaciones
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled Components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${shake} 2s ease-in-out infinite;
`;

const ErrorTitle = styled.h2`
  color: #ff6b6b;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const ErrorMessage = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 400px;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${pulse} 2s ease-in-out infinite;
  margin-bottom: 1rem;
  
  &:hover {
    background: linear-gradient(45deg, #ff5252, #ff7979);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorEmoji = styled.div`
  font-size: 2rem;
  opacity: 0.7;
  animation: ${bounce} 3s ease-in-out infinite;
  animation-delay: 0.5s;
`;

export default ErrorDisplay;