import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío del formulario
    toast.success('¡Mensaje enviado correctamente! Te contactaremos pronto.', {
      position: "top-right",
      autoClose: 3000,
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <ContactContainer>
      <ContactHeader>
        <ContactTitle>
          <GradientText>Contacto</GradientText>
        </ContactTitle>
        <ContactSubtitle>
          ¿Tienes alguna pregunta? ¡Estamos aquí para ayudarte!
        </ContactSubtitle>
      </ContactHeader>

      <ContactContent>
        <ContactInfo>
          <InfoCard>
            <InfoIcon>📧</InfoIcon>
            <InfoDetails>
              <InfoTitle>Email</InfoTitle>
              <InfoText>contacto@dumbo.com</InfoText>
            </InfoDetails>
          </InfoCard>

          <InfoCard>
            <InfoIcon>📱</InfoIcon>
            <InfoDetails>
              <InfoTitle>Teléfono</InfoTitle>
              <InfoText>+54 11 1234-5678</InfoText>
            </InfoDetails>
          </InfoCard>

          <InfoCard>
            <InfoIcon>📍</InfoIcon>
            <InfoDetails>
              <InfoTitle>Dirección</InfoTitle>
              <InfoText>Av. Siempre Viva 123, Buenos Aires</InfoText>
            </InfoDetails>
          </InfoCard>

          <SocialSection>
            <SocialTitle>Síguenos</SocialTitle>
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">📘</SocialLink>
              <SocialLink href="#" aria-label="Instagram">📸</SocialLink>
              <SocialLink href="#" aria-label="Twitter">🐦</SocialLink>
              <SocialLink href="#" aria-label="WhatsApp">💬</SocialLink>
            </SocialLinks>
          </SocialSection>
        </ContactInfo>

        <FormSection>
          <ContactForm onSubmit={handleSubmit}>
            <FormTitle>Envíanos un mensaje</FormTitle>
            
            <InputGroup>
              <StyledInput
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <InputIcon>👤</InputIcon>
            </InputGroup>

            <InputGroup>
              <StyledInput
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputIcon>✉️</InputIcon>
            </InputGroup>

            <InputGroup>
              <StyledTextarea
                name="message"
                rows={5}
                placeholder="Escribe tu mensaje aquí..."
                value={formData.message}
                onChange={handleChange}
                required
              />
              <TextareaIcon>💭</TextareaIcon>
            </InputGroup>

            <SubmitButton type="submit">
              <ButtonIcon>🚀</ButtonIcon>
              Enviar Mensaje
            </SubmitButton>
          </ContactForm>
        </FormSection>
      </ContactContent>

      <MapSection>
        <MapTitle>Nuestra Ubicación</MapTitle>
        <MapContainer>
          <StyledMap
            title="Google Maps"
            src="https://www.google.com/maps?q=Av.+Siempre+Viva+123,+Buenos+Aires&output=embed"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </MapContainer>
      </MapSection>
    </ContactContainer>
  );
};

export default Contact;

// --- Animaciones ---
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

// --- Estilos ---
const ContactContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(1, 190, 150, 0.1) 0%,
    rgba(123, 74, 39, 0.1) 35%,
    rgba(189, 181, 213, 0.1) 65%,
    rgba(0, 255, 136, 0.1) 100%
  );
  padding: 2rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #01be96, #7b4a27, #bdb5d5, #00ff88);
  background-size: 400% 400%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientShift} 3s ease infinite;
`;

const ContactTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ContactSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.35);
  }

  &:nth-child(2) { animation-delay: 0.5s; }
  &:nth-child(3) { animation-delay: 1s; }
`;

const InfoIcon = styled.div`
  font-size: 2rem;
  background: linear-gradient(135deg, #01be96, #00ff88);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(1, 190, 150, 0.3);
`;

const InfoDetails = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.95rem;
`;

const SocialSection = styled.div`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
`;

const SocialTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialLink = styled.a`
  font-size: 1.5rem;
  background: linear-gradient(135deg, #7b4a27, #bdb5d5);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(123, 74, 39, 0.3);
  }

  &:nth-child(2) { animation-delay: 0.5s; }
  &:nth-child(3) { animation-delay: 1s; }
  &:nth-child(4) { animation-delay: 1.5s; }
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormTitle = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const InputGroup = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #01be96;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(1, 190, 150, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  transition: all 0.3s ease;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #01be96;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(1, 190, 150, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  pointer-events: none;
`;

const TextareaIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 1rem;
  font-size: 1.2rem;
  pointer-events: none;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #01be96, #00ff88);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(1, 190, 150, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(1, 190, 150, 0.4);
    background: linear-gradient(135deg, #00a87a, #00e676);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
`;

const MapSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
`;

const MapTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
`;

const MapContainer = styled.div`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const StyledMap = styled.iframe`
  width: 100%;
  height: 400px;
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;