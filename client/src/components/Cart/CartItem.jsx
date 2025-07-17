import React from 'react';
import styled from 'styled-components';

const CartItemComponent = ({ item, onRemove, onQuantityChange, loading }) => {
  const originalPrice = parseFloat(item.price);
  const hasDiscount = item.discountActive && item.discountPercentage > 0;
  const finalPrice = hasDiscount ? originalPrice * (1 - item.discountPercentage / 100) : originalPrice;
  const totalPrice = finalPrice * item.quantity;

  const getImageUrl = (item) => {
    if (Array.isArray(item.urlImage)) {
      return item.urlImage[0];
    }
    return item.image || item.img_url || item.urlImage;
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > item.stock) {
      // El componente padre maneja el mensaje de stock
      return;
    }
    onQuantityChange(item, newQuantity);
  };

  return (
    <CartItem>
      <ItemHeader>
        <ItemTitle>{item.title}</ItemTitle>
        <RemoveButton onClick={() => onRemove(item.id)}>
          Eliminar
        </RemoveButton>
      </ItemHeader>
      <ItemContent>
        <ItemImageContainer>
          <ItemImage 
            src={getImageUrl(item)} 
            alt={item.title}
          />
        </ItemImageContainer>
        <ItemDetails>
          <PriceSection>
            {hasDiscount ? (
              <PriceWithDiscount>
                <DiscountBadge>{item.discountPercentage}% OFF</DiscountBadge>
                <OriginalPrice>${originalPrice.toFixed(2)}</OriginalPrice>
                <FinalPrice>${finalPrice.toFixed(2)}</FinalPrice>
              </PriceWithDiscount>
            ) : (
              <ItemPrice>${finalPrice.toFixed(2)}</ItemPrice>
            )}
          </PriceSection>
          <QuantityControls>
            <QuantityButton 
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={loading || item.quantity <= 1}
            >
              -
            </QuantityButton>
            <QuantityDisplay>{item.quantity}</QuantityDisplay>
            <QuantityButton 
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={loading || item.quantity >= item.stock}
            >
              +
            </QuantityButton>
          </QuantityControls>
          <SubtotalSection>
            <SubtotalText>Subtotal: ${totalPrice.toFixed(2)}</SubtotalText>
          </SubtotalSection>
        </ItemDetails>
      </ItemContent>
    </CartItem>
  );
};

// Styled Components
const CartItem = styled.div`
  background: rgba(40, 40, 40, 0.9);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const ItemTitle = styled.h4`
  color: #ffffff;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff4444;
    color: white;
  }
`;

const ItemContent = styled.div`
  display: flex;
  gap: 1rem;
`;

const ItemImageContainer = styled.div`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ItemPrice = styled.span`
  color: #00ff00;
  font-weight: bold;
  font-size: 1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  color: #00ff00;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(0, 255, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  color: #ffffff;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
`;

const SubtotalSection = styled.div`
  align-self: flex-end;
`;

const SubtotalText = styled.span`
  color: #00ff00;
  font-weight: bold;
  font-size: 1rem;
`;

// Nuevos estilos para descuentos
const PriceWithDiscount = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DiscountBadge = styled.span`
  background: #ff4444;
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  align-self: flex-start;
`;

const OriginalPrice = styled.span`
  color: #ff4444;
  text-decoration: line-through;
  font-size: 0.9rem;
`;

const FinalPrice = styled.span`
  color: #00ff00;
  font-weight: bold;
  font-size: 1.1rem;
`;

export default CartItemComponent;
