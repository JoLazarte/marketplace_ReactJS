import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import styled from 'styled-components';
import { useCart } from '../hooks/useCart';

import { useBuys } from '../hooks/useBuys';
import { seleccionarMetodoDePago, limpiarMetodoDePago } from '../store/slices/pagoSlice'; // NUEVO
import { clearBuyId } from '../store/slices/buySlice';
import { toast } from 'react-toastify';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, token } = useSelector((state) => state.auth);
  const { confirmBuy, emptyBuy, loading, error } = useBuys();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Estados para el formulario de tarjeta
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: ''
  });

  //Obtener método de pago seleccionado desde Redux
  const metodoSeleccionado = useSelector((state) => state.pago.metodoSeleccionado);
  const buyId = useSelector((state) => state.buy.buyId); 

  // NUEVO: Función para manejar selección de método de pago
  const handleSeleccionarMetodo = (metodo) => {
    dispatch(seleccionarMetodoDePago(metodo));
  };

  // Función para manejar cambios en el formulario
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para procesar el pago con tarjeta
  const handleCardSubmit = (e) => {
    e.preventDefault();
    
    // Validar datos de tarjeta
    if (!cardData.cardNumber || !cardData.cardName || !cardData.cardExpiry || !cardData.cardCVV) {
      toast.error('Por favor, completa todos los campos de la tarjeta');
      return;
    }
    
    // Procesar pago con tarjeta
    handleConfirmPurchase();
  };

  const handleCancel = async () => {
 
    if (!buyId) {
      // Si no hay buyId, simplemente volver atrás
      navigate(-1);
      return;
    }

    // Mostrar modal de confirmación
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await emptyBuy(buyId, token);
      dispatch(clearBuyId());
      clearCart();
      dispatch(limpiarMetodoDePago());
      setShowCancelModal(false);
      navigate('/');
      toast.info("Compra cancelada correctamente");
    } catch (err) {
      console.error('Error al cancelar la compra:', err);
      toast.error("❌ Error al cancelar la compra. Por favor, intenta nuevamente.");
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  const handleConfirmPurchase = async () => {
    //Validar que se haya seleccionado un método de pago
    if (!metodoSeleccionado) {
      toast.warning('Por favor, selecciona un método de pago antes de confirmar la compra.');
      return;
    }
    // Validar datos de tarjeta si es necesario
    if (metodoSeleccionado === 'tarjeta') {
      if (!cardData.cardNumber || !cardData.cardName || !cardData.cardExpiry || !cardData.cardCVV) {
        toast.error('Por favor, completa todos los campos de la tarjeta');
        return;
      }
    }
    try {
     
      if (!buyId) {
        throw new Error('No se encontró el ID de la compra. Por favor, vuelve al carrito e intenta nuevamente.');
      }

      // Procesar según el método de pago seleccionado
      if (metodoSeleccionado === 'mercadopago') {
        console.log('Procesando pago con Mercado Pago...');
      } else if (metodoSeleccionado === 'paypal') {
        console.log('Procesando pago con PayPal...');
      } else if (metodoSeleccionado === 'efectivo') {
        console.log('Pago en efectivo confirmado');
      } else if (metodoSeleccionado === 'tarjeta') {
        console.log('Procesando pago con tarjeta...', cardData);
      }

      const confirmedBuy = await confirmBuy(buyId, token);
      console.log('Compra confirmada:', confirmedBuy);

      // Verificar respuesta del servidor
      if (confirmedBuy?.ok === true || confirmedBuy?.confirmed === true) {
        toast.success("✅ ¡Compra realizada con éxito!");
      clearCart();
      dispatch(clearBuyId());
      dispatch(limpiarMetodoDePago());
      setShowSuccessModal(true);
    
    } else {
        toast.error("❌ Hubo un problema al procesar la compra");
      }
      
    } catch (err) {
      console.error('Error en la compra:', err);
      toast.error("❌ Hubo un problema al procesar la compra");
    }
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  // Función para obtener imagen válida
  const getValidImageSrc = (urlImage) => {
    if (!urlImage) return null;
    if (Array.isArray(urlImage)) {
      return urlImage[0] || null;
    }
    return urlImage || null;
  };

  // Renderizar contenido adicional según el método de pago
  const renderPaymentMethodContent = () => {
    if (metodoSeleccionado === 'mercadopago' || metodoSeleccionado === 'paypal') {
      return (
        <PaymentMethodMessage>
          🛠 Este método está en construcción. Elegí otro para continuar.
        </PaymentMethodMessage>
      );
    } else if (metodoSeleccionado === 'tarjeta') {
      return (
        <CardForm onSubmit={handleCardSubmit}>
          <CardFormGroup>
            <CardLabel>Número de tarjeta</CardLabel>
            <CardInput
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={handleCardInputChange}
              required
            />
          </CardFormGroup>
          <CardFormGroup>
            <CardLabel>Nombre del titular</CardLabel>
            <CardInput
              type="text"
              name="cardName"
              placeholder="Como aparece en la tarjeta"
              value={cardData.cardName}
              onChange={handleCardInputChange}
              required
            />
          </CardFormGroup>
          <CardFormRow>
            <CardFormGroup style={{ flex: 1 }}>
              <CardLabel>Fecha de vencimiento</CardLabel>
              <CardInput
                type="text"
                name="cardExpiry"
                placeholder="MM/AA"
                value={cardData.cardExpiry}
                onChange={handleCardInputChange}
                required
              />
            </CardFormGroup>
            <CardFormGroup style={{ flex: 1 }}>
              <CardLabel>CVV</CardLabel>
              <CardInput
                type="text"
                name="cardCVV"
                placeholder="123"
                value={cardData.cardCVV}
                onChange={handleCardInputChange}
                required
              />
            </CardFormGroup>
          </CardFormRow>
          <CardButton type="submit" disabled={loading}>
            {loading ? 'Procesando...' : 'Finalizar Pago'}
          </CardButton>
        </CardForm>
      );
    }
    return null;
  };

  return (
    <>
      <Container>
        <CheckoutCard>
          <Title>Confirmar Compra</Title>
         
          <OrderSummary>
            <h3>Resumen del Pedido</h3>
            {cartItems.map(item => {
              const imageSrc = getValidImageSrc(item.urlImage);
              const originalPrice = parseFloat(item.price);
              const hasDiscount = item.discountActive && item.discountPercentage > 0;
              const finalPrice = hasDiscount ? originalPrice * (1 - item.discountPercentage / 100) : originalPrice;
              const subtotal = finalPrice * item.quantity;
              
              return (
                <ItemRow key={item.id}>
                  {imageSrc && (
                    <ItemImage src={imageSrc} alt={item.title} />
                  )}
                  <ItemInfo>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDetails>
                      <span>Cantidad: {item.quantity}</span>
                      {hasDiscount ? (
                        <PriceWithDiscount>
                          <DiscountInfo>
                            <DiscountBadge>{item.discountPercentage}% OFF</DiscountBadge>
                            <OriginalPrice>Precio original: ${originalPrice.toFixed(2)}</OriginalPrice>
                          </DiscountInfo>
                          <FinalPriceText>Precio con descuento: ${finalPrice.toFixed(2)}</FinalPriceText>
                        </PriceWithDiscount>
                      ) : (
                        <span>Precio unitario: ${finalPrice.toFixed(2)}</span>
                      )}
                      <SubtotalText hasDiscount={hasDiscount}>
                        Subtotal: ${subtotal.toFixed(2)}
                      </SubtotalText>
                    </ItemDetails>
                  </ItemInfo>
                </ItemRow>
              );
            })}
          </OrderSummary>

          {/* Resumen de descuentos */}
          {(() => {
            const originalTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
            const finalTotal = getCartTotal();
            const totalSavings = originalTotal - finalTotal;
            const hasAnyDiscount = cartItems.some(item => item.discountActive && item.discountPercentage > 0);

            return hasAnyDiscount ? (
              <SavingsSection>
                <SavingsRow>
                  <span>Subtotal original:</span>
                  <OriginalTotalAmount>${originalTotal.toFixed(2)}</OriginalTotalAmount>
                </SavingsRow>
                <SavingsRow>
                  <span>Descuentos aplicados:</span>
                  <SavingsAmount>-${totalSavings.toFixed(2)}</SavingsAmount>
                </SavingsRow>
              </SavingsSection>
            ) : null;
          })()}

          <TotalSection>
            <TotalLabel>Total a Pagar:</TotalLabel>
            <TotalAmount>${getCartTotal().toFixed(2)}</TotalAmount>
          </TotalSection>

           {/* SECCIÓN DE MÉTODOS DE PAGO */}
          <PaymentSection>
            <h3>Método de Pago</h3>
            <PaymentMethods>
              <PaymentMethod 
                className={metodoSeleccionado === 'mercadopago' ? 'seleccionado' : ''}
                onClick={() => handleSeleccionarMetodo('mercadopago')}
              >
                <PaymentIcon>💳</PaymentIcon>
                <PaymentText>Mercado Pago</PaymentText>
              </PaymentMethod>

              <PaymentMethod 
                className={metodoSeleccionado === 'paypal' ? 'seleccionado' : ''}
                onClick={() => handleSeleccionarMetodo('paypal')}
              >
                <PaymentIcon>🅿️</PaymentIcon>
                <PaymentText>PayPal</PaymentText>
              </PaymentMethod>

              <PaymentMethod 
                className={metodoSeleccionado === 'efectivo' ? 'seleccionado' : ''}
                onClick={() => handleSeleccionarMetodo('efectivo')}
              >
                <PaymentIcon>💵</PaymentIcon>
                <PaymentText>Efectivo</PaymentText>
              </PaymentMethod>

              <PaymentMethod 
                className={metodoSeleccionado === 'tarjeta' ? 'seleccionado' : ''}
                onClick={() => handleSeleccionarMetodo('tarjeta')}
              >
                <PaymentIcon>💳</PaymentIcon>
                <PaymentText>Tarjeta</PaymentText>
              </PaymentMethod>
            </PaymentMethods>
            
            {renderPaymentMethodContent()}
          </PaymentSection>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <ConfirmButton 
              onClick={handleConfirmPurchase}
              disabled={loading || (metodoSeleccionado === 'mercadopago' || metodoSeleccionado === 'paypal')}
            >
              {loading ? 'Procesando...' : 'Confirmar Compra'}
            </ConfirmButton>
            <CancelButton 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </CancelButton>
          </ButtonGroup>
        </CheckoutCard>
      </Container>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <>
          <SuccessModal>
            <SuccessContent>
              <SuccessIcon>✓</SuccessIcon>
              <SuccessTitle>¡Compra Confirmada!</SuccessTitle>
              <SuccessMessage>
                Tu compra ha sido procesada exitosamente. 
                Recibirás un email de confirmación con los detalles de tu pedido.
              </SuccessMessage>
              <HomeButton onClick={handleGoHome}>
                Volver al Inicio
              </HomeButton>
            </SuccessContent>
          </SuccessModal>
          <ModalOverlay onClick={handleGoHome} />
        </>
      )}

      {/* Modal de confirmación de cancelación */}
      {showCancelModal && (
        <CancelModal>
          <CancelContent>
            <CancelTitle>¿Estás seguro de que quieres cancelar esta compra?</CancelTitle>
            <CancelButtons>
              <CancelModalButton 
                onClick={handleConfirmCancel}
                disabled={loading}
              >
                Confirmar
              </CancelModalButton>
              <CancelButton 
                onClick={handleCancelModalClose}
                disabled={loading}
              >
                Cancelar
              </CancelButton>
            </CancelButtons>
          </CancelContent>
        </CancelModal>
      )}
    </>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background-color: #121212;
  color: white;
  min-height: 100vh;
`;

const CheckoutCard = styled.div`
  background: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid #333;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
`;

const UserInfo = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #252525;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  h3 {
    color: #00ff00;
    margin-bottom: 0.8rem;
  }
  
  p {
    margin: 0.5rem 0;
    color: #ccc;
  }
`;

const OrderSummary = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    color: #00ff00;
    margin-bottom: 1rem;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  margin: 0.8rem 0;
  padding: 0.8rem;
  background: #252525;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.1);
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 1rem;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div`
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const ItemDetails = styled.div`
  font-size: 0.9rem;
  color: #aaa;
  
  span {
    display: block;
    margin: 0.2rem 0;
  }
`;

const TotalSection = styled.div`
  margin: 1.5rem 0;
  padding: 1.2rem;
  background: #252525;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: #fff;
`;

const TotalAmount = styled.div`
  font-size: 1.6rem;
  color: #00ff00;
  font-weight: bold;
`;

const PaymentSection = styled.div`
  margin: 2rem 0;
  
  h3 {
    color: #00ff00;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentMethod = styled.div`
  padding: 1.2rem 1rem;
  background: #252525;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: #303030;
  }

  &.seleccionado {
    background: #252525;
    color: #00ff00;
    border-color: #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }
`;

const PaymentIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const PaymentText = styled.div`
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  color: #fff;
`;

const PaymentMethodMessage = styled.div`
  margin-top: 1rem;
  padding: 1.2rem;
  background: #252525;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #fcd53f;
  font-weight: 500;
  text-align: center;
`;

const CardForm = styled.form`
  background: #252525;
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 1.5rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
`;

const CardFormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const CardLabel = styled.label`
  display: block;
  margin-bottom: 0.6rem;
  font-weight: bold;
  color: #eee;
`;

const CardInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  background: #1a1a1a;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #00ff00;
    box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.2);
    outline: none;
  }
`;

const CardFormRow = styled.div`
  display: flex;
  gap: 1.2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const CardButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #fcd53f;
  border: none;
  border-radius: 8px;
  color: #000000;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    background: #ffcc00;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    background: #555;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 1.2rem;
  background: #fcd53f;
  border: none;
  border-radius: 8px;
  color: #000000;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    background: #ffcc00;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    background: #555;
    color: #aaa;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 1.2rem;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #444;
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 6px;
  border-left: 4px solid #ff6b6b;
`;

const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const SuccessContent = styled.div`
  background: #1e1e1e;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
  border: 1px solid #333;
`;

const SuccessIcon = styled.div`
  font-size: 3.5rem;
  color: #00ff00;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
`;

const SuccessTitle = styled.h3`
  margin: 0 0 1.2rem 0;
  color: #00ff00;
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
`;

const SuccessMessage = styled.p`
  margin: 0 0 2rem 0;
  color: white;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const HomeButton = styled.button`
  padding: 1rem 2rem;
  background: #00ff00;
  border: none;
  border-radius: 8px;
  color: #000000;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);

  &:hover {
    background: #00cc00;
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 255, 0, 0.4);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  backdrop-filter: blur(3px);
`;

const CancelModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const CancelContent = styled.div`
  background: #1e1e1e;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-width: 450px;
  width: 90%;
  border: 1px solid #333;
`;

const CancelTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #fcd53f;
  font-size: 1.5rem;
`;

const CancelButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CancelModalButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: #fcd53f;
  border: none;
  border-radius: 8px;
  color: #000000;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    background: #ffcc00;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Nuevos estilos para descuentos en checkout
const PriceWithDiscount = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DiscountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DiscountBadge = styled.span`
  background: #ff4444;
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const OriginalPrice = styled.span`
  color: #ff4444;
  text-decoration: line-through;
  font-size: 0.9rem;
`;

const FinalPriceText = styled.span`
  color: #00ff00;
  font-weight: bold;
`;

const SubtotalText = styled.span`
  color: ${props => props.hasDiscount ? '#00ff00' : 'inherit'};
  font-weight: ${props => props.hasDiscount ? 'bold' : 'normal'};
`;

// Estilos para la sección de ahorros
const SavingsSection = styled.div`
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const SavingsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  span {
    color: #fff;
  }
`;

const OriginalTotalAmount = styled.span`
  color: #ff4444;
  text-decoration: line-through;
  font-weight: bold;
`;

const SavingsAmount = styled.span`
  color: #00ff00;
  font-weight: bold;
  font-size: 1.1rem;
`;

export default CheckoutPage;