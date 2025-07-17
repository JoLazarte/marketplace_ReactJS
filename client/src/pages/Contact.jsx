import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío del formulario
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('¡Mensaje enviado con éxito! Te contactaremos pronto.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      <ContactHeader>
        <ContactTitle>Contáctanos</ContactTitle>
        <ContactSubtitle>
          Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
        </ContactSubtitle>
      </ContactHeader>

      <ContactGrid>
        <ContactInfoCard>
          <CardTitle>
            <ContactIcon>📧</ContactIcon>
            Información de Contacto
          </CardTitle>
          
          <ContactItem>
            <ItemIcon>✉️</ItemIcon>
            <ItemContent>
              <ItemLabel>Email</ItemLabel>
              <ItemValue>contacto@dumbo.com</ItemValue>
            </ItemContent>
          </ContactItem>

          <ContactItem>
            <ItemIcon>📱</ItemIcon>
            <ItemContent>
              <ItemLabel>Teléfono</ItemLabel>
              <ItemValue>+54 11 1234-5678</ItemValue>
            </ItemContent>
          </ContactItem>

          <ContactItem>
            <ItemIcon>📍</ItemIcon>
            <ItemContent>
              <ItemLabel>Dirección</ItemLabel>
              <ItemValue>Av. Siempre Viva 123, Buenos Aires</ItemValue>
            </ItemContent>
          </ContactItem>

          <SocialSection>
            <SocialTitle>Síguenos</SocialTitle>
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">
                <SocialIcon>📘</SocialIcon>
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <SocialIcon>📷</SocialIcon>
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                <SocialIcon>🐦</SocialIcon>
              </SocialLink>
              <SocialLink href="#" aria-label="WhatsApp">
                <SocialIcon>💬</SocialIcon>
              </SocialLink>
            </SocialLinks>
          </SocialSection>
        </ContactInfoCard>

        <ContactFormCard>
          <CardTitle>
            <ContactIcon>💌</ContactIcon>
            Envíanos un Mensaje
          </CardTitle>
          
          <ContactForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Nombre completo</FormLabel>
              <FormInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Correo electrónico</FormLabel>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Mensaje</FormLabel>
              <FormTextarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Escribe tu mensaje aquí..."
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ButtonSpinner />
                  Enviando...
                </>
              ) : (
                <>
                  <ButtonIcon>🚀</ButtonIcon>
                  Enviar Mensaje
                </>
              )}
            </SubmitButton>
          </ContactForm>
        </ContactFormCard>

        <ContactMapCard>
          <CardTitle>
            <ContactIcon>🗺️</ContactIcon>
            Nuestra Ubicación
          </CardTitle>
          <MapContainer>
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps?q=Av.+Siempre+Viva+123,+Buenos+Aires&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </MapContainer>
        </ContactMapCard>
      </ContactGrid>
    </ContactContainer>
  );
};

export default Contact;

// Animaciones
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
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

// Contenedor principal
const ContactContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #232526 0%, #1c1c1c 100%);
  padding: 2rem;
  padding-top: 120px;
  
  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 100px;
  }
`;

// Header
const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const ContactTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00ff00, #00cc00, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: ${float} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ContactSubtitle = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

// Grid principal
const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

// Cards base
const BaseCard = styled.div`
  background: rgba(42, 42, 42, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(0, 255, 0, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(0, 255, 0, 0.2);
    border-color: rgba(0, 255, 0, 0.4);
  }
`;

const ContactInfoCard = styled(BaseCard)`
  animation-delay: 0.1s;
`;

const ContactFormCard = styled(BaseCard)`
  animation-delay: 0.2s;
`;

const ContactMapCard = styled(BaseCard)`
  grid-column: 1 / -1;
  animation-delay: 0.3s;
  
  @media (max-width: 1024px) {
    grid-column: 1;
  }
`;

// Títulos de cards
const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #00ff00;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 255, 0, 0.3);
`;

const ContactIcon = styled.span`
  font-size: 1.5rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

// Items de contacto
const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(60, 60, 60, 0.6);
  border-radius: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(80, 80, 80, 0.8);
    transform: translateX(5px);
    border: 1px solid rgba(0, 255, 0, 0.3);
  }
`;

const ItemIcon = styled.span`
  font-size: 1.25rem;
  background: linear-gradient(135deg, #00ff00, #00cc00);
  padding: 0.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemLabel = styled.div`
  font-size: 0.9rem;
  color: #00ff00;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ItemValue = styled.div`
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
`;

// Sección social
const SocialSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(0, 255, 0, 0.3);
`;

const SocialTitle = styled.h3`
  font-size: 1.2rem;
  color: #00ff00;
  margin-bottom: 1rem;
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00ff00, #00cc00);
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 255, 0, 0.4);
  }
`;

const SocialIcon = styled.span`
  font-size: 1.25rem;
`;

// Formulario
const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #00ff00;
`;

const InputBase = styled.input`
  padding: 1rem;
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 12px;
  background: rgba(40, 40, 40, 0.8);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  color: #ffffff;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    border-color: #00ff00;
    background: rgba(40, 40, 40, 0.9);
    box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.2);
  }
`;

const FormInput = styled(InputBase)``;

const FormTextarea = styled.textarea`
  padding: 1rem;
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 12px;
  background: rgba(40, 40, 40, 0.8);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  color: #ffffff;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    border-color: #00ff00;
    background: rgba(40, 40, 40, 0.9);
    box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.2);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
  color: #000000;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 56px;
  box-shadow: 0 4px 16px rgba(0, 255, 0, 0.3);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #00cc00 0%, #00aa00 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 255, 0, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
`;

const ButtonSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top: 2px solid #000000;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Mapa
const MapContainer = styled.div`
  border-radius: 16px;
  overflow: hidden;
  height: 400px;
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid rgba(0, 255, 0, 0.2);
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;