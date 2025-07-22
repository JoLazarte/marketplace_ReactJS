import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth';
const API_URL_BOOKS = 'http://localhost:8080/books';
const API_URL_DISCS = 'http://localhost:8080/musicAlbums';

const DetailPage = () => {
  const { type, id } = useParams();
  const { addToCart } = useCart();
  const {isAdmin} = useAuth();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const isAdminOn = isAdmin()

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchItem = async () => {
      try {
        let url;
        if (type === 'disc') {
          url = `${API_URL_DISCS}/${id}`;
        } else {
          url = `${API_URL_BOOKS}/${id}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (type === 'disc') {
          setItem(data.data ? data.data : data);
        } else {
          if (data && data.ok && data.data) {
            setItem(data.data);
          } else {
            setItem(null);
          }
        }
      } catch (err) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [type, id]);

  if (loading) {
    return (
      <Container>
        <Card>
          <h1 style={{ color: "#fff" }}>Cargando...</h1>
        </Card>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container>
        <Card>
          <h1>Producto no encontrado</h1>
          <p>Lo sentimos, el producto que buscas no está disponible.</p>
        </Card>
      </Container>
    );
  }

  const isDisc = type === 'disc';

  const handleDecrease = () => {
    
    if (quantity > 1) {
        setQuantity(prev => prev - 1);
    }
    
  };

  const handleIncrease = () => {
   
    if (quantity < item.stock) {
      setQuantity(prev => prev + 1);
     
    }
  };

  const handleAddToCart = () => {
    
    const itemToAdd = {
        ...item,
        quantity: quantity,
        price: item.price,
        discountPercentage: item.discountPercentage || 0,
        discountActive: item.discountActive || false
    };
      addToCart(itemToAdd);
    
  };

  const renderPrice = () => {
    const hasDiscount = item.discountActive && item.discountPercentage > 0;
    const originalPrice = parseFloat(item.price);
    const finalPrice = hasDiscount ? originalPrice * (1 - item.discountPercentage / 100) : originalPrice;

    if (hasDiscount) {
      return (
        <PriceSection>
          <DiscountHeader>
            <DiscountBadge>{item.discountPercentage}% OFF</DiscountBadge>
            <DiscountLabel>¡OFERTA ESPECIAL!</DiscountLabel>
          </DiscountHeader>
          <PriceContainer>
            <OriginalPrice>${originalPrice.toFixed(2)}</OriginalPrice>
            <FinalPrice>${finalPrice.toFixed(2)}</FinalPrice>
          </PriceContainer>
          <SavingsText>
            💰 Ahorras ${(originalPrice - finalPrice).toFixed(2)}
          </SavingsText>
        </PriceSection>
      );
    }
    
    return <Price>${originalPrice.toFixed(2)}</Price>;
  };

  // Imagen robusta
  const imageUrl = item.image || item.img_url || item.urlImage || (Array.isArray(item.urlImage) ? item.urlImage[0] : '');

  // Géneros robustos
  const genresArray = isDisc
    ? Array.isArray(item.genres) ? item.genres : []
    : Array.isArray(item.genreBooks) ? item.genreBooks : [];

  return (
    <Container>
      <Card>
        <ImageContainer>
          <img src={imageUrl} alt={item.title} />
        </ImageContainer>
        <InfoContainer>
          <Title>{item.title}</Title>
          <Author>{item.author}</Author>
          {isDisc ? (
            <RecordInfo>
              <DetailRow>
                <DetailLabel>Discográfica:</DetailLabel>
                <DetailValue>{item.recordLabel}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Año:</DetailLabel>
                <DetailValue>{item.year}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>ISRC:</DetailLabel>
                <DetailValue>{item.isrc}</DetailValue>
              </DetailRow>
            </RecordInfo>
          ) : (
            <BookInfo>
              <DetailRow>
                <DetailLabel>Editorial:</DetailLabel>
                <DetailValue>{item.editorial}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>ISBN:</DetailLabel>
                <DetailValue>{item.isbn}</DetailValue>
              </DetailRow>
            </BookInfo>
          )}

          <Description>{item.description}</Description>

          <GenreContainer>
            {genresArray.map((genre, index) => (
              <GenreTag key={index}>{genre}</GenreTag>
            ))}
          </GenreContainer>

          {renderPrice()}

           {item.stock > 0 ? (
            <StockContainer className={isAdminOn? 'stockContDisabled': ''}>
              <StockStatus>✔ ¡En stock!</StockStatus>
              <QuantityContainer>
                 <QuantityControl>
                   <QuantityButton  type='button'  onClick={handleDecrease} className={isAdminOn? 'disabled': ''}>−</QuantityButton>
                   <QuantityDisplay>{quantity}</QuantityDisplay>
                   <QuantityButton  type='button' onClick={handleIncrease} className={isAdminOn? 'disabled': ''}  >+</QuantityButton>
                 </QuantityControl>
                 <AddToCartButton  type='button' onClick={handleAddToCart} className={isAdminOn? 'disabled': ''} >
                   Agregar al carrito
                 </AddToCartButton>
               </QuantityContainer>
              <StockInfo>Stock disponible: {item.stock}</StockInfo>
            </StockContainer>
          ) : (
            <NoStockMessage>No hay stock disponible</NoStockMessage>
          )}
        </InfoContainer>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 7rem;
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

  .disabled {
   
    pointer-events: none;
    user-select: none;
  
  }

`
const Card = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      rgba(0, 255, 174, 0.3) 0%,
      rgba(255, 68, 68, 0.3) 25%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(0, 255, 213, 0.3) 75%,
      rgba(255, 68, 68, 0.3) 100%
    );
    border-radius: 30px;
    z-index: -1;
    animation: borderGlow 4s linear infinite;
    opacity: 0.6;
  }

  @keyframes borderGlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  &:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 
      0 40px 80px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 1rem;
  }
`

const ImageContainer = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;
  }

  img {
    max-width: 100%;
    max-height: 500px;
    object-fit: contain;
    border-radius: 20px;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.08);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    z-index: 2;

    &:hover {
      transform: scale(1.08) rotateY(8deg) rotateX(2deg);
      box-shadow: 
        0 35px 70px rgba(0, 0, 0, 0.7),
        0 0 0 1px rgba(255, 255, 255, 0.15),
        0 0 30px rgba(255, 255, 255, 0.05);
    }
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }
`

const InfoContainer = styled.div`
  flex: 1.2;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: rgba(0, 0, 0, 0.2);
`

const Title = styled.h1`
  font-size: 2rem;
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`

const Author = styled.h2`
  font-size: 1.1rem;
  background: linear-gradient(135deg, #a8a8a8 0%, #d4d4d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  padding:0;
  font-weight: 600;
`

const Description = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  margin:0;
`

const Price = styled.div`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00ffd5ff 0%, #00ccbeff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 1rem 0;
  filter: drop-shadow(0 2px 4px rgba(0, 255, 242, 0.3));
`

// Nuevos estilos para descuentos
const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.4rem 1.6rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 68, 68, 0.08) 0%, rgba(0, 255, 195, 0.08) 100%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(255, 68, 68, 0.1) 90deg,
      transparent 180deg,
      rgba(0, 255, 191, 0.1) 270deg,
      transparent 360deg
    );
    animation: rotate 8s linear infinite;
    pointer-events: none;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const DiscountHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
`

const DiscountLabel = styled.span`
  color: #ff4444;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  opacity: 0.9;
  text-shadow: 0 2px 4px rgba(255, 68, 68, 0.3);
`

const DiscountBadge = styled.div`
  background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
  color: white;
  padding: 0.6rem 1.1rem;
  border-radius: 25px;
  font-weight: bold;
  font-size: 0.95rem;
  box-shadow: 
    0 6px 20px rgba(255, 68, 68, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: pulse 2s infinite;
  position: relative;
  z-index: 2;

  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 6px 20px rgba(255, 68, 68, 0.4);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 8px 25px rgba(255, 68, 68, 0.6);
    }
  }
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const OriginalPrice = styled.span`
  font-size: 1.2rem;
  color: rgba(255, 68, 68, 0.7);
  text-decoration: line-through;
  font-weight: 500;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ff4444, #cc0000);
    transform: translateY(-50%);
  }
`

const FinalPrice = styled.span`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00ffd5ff 0%, #00ccbeff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 255, 242, 0.3));  
  text-shadow: 0 0 20px rgba(0, 255, 191, 0.3);
  animation: glow 3s ease-in-out infinite alternate;

  @keyframes glow {
    from {
      filter: drop-shadow(0 4px 12px rgba(0, 255, 191, 0.5));
    }
    to {
      filter: drop-shadow(0 6px 20px rgba(0, 255, 195, 0.8));
    }
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`

const SavingsText = styled.div`
  color: #00ffccff;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
  padding: 0.5rem 0.9rem;
  background: rgba(0, 255, 195, 0.1);
  border-radius: 12px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(0, 255, 179, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 255, 187, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(0, 255, 195, 0.1) 50%, transparent 70%);
    animation: shimmer 2s infinite;
    border-radius: 12px;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`

const DetailRow = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0.8rem;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`

const DetailLabel = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  min-width: 100px;
`

const DetailValue = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
`

const RecordInfo = styled.div`
  margin: 0;
  background: rgba(255, 255, 255, 0.02);
  padding: 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`

const BookInfo = styled.div`
  margin: 0;
  background: rgba(255, 255, 255, 0.02);
  padding: 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
`

const GenreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 0;
  padding:0;
`

const GenreTag = styled.span`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      left: 100%;
    }
  }

  &:nth-child(even) {
    background: rgba(0, 255, 179, 0.08);
    border-color: rgba(0, 255, 195, 0.2);

    &:hover {
      background: rgba(0, 255, 179, 0.08);
      box-shadow: 0 8px 25px rgba(0, 255, 191, 0.3);
    }
  }

  &:nth-child(3n) {
    background: rgba(255, 68, 68, 0.08);
    border-color: rgba(255, 68, 68, 0.2);

    &:hover {
      background: rgba(255, 68, 68, 0.15);
      box-shadow: 0 8px 25px rgba(255, 68, 68, 0.3);
    }
  }
`

const StockContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1rem;
  background: rgba(0, 255, 208, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 204, 0.2);
  backdrop-filter: blur(10px);

  &.stockContDisabled {
    filter: grayscale(0.7) brightness(0.7);
   
  }
`

const StockStatus = styled.p`
  color: #00ffd5ff;
  font-weight: 600;
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const QuantityButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(0, 255, 195, 0.2);
    color: #00ffc8ff;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

`

const QuantityDisplay = styled.span`
  color: #ffffff;
  padding: 0 1.5rem;
  min-width: 3rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
`

const AddToCartButton = styled.button`
  background: linear-gradient(135deg, #00ffb3ff 0%, #00ccb8ff 100%);
  border: none;
  padding: 0.7rem 1.1rem;
  border-radius: 12px;
  color: #0d2e2bff;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 
    0 8px 25px rgba(0, 255, 183, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 15px 35px rgba(0, 255, 191, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(1.0);
  }
`

const StockInfo = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
`

const NoStockMessage = styled.div`
  color: #ff4444;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 1.5rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 68, 68, 0.3);
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(255, 68, 68, 0.2);
`

export default DetailPage