import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useBuys } from '../../hooks/useBuys';
import { useDispatch } from 'react-redux';
import { setBuyId } from '../../store/slices/buySlice';
import CartItemComponent from './CartItem';
import { toast } from 'react-toastify';

const Cart = ({ isOpen, onClose }) => {
  const { canViewCart, role, token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getItemCount,
    clearCart 
  } = useCart();
  const { createBuy, loading: buyLoading, error: buyError } = useBuys();
  const dispatch = useDispatch();

  const [stockMessage, setStockMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  if (!canViewCart()) return null;

  const getImageUrl = (item) => {
    if (Array.isArray(item.urlImage)) {
      return item.urlImage[0];
    }
    return item.image || item.img_url || item.urlImage;
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > item.stock) {
      setStockMessage(`Solo hay ${item.stock} unidades disponibles de ${item.title}`);
      setTimeout(() => setStockMessage(''), 3000);
    }
    updateQuantity(item.id, newQuantity);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated || !token) {
      toast.info(
        <div style={{margin: '1rem'}}>
          <p style={{fontSize: '1rem'}}>🔐 Necesitas iniciar sesión para continuar</p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', justifyContent: 'center', alignItems: 'center'  }}>
            <button 
              onClick={() => {
                toast.dismiss();
                navigate('/login');
              }}
              style={{
                background: '#00ffd5ff',
                color: '#000',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                width: '8rem'
              }}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => {
                toast.dismiss();
                navigate('/register');
              }}
              style={{
                background: '#ff4000ff',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                width: '8rem'
              }}
            >
              Registrarse
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear la compra directamente
      const buyData = await createBuy(cartItems, token);
      console.log('Compra creada:', buyData);

      // Guardamos el ID de la compra en Redux (persistido)
      dispatch(setBuyId(buyData.id));

      onClose(); 
      navigate('/checkout'); 
    } catch (err) {
      setError(err.message || 'Error al procesar el carrito. Por favor, intenta nuevamente.');
      console.error('Error en checkout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CartModal $isOpen={isOpen}>
        <CartHeader>
          <h2>Tu Carrito</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </CartHeader>

        <CartContent>
          {error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}
          
          {stockMessage && (
            <StockWarning>{stockMessage}</StockWarning>
          )}
          
          {cartItems.length === 0 ? (
            <EmptyCart>Tu carrito está vacío</EmptyCart>
          ) : (
            <>
              {cartItems.map(item => (
                <CartItemComponent 
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                  onQuantityChange={handleQuantityChange}
                  loading={loading}
                />
              ))}

              <CartFooter>
                {(() => {
                  const originalTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
                  const finalTotal = getCartTotal();
                  const totalSavings = originalTotal - finalTotal;
                  const hasAnyDiscount = cartItems.some(item => item.discountActive && item.discountPercentage > 0);

                  return hasAnyDiscount ? (
                    <>
                      <SavingsInfo>
                        <OriginalTotal>Total original: ${originalTotal.toFixed(2)}</OriginalTotal>
                        <SavingsAmount>Ahorras: ${totalSavings.toFixed(2)}</SavingsAmount>
                      </SavingsInfo>
                      <Total>
                        Total: ${finalTotal.toFixed(2)}
                      </Total>
                    </>
                  ) : (
                    <Total>
                      Total: ${finalTotal.toFixed(2)}
                    </Total>
                  );
                })()}
                <CheckoutButton 
                  onClick={handleCheckout}
                  disabled={loading || buyLoading}
                >
                  {loading || buyLoading ? 'Procesando...' : 'Proceder al pago'}
                </CheckoutButton>
              </CartFooter>
            </>
          )}
        </CartContent>
      </CartModal>

      {isOpen && <Overlay onClick={onClose} />}
    </>
  );
};

const CartModal = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.$isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background: #242424;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

const CartHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #404040;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    color: #ffffff;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 0 5px;

  &:hover {
    color: #00ff00;
  }
`;

const CartContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
`;

const EmptyCart = styled.div`
  color: #a8a8a8;
  text-align: center;
  padding: 20px;
`;

const CartItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-bottom: 1px solid #404040;
  gap: 10px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const ItemContent = styled.div`
  display: flex;
  gap: 15px;
`;

const ItemImageContainer = styled.div`
  width: 70px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #333;
  flex-shrink: 0;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const ItemTitle = styled.span`
  color: #ffffff;
  font-weight: 500;
  font-size: 1rem;
  padding-right: 20px;
  line-height: 1.2;
`;

const ItemPrice = styled.span`
  color: #00ff00;
  font-weight: 600;
  font-size: 1.1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const QuantityButton = styled.button`
  background: #333333;
  color: #ffffff;
  border: 1px solid #404040;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-color: #00ff00;
    color: #00ff00;
  }
`;

const QuantityDisplay = styled.span`
  color: #ffffff;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 5px;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const CartFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #404040;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Total = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: right;
`;

// Nuevos estilos para información de ahorros en carrito
const SavingsInfo = styled.div`
  text-align: right;
  margin-bottom: 0.5rem;
`;

const OriginalTotal = styled.div`
  color: #ff4444;
  text-decoration: line-through;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const SavingsAmount = styled.div`
  color: #00ff00;
  font-weight: bold;
  font-size: 1rem;
`;

const CheckoutButton = styled.button`
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: #00ff00;
  border: 1px solid #404040;
  padding: 12px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.2);
    border-color: #00ff00;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const StockWarning = styled.div`
  background-color: #ff4444;
  color: white;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
`;

const StockInfo = styled.span`
  color: #808080;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const ErrorMessage = styled.div`
  background-color: #ff4444;
  color: white;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
`;

export default Cart;