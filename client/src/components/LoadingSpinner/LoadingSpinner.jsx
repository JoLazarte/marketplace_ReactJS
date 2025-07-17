import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingSpinner = ({ message = "Cargando...", type = "books" }) => {
  const isBooks = type === "books";
  
  return (
    <LoadingContainer>
      <SpinnerWrapper>
        {isBooks ? (
          <BookSpinner>
            <BookIcon>📚</BookIcon>
            <BookIcon>📖</BookIcon>
            <BookIcon>📘</BookIcon>
            <BookIcon>📙</BookIcon>
            <BookIcon>📗</BookIcon>
          </BookSpinner>
        ) : (
          <AlbumSpinner>
            <AlbumIcon>🎵</AlbumIcon>
            <AlbumIcon>🎶</AlbumIcon>
            <AlbumIcon>🎧</AlbumIcon>
            <AlbumIcon>💿</AlbumIcon>
            <AlbumIcon>🎼</AlbumIcon>
          </AlbumSpinner>
        )}
      </SpinnerWrapper>
      <LoadingText>{message}</LoadingText>
      <LoadingDots>
        <Dot $delay="0s" />
        <Dot $delay="0.2s" />
        <Dot $delay="0.4s" />
      </LoadingDots>
    </LoadingContainer>
  );
};

// Animaciones
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

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
`;

const wave = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
`;

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
`;

const SpinnerWrapper = styled.div`
  margin-bottom: 2rem;
`;

const BookSpinner = styled.div`
  display: flex;
  gap: 0.5rem;
  animation: ${float} 2s ease-in-out infinite;
`;

const BookIcon = styled.div`
  font-size: 2rem;
  animation: ${bounce} 1.5s ease-in-out infinite;
  
  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
  &:nth-child(4) { animation-delay: 0.6s; }
  &:nth-child(5) { animation-delay: 0.8s; }
`;

const AlbumSpinner = styled.div`
  display: flex;
  gap: 0.5rem;
  animation: ${spin} 3s linear infinite;
`;

const AlbumIcon = styled.div`
  font-size: 2rem;
  animation: ${wave} 1.5s ease-in-out infinite;
  
  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.3s; }
  &:nth-child(3) { animation-delay: 0.6s; }
  &:nth-child(4) { animation-delay: 0.9s; }
  &:nth-child(5) { animation-delay: 1.2s; }
`;

const LoadingText = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(45deg, #01be96, #00ff88);
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.$delay};
`;

export default LoadingSpinner;