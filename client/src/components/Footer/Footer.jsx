import React from 'react';
import styled from 'styled-components';
import { FaSquareFacebook, FaSquareXTwitter } from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import { FaWhatsappSquare, FaInstagramSquare } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <FooterContainer>
      <FooterWrapper>
        <FooterContent>
          <FooterText>&copy; 2025 Dumbo Librerías. Todos los derechos reservados.</FooterText>
          <FooterButtonGroup>
            <FooterButton onClick={handleContactClick}>
              Contacto
            </FooterButton>
            <FooterIconLink href="mailto:contacto@dumbolibrerias.com">
              <BiLogoGmail />
            </FooterIconLink>
            <FooterIconLink href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <FaWhatsappSquare />
            </FooterIconLink>
            <FooterIconLink href="https://facebook.com/dumbolibrerias" target="_blank" rel="noopener noreferrer">
              <FaSquareFacebook />
            </FooterIconLink>
            <FooterIconLink href="https://instagram.com/dumbolibrerias" target="_blank" rel="noopener noreferrer">
              <FaInstagramSquare />
            </FooterIconLink>
            <FooterIconLink href="https://twitter.com/dumbolibrerias" target="_blank" rel="noopener noreferrer">
              <FaSquareXTwitter />
            </FooterIconLink>
          </FooterButtonGroup>
        </FooterContent>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;

// Styled Components
const FooterContainer = styled.footer`
  padding: 2rem 0;
  background: linear-gradient(135deg, 
    rgba(10, 10, 10, 0.95) 0%, 
    rgba(30, 30, 30, 0.95) 50%, 
    rgba(10, 10, 10, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 255, 0, 0.2);
  margin-top: auto;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 0%, 
      rgba(0, 255, 0, 0.05) 50%, 
      transparent 100%
    );
    pointer-events: none;
  }
`;

const FooterWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 1rem;
  background: linear-gradient(45deg, #ffffff, #a0a0a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const FooterButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.6rem;
  }

  @media (max-width: 480px) {
    gap: 0.4rem;
  }
`;

const baseButtonStyles = `
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  animation: footerGlow 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: rgba(0, 255, 0, 0.9);
    border-color: rgba(0, 255, 0, 0.8);
    color: #000000;
    transform: translateY(-4px) scale(1.05);
    box-shadow: 
      0 8px 25px rgba(0, 255, 0, 0.3),
      0 0 20px rgba(0, 255, 0, 0.2);
    animation: none;
  }

  &:focus {
    outline: none;
    box-shadow: 
      0 0 0 3px rgba(0, 255, 0, 0.4),
      0 8px 25px rgba(0, 255, 0, 0.3);
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }

  svg {
    font-size: 1.4rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  @keyframes footerGlow {
    0% {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    50% {
      box-shadow: 0 4px 20px rgba(0, 255, 0, 0.1);
    }
    100% {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 768px) {
    min-width: 44px;
    height: 44px;
    padding: 0.7rem 1rem;
  }

  @media (max-width: 480px) {
    min-width: 40px;
    height: 40px;
    padding: 0.6rem 0.8rem;
    
    svg {
      font-size: 1.2rem;
    }
  }
`;

const FooterButton = styled.button`
  ${baseButtonStyles}
`;

const FooterIconLink = styled.a`
  ${baseButtonStyles}
`;